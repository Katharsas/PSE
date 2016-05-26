import java.io.IOException;

import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.client.Client;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 *
 * @author akolb
 */

public class ElasticSearchWriter extends ElasticSearchController{
	
	//var is hardcoded, because it's not necessary to create writers with custom indexes
	private final String mainIndex = "mainIndex";
	
	private int createIndex( String indexName ){
	
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
                irb.execute().actionGet();
                
System.out.println("The index "+ indexName +" was created");
		
	
	}

	/**
	 * Also creates indexes
	 */ 
	public ElasticSearchWriter(){
		
		super();
		
		boolean mainIndex_exists =  client.admin().indices().prepareExists(mainIndexName).execute().actionGet().isExists();
		boolean searchIndex_exists =  client.admin().indices().prepareExists(searchIndexName).execute().actionGet().isExists();
		
		if(!searchIndex_exists){
			createIndex( searchIndex );
		}
		if( !mainIndex_exists ){
			createIndex( mainIndex );
		}
	}

	/**
	 * creates an index in the db. Probably needs to be executed ones
	 * needs the fields to be created int the db (name, type and if it's get analyzed)
	 */
	public initialize(){}

	/*
	 * indexes an object in the ES db
	 * needs the name and type of the created index and an ID for the object
	 */
	public put(){}

	/*
	 * deletes an object from the index, but lets it stay in the db.
	 * needs the name and type of the created index and an ID for the object
     */
	public delete(){}

	/*
	 * returns an object from the ES db
	 * needs the name and type of the created index and an ID for the object
	 */
	public getById(){}

	/*
	 * returns a list of objects from the db
	 * needs the name and type of the created index
	 * needs a string from one of the analyzed properties (fields) as searchquery
	 * needs an integer or date object from one of the properties (fields) as range
	 */
	public getByQuery(){}

	/*
	 * returns a list with all objects
	 *
	*/
	public getAll(){}

	/**
	 *
	 *
	*/
	public getSimilair(){}
	




}