package shared;


import java.io.ByteArrayInputStream;
import java.io.Closeable;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.UncheckedIOException;
import java.util.Base64;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;

import shared.metadata.MetaDataType;

/**
 * Creates a connection to the ElasticSearch Server using the ElasticSearch Java API.
 * This connection can be used by inheriting this class. Also provides some attributes & methods
 * that are needed by all inheriting classes.
 *
 * @author akolb
 */
public abstract class ElasticSearchController implements Closeable {

    /*
     * Are shared
     * vars are hardcoded, because we don't need custom controllers
     * also guarantees that reader and writer access the same index
     */
    protected static final String searchIndex = "search-index", indexType = "article";
    //Stuff for Metaindexes
    protected static final String metaIndex = "meta-index", metaIndexType = "meta-data", meta_data = "data";
    //article attributes; obj_id is not required;
    protected static final String obj_title = "title", obj_pubDate = "pubDate", obj_content = "content", obj_author = "author", obj_topic = "topic", obj_source = "source", obj_url = "url";

    /*
     * Must not be shared
     */
    //pathESvalueValue doesn't need to be shared if relative path. can be shared if absolute path
    //pathESkey is a Key for Settings.Builder and must not be changed; the value for this key is pathESvalue
    protected final String pathESvalue = "../../ESServer", pathESkey = "path.home";
    protected final Node node;
    protected final Client client;

	public ElasticSearchController(){

		Settings.Builder settings = Settings.builder();
    	settings.put(pathESkey, pathESvalue);
    	NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder();
    	nodeBuilder.settings(settings).client(true);

    	this.node = nodeBuilder.node();
    	this.client = node.client();

	}
	
	@Override
	public void close() throws IOException {
		if(node != null) {
			node.close();
		}
	}

	/**
	 * Returns encoded metadata string. The String is Base64 encoded binary, the binary is a
	 * a serialized Set containing metadata of the given filterType.
	 */
	protected String getMetaDataFromIndex(MetaDataType filterType){
	
		String id_str = filterType.name();
		//executes and gets the response
		GetResponse getResponse = client.prepareGet(metaIndex, metaIndexType, id_str).get();
		Map<String, Object> map = getResponse.getSource();
		if (!getResponse.isSourceEmpty()) {
			String metaData = (String) map.get(meta_data);
			return metaData;
		} else {
			return null;
		}
	}

	/**
	 * Counterpart to {@link esfeeder.elasticsearch.ElasticSearchWriter#serializeSet(Set<?, MetaDataType)}
	 * Uses ObjectInputStream to deserialize a Set of Metadata strings. The set must have been encoded
	 * to binary and then encoded as Base64.
	 */
	protected <T> Set<T> deserializeSet(MetaDataType filterType){

		String encoded = this.getMetaDataFromIndex(filterType);
		if (encoded == null) {
			return new HashSet<T>();
		} else {
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
}