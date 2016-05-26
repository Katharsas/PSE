import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.client.Client;

/**
 *
 * @author akolb
 */

/*
 * Are shared
 * vars are hardcoded, because we don't need custom controllers
 * also gurantees that reader and writer acces the same index
 */
protected static final String searchIndex = "searchIndex", indexType = "article";
//articel attributes; obj_id is not required
protected static final String obj_title = "title", obj_pubDate = "pubDate", obj_content = "content", obj_author = "author";

/*
 * Must not be shared
 */
//pathES doesn't need to be shared if relativ path. can be shared if absolut path
protected String pathES = "./elasticsearch", pathHome = "path.home";
protected Node node;
protected Client client;

public abstract class ElasticSearchController{

	public ElasticSearchController(){

		Settings.Builder settings = Settings.builder();
    	settings.put(pathHome, pathES);
    	NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder();
    	nodeBuilder.settings(settings);
    	nodeBuilder.client(true);

    	Node node = nodeBuilder.node();
        Client client = node.client();

	}


	/**
	 * Workaround for Java not having destructors -.-
	 * closes the connection to ES before the Object get's destroyed by GC
	*/
	protected void finalize(){

		node.close();

	}
}