import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.node.Node;
import org.elasticsearch.client.Client;

/**
 *
 * @author akolb
 */

public abstract class ElasticSearchController{

    /*
     * Are shared
     * vars are hardcoded, because we don't need custom controllers
     * also gurantees that reader and writer acces the same index
     */
    protected static final String searchIndex = "searchIndex", indexType = "article";
    //article attributes; obj_id is not required; link/source/topic?
    protected static final String obj_title = "title", obj_pubDate = "pubDate", obj_content = "content", obj_author = "author";

    /*
     * Must not be shared
     */
    //pathESvalueValue doesn't need to be shared if relativ path. can be shared if absolut path
    //pathESkey is a Key for Settings.Builder and must not be changed; the value for this key is pathESvalue
    protected String pathESvalue = "../../ESServer", pathESkey = "path.home";
    protected Node node;
    protected Client client;

	public ElasticSearchController(){

		Settings.Builder settings = Settings.builder();
    	settings.put(pathESkey, pathESvalue);
    	NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder();
    	nodeBuilder.settings(settings).client(true);

    	Node node = nodeBuilder.node();
        Client client = node.client();

	}
	
	/**
	 * Workaround for Java not having destructors -.-
	 * closes the connection to ES before the Object get's destroyed by GC
	*/
	protected void free(){

		node.close();

	}
}