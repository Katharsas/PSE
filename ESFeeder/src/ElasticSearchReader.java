import java.io.IOException;

/**
 *
 * @author akolb
 */

public class ElasticSearchReader extends ElasticSearchController {

	public ElasticSearchReader(){}

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