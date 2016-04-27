import static org.elasticsearch.node.NodeBuilder.*;
import static org.elasticsearch.common.xcontent.XContentFactory.*;
import static org.elasticsearch.index.query.QueryBuilders.*;

import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexResponse;
import org.elasticsearch.action.admin.indices.flush.FlushRequest;
import org.elasticsearch.action.admin.indices.get.GetIndexRequest;
import org.elasticsearch.action.admin.indices.settings.get.GetSettingsResponse;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.IndicesAdminClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.search.SearchHit;

import com.carrotsearch.hppc.cursors.ObjectObjectCursor;

public class FirstTest {
  private static String pathES = "C:/Program Files/elasticsearch-2.2.0";

  public static void main(String[] args) throws IOException, InterruptedException, ExecutionException {

    // on startup

    
    Settings.Builder settings = Settings.builder();
    settings.put("path.home", pathES);
    // settings.put("http.enabled", false);

    NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder();
    nodeBuilder.settings(settings);
    nodeBuilder.client(true);

    Node node = nodeBuilder.node();

    Client client = node.client();

    try {
      DeleteIndexResponse delete = client.admin().indices()
          .delete(new DeleteIndexRequest("twitter")).actionGet();
      if (!delete.isAcknowledged()) {
        System.out.println("Index wasn't deleted");
      }else{
        System.out.println("Index was deleted");          
      }
    }
    catch (IndexNotFoundException e) {
      System.out.println("Index does not exist");
    }

    CreateIndexRequestBuilder irb = client.admin().indices().prepareCreate("twitter");

    irb.setSettings(Settings.builder().loadFromSource(jsonBuilder()
        .startObject()
          .startObject("analysis")
            .startObject("analyzer")
              .startObject("my_analyzer")
                 .field("type", "custom")
                 .field("tokenizer", "standard")
                 .field("filter", new String[]{"english_snowball", "lowercase"})
              .endObject()
            .endObject()
            .startObject("filter")
              .startObject("english_snowball")
                .field("type", "snowball")
                .field("language", "english")
              .endObject()
            .endObject()
          .endObject()
        .endObject().string()));
    
    irb.addMapping("tweet", jsonBuilder()
        .startObject()
          .startObject("properties")
            .startObject("user")
              .field("type","string")
              .field("index", "not_analyzed")
            .endObject()
            .startObject("postDate")
              .field("type","date")
              .field("index", "not_analyzed")
            .endObject()
            .startObject("age")
              .field("type","integer")
              .field("index", "not_analyzed")
            .endObject()
            .startObject("message")
              .field("type","string")         
              .field("analyzer", "my_analyzer")
            .endObject()
          .endObject()
        .endObject());
    
    irb.execute().actionGet();

    /*
    GetSettingsResponse indresp = client.admin().indices()
        .prepareGetSettings("twitter").get();                           
    for (ObjectObjectCursor<String, Settings> cursor : indresp.getIndexToSettings()) { 
      String index = cursor.key;                                                      
      Settings indexSettings = cursor.value; 
      System.out.println("key: " + index);
      Map<String,String> map = indexSettings.getAsMap();
      for (String mkey : map.keySet()) {
        System.out.println(mkey + ": " + map.get(mkey));
      }
    }
    */

    XContentBuilder b = jsonBuilder();
    b.startObject()
      .field("P1", "V1")
      .field("P2", "V2")
      .startObject("P3")
        .field("P31", "V31")
        .field("P32", "V32")
      .endObject()
      .field("P4", "V4")
      .endObject();
    
    System.out.println(b.string());
    
    XContentBuilder builder = jsonBuilder();
    builder.startObject();
    builder.field("user", "max");
    builder.field("postDate", new Date());
    builder.field("age", 16);
    builder.field("message", "Richard trying out Elasticsearch");
    builder.endObject();

    IndexResponse response = client.prepareIndex("twitter", "tweet", "1")
        .setSource(builder).get();

    builder = jsonBuilder();
    builder.startObject();
    builder.field("user", "moritz");
    builder.field("postDate", new Date());
    builder.field("age", 14);
    builder.field("message", "Another example for  Elastticsearch");
    builder.endObject();

    response = client.prepareIndex("twitter", "tweet", "2").setSource(builder).get();
    IndicesAdminClient indices = client.admin().indices();  
    indices.flush(new FlushRequest("twitter").force(true)).actionGet();

    // Index name
    String _index = response.getIndex();
    // Type name
    String _type = response.getType();
    // Document ID (generated or not)
    String _id = response.getId();
    // Version (if it's the first time you index this document, you will get: 1)
    long _version = response.getVersion();
    // isCreated() is true if the document is a new one, false if it has been updated
    boolean created = response.isCreated();

    System.out.println("Index: " + _index + " Type: " + _type + " ID: " + _id + " Version: " + _version + " Created: " +created);

    GetResponse response2 = client.prepareGet("twitter", "tweet", "1").get();

    System.out.println(response2.getSource().get("message"));

    // DeleteResponse response3 = client.prepareDelete("twitter", "tweet", "1").get();

    /*
    UpdateRequest updateRequest = new UpdateRequest();
    updateRequest.index("index");
    updateRequest.type("type");
    updateRequest.id("1");
    updateRequest.doc(jsonBuilder()
            .startObject()
                .field("gender", "male")
            .endObject());
    client.update(updateRequest).get();
     */
    /*
    SearchResponse response4 = client.prepareSearch("twitter")
        .setTypes("tweet")
        // .setSearchType(SearchType.SCAN)
        .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
        .setQuery(QueryBuilders.termQuery("Richard", "Elasticsearch"))      // Query
        .setPostFilter(QueryBuilders.rangeQuery("age").from(12).to(18))     // Filter
        .setFrom(0).setSize(60).setExplain(true)
        .execute()
        .actionGet();
     */

    QueryBuilder qb = matchQuery("message", "RICHARD");
    SearchResponse scrollResp = client.prepareSearch("twitter")
        .setTypes("tweet")
        .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
        .setScroll(new TimeValue(60000))
        .setQuery(qb)
        .setPostFilter(QueryBuilders.rangeQuery("age").from(12).to(18))
        .setFrom(0)
        .setSize(100)
        .execute()
        .actionGet();  
    
    while (true) {
      for (SearchHit hit : scrollResp.getHits().getHits()) {
        System.out.println(hit.getSource().get("message"));
      }
      scrollResp = client.prepareSearchScroll(scrollResp.getScrollId()).setScroll(new TimeValue(60000)).execute().actionGet();
      //Break condition: No hits are returned
      if (scrollResp.getHits().getHits().length == 0) {
        break;
      }
    }

    /*
    client.prepareDelete("twitter", "tweet", "1").execute();
    client.prepareDelete("twitter", "tweet", "2").execute();
     */


    // on shutdown
    node.close();
  }
}
