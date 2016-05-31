package elasticsearch;

import java.io.IOException;
import java.lang.Exception;
import java.util.List;

import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.client.Client;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.admin.indices.flush.FlushRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;
import org.elasticsearch.action.search.SearchType;

import esfeeder.Article;
import esfeeder.ArticleId;

/**
 *
 * @author akolb
 * @author dbeckstein
 */

public class ElasticSearchWriter extends ElasticSearchController{

	//var is hardcoded, because it's not necessary to create writers with custom indexes
	private final String mainIndex = "mainIndex";

	/**
	 * Creates an index in ES
	 * jsonBuilder throws an IOException if an issue occurs
	 */
	private void createIndex(String indexName) throws IOException, Exception{

		CreateIndexRequestBuilder indexBuilder = client.admin().indices().prepareCreate(indexName);
		indexBuilder.addMapping(indexType, jsonBuilder()
        		.startObject()
                	.startObject(obj_title)
                    	.field("type","string")
                        .field("index", "analyzed")
                    .endObject()
                    .startObject(obj_pubDate)
                    	.field("type","date")
                        .field("index", "analyzed")
                    .endObject()
                    .startObject(obj_content)
                    	.field("type","string")
                        .field("index", "analyzed")
                    .endObject()
                    .startObject(obj_author)
                    	.field("type","string")
                        .field("index", "not_analyzed")
                    .endObject()
                    .startObject(obj_topic)
                    	.field("type","string")
                        .field("index", "not_analyzed")
                    .endObject()
                    .startObject(obj_source)
                    	.field("type","string")
                        .field("index", "not_analyzed")
                    .endObject()
                    .startObject(obj_url)
                    	.field("type","string")
                        .field("index", "not_analyzed")
                    .endObject()
        		.endObject()
        );

        //executes and get's the response
        CreateIndexResponse createResponse = indexBuilder.get();

        //Check if index is created
        if (!createResponse.isAcknowledged()) {
            throw new Exception("Failed to create index <" + indexName + ">");
        }else{
/*DEBUG*/System.out.println("The index "+ indexName +" was created");
        }


	}

	/*
	 * indexes an object in the ES db
	 * jsonBuilder throws an IOException if an issue occurs
	 */
	private void put(Article article, String index) throws IOException{

		//Werte aus dem Artikelobjekt rauslesen
		String id = article.getArticleId().getId(), title = article.getTitle(), pubDate = article.getPubDate(), content = article.getExtractedText(), author = article.getAuthor(), topic = article.getTopic(), source = article.getSource(), url = article.getUrl();

		//get() executes and gets the response
		IndexResponse indexResponse = client.prepareIndex(index, this.indexType, id)
            .setSource(jsonBuilder()
                .startObject()
                    .field(obj_title, title)
                    .field(obj_pubDate, pubDate)
                    .field(obj_content, content)
                    .field(obj_author, author)
                    .field(obj_topic, topic)
                    .field(obj_source, source)
                    .field(obj_url, url)
                .endObject()
            ).get();

/*DEBUG*/String _index = indexResponse.getIndex(), _type = indexResponse.getType(), _id = indexResponse.getId();
            // Version (if it's the first time you index this document, you will get: 1)
            long _version = indexResponse.getVersion();
            // isCreated() is true if the document is a new one, false if it has been updated
            boolean created = indexResponse.isCreated();
            System.out.println("Index: " + _index + " Type: " + _type + " ID: " + _id + " Version: " + _version + " Indexed(t) or Updated(f): " +created);

	}

	/**
	 * is called whenever an Article should be indexed
	 * identical article
	 * if true -> don't add to DB
	 */
	private boolean articleIsAlreadyIndexed(Article article, String indexName){

		String id = article.getId().getId();

		//executes and gets the response
		GetResponse getResponse = client.prepareGet(indexName, indexType, id).get();
		return getResponse.isExists();
	}

	/**
	 * is called whenever an Article should be indexed
	 * similair article
	 * if true -> don't add to DB
	 */
	private boolean similairArticleIsAlreadyIndexed( Article article, String indexName ){

		String id = article.getExtractedText();

		//Only the contents are compared
		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).likeText(content); //deprecated
//		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).like(content);

		//Execute and get a response
		SearchResponse searchResponse = client.prepareSearch(indexName)
                .setTypes(indexType)
                .setSearchType(SearchType.QUERY_AND_FETCH) //arbitrary choice, see http://javadoc.kyubu.de/elasticsearch/v2.2.0/org/elasticsearch/action/search/SearchType.html
                .setQuery(queryBuilder)
                //.setFrom(0) //0 is default
                .setSize(1) //because one hit is enough
                .get();

        //check the total number of hits that matches the search request
		return searchResponse.getHits().totalHits() > 0.00;
	}

	/**
	 * Also creates indexes
	 * Throws the Exceptions from createIndex, especially because the Writer is unusable if one Index is missing.
	 */
	public ElasticSearchWriter() throws IOException, Exception{

		super();

		// org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse.isExists()
		boolean mainIndex_exists =  client.admin().indices().prepareExists(mainIndex).get().isExists();
		boolean searchIndex_exists =  client.admin().indices().prepareExists(searchIndex).get().isExists();

		if(!searchIndex_exists){
			createIndex(searchIndex);
		}
		if( !mainIndex_exists ){
			createIndex(mainIndex);
		}
	}

	/*
	 * puts an article in both indexes
	 * passes the IOException from private put()
	 */
	public void put( Object o ) throws IOException{

		//Only index unless it is already in
		if(!this.articleIsAlreadyIndexed( o, mainIndex )){
			this.put( o, mainIndex );
		}

		//Only index if there aren't similair articles indexed
		if(!this.similairArticleIsAlreadyIndexed( o, searchIndex )){
			this.put( o, searchIndex );
		}

		/*
		makes sure, that no data is in the node
		new FlushRequest(): no parameters, so all indices are flushed
		force(true): forces to flush, even if it is not necessary
		actionGet(): execute and return a org.elasticsearch.action.admin.indices.flush.FlushResponse which isn't used
		*/
		client.admin().indices().flush( new FlushRequest().force(true) ).actionGet();

	}

	/*
	 * puts a list of articles in both indexes
	 * passes the IOException from public put()
	 */
	public void putMany( List<Object> l ) throws IOException{

		for( Object o : l ){
			this.put( o );
		}

	}

	/*
	 * deletes an object from an index
	 * needs the name and type of the created index and an ID for the object
	 * obsolete?
     */
	public void delete(){}

	/*
	 * returns an object from the ES db
	 * needs the name and type of the created index and an ID for the object
	 */

	public void getAll(){}

	/**
	 * needed?
	 *
	 */
	public void getSimilair(){}





}