package elasticsearch;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.flush.FlushRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.AdminClient;
import org.elasticsearch.client.IndicesAdminClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import org.elasticsearch.search.SearchHit;

import shared.Article;
import shared.ElasticSearchController;
import shared.metadata.MetaDataType;


/**
 * Provides methods to add indices, articles and metadata to ESServer.
 * @author akolb
 * @author dbeckstein
 * @author jmothes
 */
public class ElasticSearchWriter extends ElasticSearchController {

	//var is hardcoded, because it's not necessary to create writers with custom indexes
	//private final static String mainIndex = "main-index";

	/**
	 * Creates an admin connection to ElasticSearch.
	 * Creates all necessary indexes if they don't yet exist.
	 * @exception see {@link #createIndex(String)}
	 */
	public ElasticSearchWriter() throws IOException {
		super();

		// org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse.isExists()
		AdminClient adminClient =  this.client.admin();
		System.out.println(adminClient);
		IndicesAdminClient client = adminClient.indices();
		boolean searchIndex_exists =  client.prepareExists(searchIndex).get().isExists();
		boolean metaIndex_exists =  client.prepareExists(metaIndex).get().isExists();

		if(!searchIndex_exists){
			createSearchIndex();
		}
		if(!metaIndex_exists){
			createMetaIndex();
		}
	}

	/**
	 * Creates an index in ElasticSearch.
	 * @exception IOException thrown by {@link org.elasticsearch.common.xcontent.XContentBuilder}
	 * 		used to create JSON indexes.
	 */
	private void createSearchIndex() throws IOException {

		final String indexName = searchIndex;

		CreateIndexRequestBuilder indexBuilder = client.admin().indices().prepareCreate(indexName);
		// TODO settings deutsch/englisch
		indexBuilder.setSettings(Settings.builder().loadFromSource(jsonBuilder()
                .startObject()
                .endObject().string()));

		indexBuilder.addMapping(indexType, jsonBuilder()
        		.startObject()
	        		.startObject("properties")
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
	                        .field("index", "analyzed")
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
	        	.endObject()
        );
		CreateIndexResponse createResponse = indexBuilder.get();

		//Check if index is created
        if (!createResponse.isAcknowledged()) {
            throw new IllegalStateException("Failed to create index <" + indexName + ">");
        }else{
        	System.out.println("The index "+ indexName +" was created");
        }
    }
    /**
     * Creates an index for Metainfo (in our case for Topic and Source)
     *
     */
    private void createMetaIndex() throws IOException {

    	final String indexName = metaIndex;

		CreateIndexRequestBuilder indexBuilder = client.admin().indices().prepareCreate(indexName);
		indexBuilder.addMapping(metaIndexType, jsonBuilder()
        		.startObject()
	        		.startObject("properties")
	                	.startObject(meta_data)
		                	.field("type","string")
		                    .field("index", "no")
	                    .endObject()
	        		.endObject()
        		.endObject()
		);

        //executes and get's the response
        CreateIndexResponse createResponse = indexBuilder.get();

        //Check if index is created
        if (!createResponse.isAcknowledged()) {
            throw new IllegalStateException("Failed to create index <" + indexName + ">");
        } else{
        	System.out.println("The index "+ indexName +" was created");
        }
	}

