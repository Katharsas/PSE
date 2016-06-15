package shared;


import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.UncheckedIOException;
import java.util.Base64;
import java.util.Set;

import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;

import shared.metadata.MetaDataType;

/**
 *
 * @author akolb
 */

public abstract class ElasticSearchController {

    /*
     * Are shared
     * vars are hardcoded, because we don't need custom controllers
     * also guarantees that reader and writer access the same index
     */
    protected static final String searchIndex = "searchIndex", indexType = "article";
    //article attributes; obj_id is not required;
    protected static final String obj_title = "title", obj_pubDate = "pubDate", obj_content = "content", obj_author = "author", obj_topic = "topic", obj_source = "source", obj_url = "url";

    /*
     * Must not be shared
     */
    //pathESvalueValue doesn't need to be shared if relative path. can be shared if absolute path
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

	protected String getMetaDataFromIndex(MetaDataType filterType){
		// TODO Get full string from document from metaData index

		//turn filterType into an String? Use MetaDataType as a key?
		//which format should the String be in?
		//better return

		return null;
	}
	
	protected <T> Set<T> deserializeSet(MetaDataType filterType){
	
    	byte[] base64 = Base64.getDecoder().decode(this.getMetaDataFromIndex(filterType));
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(base64))) {
            @SuppressWarnings("unchecked")
            Set<T> anySet = (Set<T>) ois.readObject();
            return anySet;
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Could not convert serialized object to Set!", e);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
        
    }
}