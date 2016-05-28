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
	private int createIndex(String indexName) throws IOException, Exception{

		CreateIndexRequestBuilder indexBuilder = client.admin().indices().prepareCreate(indexName);
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

		return 0;


	}
	
	/*
	 * indexes an object in the ES db
	 * jsonBuilder throws an IOException if an issue occurs
	 */
	private void put( Object o, String index ) throws IOException{
	
		//TODO: Muss aus Object rausgelesen werden
		String id = "", title = "", pubDate = "", content = "", author = "";
		
		//get() executes and gets the response
		IndexResponse indexResponse = client.prepareIndex(index, this.indexType, id)
            .setSource(jsonBuilder()
                .startObject()
                    .field(obj_title, title)
                    .field(obj_pubDate, pubDate)
                    .field(obj_content, content)
                    .field(obj_author, author)
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
	 * identical or similair article?
	 * if true -> don't add to DB
	 */
	private boolean articleIsAlreadyIndexed( Object o ){
		
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
	public void put( Object o ) throws IOException{
	
		this.put( o, mainIndex );
		
		//Should be already indexed if it is worth to us
		if(!this.articleIsAlreadyIndexed( o )){
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
	 * deletes an object from the index, but lets it stay in the db.
	 * needs the name and type of the created index and an ID for the object
	 * obsolete?
     */
	public void delete(){}

	/*
	 * returns an object from the ES db
	 * needs the name and type of the created index and an ID for the object
	 */
	public void getById(){}

	/*
	 * returns a list of objects from the db
	 * needs the name and type of the created index
	 * needs a string from one of the analyzed properties (fields) as searchquery
	 * needs an integer or date object from one of the properties (fields) as range
	 */
	public void getByQuery(){}

	/*
	 * returns a list with all objects
	 *
	 */
	public void getAll(){}

	/**
	 * needed?
	 *
	 */
	public void getSimilair(){}





}