	/**
	 * Puts an article into the ES search index, if there are no too similar articles in the
	 * index already.
	 * 
	 * @exception IOException thrown by {@link org.elasticsearch.common.xcontent.XContentBuilder} used 
	 * 		to convert articles to json for ElasticSearch
	 */
	private void put(Article article, String index) throws IOException{

		//Only index if there aren't similar articles indexed
		if(!this.similairArticleIsAlreadyIndexed(article, index)){
			System.out.println(article.toString());

			//get values from article object
			String id = article.getArticleId().getId();

//			System.out.println("ID ADDED:");
//			System.out.println(id);

			//get() executes and gets the response
			IndexResponse indexResponse = client.prepareIndex(index, indexType, id)
	            .setSource(jsonBuilder()
	                .startObject()
	                    .field(obj_title, article.getTitle())
	                    .field(obj_pubDate, article.getPubDate())
	                    .field(obj_content, article.getExtractedText())
	                    .field(obj_author, article.getAuthor())
	                    .field(obj_topic, article.getTopic())
	                    .field(obj_source, article.getSource())
	                    .field(obj_url, article.getUrl())
	                .endObject()
	            ).get();

			/*DEBUG*/
//			String _index = indexResponse.getIndex(), _type = indexResponse.getType(), _id = indexResponse.getId();
	        // Version (if it's the first time you index this document, you will get: 1)
//	        long _version = indexResponse.getVersion();
	        // isCreated() is true if the document is a new one, false if it has been updated
//	        boolean created = indexResponse.isCreated();
//	        System.out.println("Index: " + _index + " Type: " + _type + " ID: " + _id + " Version: " + _version + " Indexed(t) or Updated(f): " +created);
	        /*DEBUG*/
		}

		/*
		makes sure, that no data is in the node
		new FlushRequest(): no parameters, so all indices are flushed
		force(true): forces to flush, even if it is not necessary
		actionGet(): execute and return a org.elasticsearch.action.admin.indices.flush.FlushResponse which isn't used
		*/
		client.admin().indices().flush( new FlushRequest().force(true) ).actionGet();
	}


	/**
	 * is called whenever an Article should be indexed
	 * similar article
	 * if true -> don't add to DB
	 */
	private boolean similairArticleIsAlreadyIndexed( Article article, String indexName ){

		float tooSimilair = 0.9f; //arbitrary value
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

//        	System.out.println(hit.getSource().get(obj_title) + " has a score of " + hit.getScore());

			if(hit.getScore() >= tooSimilair){
            	return true;
            }
        }
        return false;
	}

	/**
	 * Puts a list of articles into the search index and collects all topics and sources to merge
	 * them with existing metadata. Also checks for every article, if similar articles already exist
	 * (see {@link #put(Article, String)}).
	 * 
	 * @exception IOException see {@link #put(Article)}
	 */
	public void putMany( List<Article> list ) throws IOException {

		Collection<String> topics = new ArrayList<String>();
		Collection<String> sources = new ArrayList<String>();

		for( Article article : list ){
			this.put( article, searchIndex );
			if (article.getTopic() != null) {
				topics.add(article.getTopic());
			}
			if (article.getSource() != null) {
				sources.add(article.getSource());
			}
		}

		System.out.println(Arrays.toString(topics.toArray()));
		System.out.println(Arrays.toString(sources.toArray()));
		this.mergeMetaData(topics, MetaDataType.TOPIC);
		this.mergeMetaData(sources, MetaDataType.SOURCE);
	}

	/**
	 * Merge new metaData from new articles with old metaData from old article and save result (metaData = topic/source)
	 */
	private void mergeMetaData(Collection<String> newMetaData, MetaDataType filterType){
    	Set<String> current = this.deserializeSet(filterType);
        current.addAll(newMetaData);
        this.serializeSet(current, filterType);
    }


	private void writeMetaDataToIndex(String encoded, MetaDataType filterType) throws IOException{

		System.out.println("Writing encoded metadata " + filterType.name() + ": " + encoded);

		String id = filterType.name();

		// get() executes and gets the response
		IndexResponse indexResponse = client.prepareIndex(metaIndex, metaIndexType, id)
				.setSource(jsonBuilder().startObject().field(meta_data, encoded).endObject()).get();

		/* DEBUG */String _index = indexResponse.getIndex(), _type = indexResponse.getType(),
				_id = indexResponse.getId();
		// Version (if it's the first time you index this document, you will
		// get: 1)
		long _version = indexResponse.getVersion();
		// isCreated() is true if the document is a new one, false if it has
		// been updated
		boolean created = indexResponse.isCreated();
		System.out.println("Index: " + _index + " Type: " + _type + " ID: " + _id + " Version: " + _version
				+ " Indexed(t) or Updated(f): " + created);
	}

	/**
	 * Counterpart to {@link shared.ElasticSearchController#deserialzeSet(MetaDataType)}
	 * Serializes a set of anything to binary with ObjectOutputStream and the binary to Base64 string.
	 */
	private void serializeSet(Set<?> anySet, MetaDataType filterType) {
    	ByteArrayOutputStream baos;
        try (ObjectOutputStream oos = new ObjectOutputStream(baos = new ByteArrayOutputStream())) {
            oos.writeObject(anySet);
            final String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
            this.writeMetaDataToIndex(base64, filterType);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}