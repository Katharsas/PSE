/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package demoelasticsearch;


import static demoelasticsearch.MyUtil.listf;
import java.io.File;
import java.io.IOException;
import java.util.List;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexResponse;
import org.elasticsearch.action.admin.indices.flush.FlushRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.IndicesAdminClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.unit.TimeValue;
import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;
import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.search.SearchHit;
import   XmlParser.XmlParser;
/**
 *
 * @author Daniel
 */
public class GetStarted {
private static final String pathES = "C:/Users/Daniel/Dropbox/Studium/PSE/Job/mycode/elasticsearch-2.2.0";
private static final String pathArchive = "C:/Users/Daniel/Dropbox/Studium/PSE/Docs_Code_Gobel/RSSArchive/RSS/rssfiles/US";

    public static void main(String[] args) throws IOException  {
    XmlParser xp = new XmlParser();
    // on startup
    List<File> file_list = MyUtil.listf(pathArchive);
    
    Settings.Builder settings = Settings.builder();
    settings.put("path.home", pathES);
    // settings.put("http.enabled", false);
    NodeBuilder nodeBuilder = NodeBuilder.nodeBuilder();
    nodeBuilder.settings(settings);
    nodeBuilder.client(true);

        Node node = nodeBuilder.node();
        Client client = node.client();

        // on shutdown
        
        /*
        try {
            DeleteIndexResponse delete = client.admin().indices()
                    .delete(new DeleteIndexRequest("idx_old")).actionGet();
            if (!delete.isAcknowledged()) {
                System.out.println("Index wasn't deleted");
            }else{
                System.out.println("Index was deleted");
            }
        }
        catch (IndexNotFoundException e) {
            System.out.println("Index does not exist");
        }
        */
        
        String index_name = "idx_4";
        String index_type = "tweet";
        
        String obj_title = "title", obj_pubDate = "pubDate", obj_ExtractedText = "ExtractedText";
        
        boolean index_idx_exists =  client.admin().indices().prepareExists(index_name).execute().actionGet().isExists();
        System.out.println("The index - "+index_name+" exists "+index_idx_exists);
        if ( !index_idx_exists ){
            CreateIndexRequestBuilder irb = client.admin().indices().prepareCreate(index_name);
//            irb.setSettings(Settings.builder().loadFromSource(jsonBuilder()
//                    .startObject()
//                        .startObject("analysis")
//                            .startObject("analyzer")
//                                .startObject("my_analyzer")
//                                    .field("type", "custom")
//                                    .field("tokenizer", "standard")
//                                    .field("filter", new String[]{"english_snowball", "lowercase"})
//                                .endObject()
//                            .endObject()
//
//                            .startObject("filter")
//                                .startObject("english_snowball")
//                                    .field("type", "snowball")
//                                    .field("language", "english")
//                                .endObject()
//                            .endObject()
//
//                        .endObject()
//                    .endObject().string()));
            irb.addMapping(index_type, jsonBuilder()
                    .startObject()
                        .startObject("properties")
                            .startObject(obj_title)
                                .field("type","string")
                                .field("index", "analyzed")
                            .endObject()
                            .startObject(obj_pubDate)
                                .field("type","date")
                                .field("index", "not_analyzed")
                            .endObject()
                            .startObject(obj_ExtractedText)
                                .field("type","string")
                                .field("index", "not_analyzed")
                            .endObject()

                        .endObject()
                    .endObject());
            irb.execute().actionGet();
            System.out.println("The index - was created ");
        }
        //                   index,    type,     id
        //response = client.prepareIndex("twitter", "tweet", "2").setSource(builder).get();
        IndexResponse response = null;
        int idx_i = 100;
        
//        for (File file : file_list) {
//            System.out.println(file.getAbsolutePath());
//            String s = xp.parse(file);
//            int n = 40;
//            String up = s.substring(0, Math.min(s.length(), n));
//            System.out.println(up);
//            
//             response = client.prepareIndex(index_name, index_type, String.valueOf(idx_i) )
//                .setSource(jsonBuilder()        
//                    .startObject()
//                        .field(obj_title, s )//"This is a fucking title"
//                        .field(obj_pubDate, "2000-12-11") //yyyy-MM-dd
//                        .field(obj_ExtractedText, "Here is some awesome text!")
//                    .endObject())
//                .get();
//             
//             idx_i++;
//        }
        
        
       /*
        
        IndicesAdminClient indices = client.admin().indices();
        indices.flush(new FlushRequest(index_name).force(true)).actionGet();
        // bug what does flush do
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
        

        GetResponse response2 = client.prepareGet(index_name, index_type, "100").get();
        System.out.println(response2.getSource().get(obj_title));
        System.out.println(response2.getSource().get(obj_pubDate));
        System.out.println(response2.getSource().get(obj_ExtractedText));
        
        */
        
        //QueryBuilder qb = matchQuery(obj_title, "is");
        
        QueryBuilder qb;  
            qb = moreLikeThisQuery(obj_title)  
            .likeText("Tiger")
            .minTermFreq(1)
            .maxQueryTerms(8); 

        
        SearchResponse scrollResp = client.prepareSearch(index_name)
                .setTypes(index_type)
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                .setScroll(new TimeValue(60000))
                .setQuery(qb)
                //.setPostFilter(QueryBuilders.rangeQuery("age").from(12).to(18))
                .setFrom(0)
                .setSize(1000)
                .execute()
                .actionGet();
          int hit_cnt = 0;
          while (true) {
              for (SearchHit hit : scrollResp.getHits().getHits()) {
                  hit_cnt++;
                  System.out.println("hit"+hit.getSource().get(obj_title));
                  System.out.println(hit.getSource().get(obj_pubDate));
                  System.out.println(hit.getSource().get(obj_ExtractedText));
                  System.out.println("==============================================\n\n");
                if (hit_cnt>2) {
                    break;
                }   
              }
               if (hit_cnt>2) {
                    break;
                }   
              scrollResp = client.prepareSearchScroll(scrollResp.getScrollId()).setScroll(new TimeValue(60000)).execute().actionGet();
              //Break condition: No hits are returned
              if (scrollResp.getHits().getHits().length == 0) {
                  break;
              }
              
          }
        
        
        
        
        
        
        node.close();
    
    }
}
