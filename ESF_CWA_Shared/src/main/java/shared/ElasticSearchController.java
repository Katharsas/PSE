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
import org.elasticsearch.action.get.GetResponse;

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
    //Stuff for Metaindexes
    protected static final String metaIndex = "metaIndex", metaIndexType = "metaData", meta_data = "data";
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
	public void free(){

		node.close();

	}
	  /**
     * @return an Article from the ES db needs the ID of the object
     */
    private Article getById(ArticleId id) {

        // renamed id, to id_str because, ArticleId id already uses variable "id"
		String id_str = id.getId();
		// TODO isExists check id existing
		//executes and gets the response
		GetResponse getResponse = client.prepareGet(searchIndex, indexType, id_str).get();
		String title = (String) getResponse.getSource().get(obj_title);
		String pubDate = (String) getResponse.getSource().get(obj_pubDate);
		String content = (String) getResponse.getSource().get(obj_content);
		String author = (String) getResponse.getSource().get(obj_author);
		String source = (String) getResponse.getSource().get(obj_source);
		String topic = (String) getResponse.getSource().get(obj_topic);
		String url = (String) getResponse.getSource().get(obj_url);

		return new Article(id.getId())
                      .setTitle(title)
                      .setPubDate(pubDate)
                      .setExtractedText(content)
                      .setAuthor(source)
                      .setTopic(topic)
                      .setUrl(url);

	}

	protected String getMetaDataFromIndex(MetaDataType filterType){
	
		String id_str = filterType.name();
		//executes and gets the response
		GetResponse getResponse = client.prepareGet(metaIndex, metaIndexType, id_str).get();
		String metaData = (String) getResponse.getSource().get(meta_data);
		return metaData;
		
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