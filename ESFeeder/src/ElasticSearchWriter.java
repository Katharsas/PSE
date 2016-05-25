import java.io.IOException;

/**
 *
 * @author akolb
 */

public class ElasticSearchWriter extends ElasticSearchController{

	public ElasticSearchWriter(){}

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