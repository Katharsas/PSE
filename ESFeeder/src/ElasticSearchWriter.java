import java.io.IOException;
import java.lang.Exception;

import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.client.Client;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 *
 * @author akolb
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
                        .endObject());
                        
        //executes and get's the response, which currently isn't used
        CreateIndexResponse createResponse = indexBuilder.get();
        
        //Check if index is created
        if (!createResponse.isAcknowledged()) {
            throw new Exception("Failed to create index <" + indexName + ">");
        }else{
/*DEBUG*/System.out.println("The index "+ indexName +" was created");
        }

		return 0;


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

	public void initialize(){}

	/*
	 * indexes an object in the ES db
	 * needs the name and type of the created index and an ID for the object
	 */
	public void put(){}

	/*
	 * deletes an object from the index, but lets it stay in the db.
	 * needs the name and type of the created index and an ID for the object
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
	 *
	 *
	 */
	public void getSimilair(){}





}