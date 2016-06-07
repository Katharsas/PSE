package elasticsearch;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.flush.FlushRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import org.elasticsearch.search.SearchHit;

import shared.Article;
import shared.metadata.MetaDataSerializer;
import shared.metadata.MetaDataSerializer.ElasticSearchMetaDataWriter;
import shared.metadata.MetaDataType;

/**
 *
 * @author akolb
 * @author dbeckstein
 * @author jmothes
 */

public class ElasticSearchWriter extends ElasticSearchController
		implements ElasticSearchMetaDataWriter {

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

		String id = article.getArticleId().getId();

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

		String content = article.getExtractedText();

		//Only the contents are compared
		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).likeText(content); //deprecated
//		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).like(content);

		//Execute and get a response
		SearchResponse searchResponse = client.prepareSearch(indexName)
                .setTypes(indexType)
                .setSearchType(SearchType.QUERY_AND_FETCH) //arbitrary choice, see http://javadoc.kyubu.de/elasticsearch/v2.2.0/org/elasticsearch/action/search/SearchType.html
                .setQuery(queryBuilder)
                //.setFrom(0) //0 is default
                //.setSize(10) //10 is default; either it returns 10 items per hitlist or 10 in total; NEEDS TO BE TESTED
                .get();

        for (SearchHit hit : searchResponse.getHits().hits()) {
        		
//                  new Article().setArticleId( new ArticleId().setId(  ) )
//                  .setTitle(hit.getSource().get(obj_title))
//                  .setPubDate(hit.getSource().get(obj_pubDate))
//                  .setExtractedText(hit.getSource().get(obj_ExtractedText))
//                  .setAuthor(hit.getSource().get(obj_source))
//                  .setTopic(hit.getSource().get(obj_topic))
//                  .setUrl(hit.getSource().get(obj_url));
                  
                  System.out.println(hit.getScore());
        }
        return false;
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
	public void put(Article article) throws IOException{

		//Only index unless it is already in
		if(!this.articleIsAlreadyIndexed(article, mainIndex)){
			this.put(article, mainIndex);
		}

		//Only index if there aren't similair articles indexed
		if(!this.similairArticleIsAlreadyIndexed(article, searchIndex)){
			this.put(article, searchIndex);
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
	public void putMany( List<Article> list ) throws IOException{

		for( Article article : list ){
			this.put( article );
		}

	}

	/*
	 * deletes an object from an index
	 * needs the name and type of the created index and an ID for the object
	 * obsolete?
     */
	public void delete(){}


	/**
	 * Merge new metaData from new articles with old metaData from old article and save result.
	 */
	private void mergeMetaData(Collection<String> newMetaData, MetaDataType filterType){
    	Set<String> current = MetaDataSerializer.deserializeSet(filterType, this);
        current.addAll(newMetaData);
        MetaDataSerializer.serializeSet(current, filterType, this);
    }

	
	@Override
	public void writeMetaDataToIndex(String encoded, MetaDataType filterType) {
		// TODO Overwrite document at metaData index of given type
	}
}