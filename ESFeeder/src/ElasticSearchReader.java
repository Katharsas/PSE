import java.io.IOException;

import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.client.Client;

import org.elasticsearch.index.IndexNotFoundException;

/**
 *
 * @author akolb
 */

public class ElasticSearchReader extends ElasticSearchController {

	/**
	 * Can only be created after the writer was started once!
	 * Throws an exception otherwise
	 */
	public ElasticSearchReader() throws IndexNotFoundException{
		
		super();
		
		//checks if the index is in the db
		boolean searchIndex_exists =  client.admin().indices().prepareExists(searchIndex).execute().actionGet().isExists();
		if( !searchIndex_exists ){
			throw new IndexNotFoundException();
		}else{
			//Everything is good
		}
	}

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


}