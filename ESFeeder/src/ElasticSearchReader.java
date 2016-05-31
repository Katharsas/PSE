import java.io.IOException;

import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.client.Client;

import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;

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
		boolean searchIndex_exists =  client.admin().indices().prepareExists(searchIndex).get().isExists();
		if( !searchIndex_exists ){
			throw new IndexNotFoundException(searchIndex);
		}else{
			//Everything is good
		}
	}

	/*
	 * returns an object from the ES db
	 * needs the ID of the object
	 * is this method even needed?
	 */
	public void getById( Object o ){

		String id = "";

		//executes and gets the response
		GetResponse getResponse = client.prepareGet(searchIndex, indexType, id).get();
		String title = (String) getResponse.getSource().get(obj_title);
		String pubDate = (String) getResponse.getSource().get(obj_pubDate);
		String content = (String) getResponse.getSource().get(obj_content);
		String author = (String) getResponse.getSource().get(obj_author);


	}

	/*
	 * returns a list of objects from the db
	 * needs the name and type of the created index
	 * needs a string from one of the analyzed properties (fields) as searchquery
	 * needs an integer or date object from one of the properties (fields) as range
	 */
	public void getByQuery(){}

	/*
	 * returns a list with all objects
	 * needed?
	 */
	public void getAll(){}


}