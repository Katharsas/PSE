/**
 *
 * @author akolb
 */

/*
 * Are shared
 */
protected static final String searchIndexName = "searchIndex";
protected static final String indexType = "article";

/*
 * Must not be shared
 */
//Not shared if relativ path. shared if absolut path
protected String pathES = "./elasticsearch";
protected Node node;
protected Client client;

public abstract class ElasticSearchController{

	public ElasticSearchController(){
	
		//siehe Kommentar bei Writer
		/*
		this.setSearchIndexName(searchIndexName);
		this.setPathES(pathES);
		*/
		
		Settings.Builder settings = Settings.builder();
    	settings.put("path.home", pathES);
    	NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder();
    	nodeBuilder.settings(settings);
    	nodeBuilder.client(true);
    	
    	Node node = nodeBuilder.node();
        Client client = node.client();
	
	}

	/*
	 * Nothing
	*/

	}
	
	/**
	 * Workaround for Java not having destructors -.-
	 * closes the connection to ES before the Object get's destroyed by GC
	*/
	protected void finalize(){
	
		node.close();
	
	}

public String getPathES(){}
public static String getSearchIndex(){}

public setPathES(String pathES){}
public static setSearchIndex(String searchIndex){}