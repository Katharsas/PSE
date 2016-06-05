package esfeeder;

/**
 *
 * @author dbeckstein
 * @author akraft
 * @author jfranz
 */
import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.parsers.ParserConfigurationException;
import org.joda.time.IllegalFieldValueException;

import org.xml.sax.SAXException;

public class XmlParser {

    private static String parse_xml(Element node, String fld_name) {

        return node
                .getElementsByTagName(fld_name)
                .item(0)
                .getTextContent();
    }

    // refac enclose everything in try catch, use function pointers ?
    // not use func pointers use switch case
    private String clean(String s) {
        if (s != null) {
            s = s.trim();
        }
        return s;
    }

    public Article parse(Path path, Document doc) {
        String s = "";
        ArticleParser ap = new ArticleParser();

        // Article - set id
        String id = path.normalize().toString();
        Article article = new Article(id);

        // bug todo - check id, is path normal? this long string thingy?
        try {

            // Get proper nodes from xml
            doc.getDocumentElement().normalize();

            Element doc_el;
            doc_el = doc.getDocumentElement();

            NodeList nList_c = doc.getElementsByTagName("item");
            Node item_node = nList_c.item(0);
            Element item_elem = (Element) item_node;

            // Article - set several attributes
            // set title
            String a_title = "";
            a_title = parse_xml(item_elem, "title");
            a_title = clean(a_title);
            article.setTitle(a_title);

            // set pubDate
            //String a_pubDate = "<This is default for date>";
            String a_pubDate = "";
            try {
                a_pubDate = parse_xml(item_elem, "pubDate"); // bug try catch here !
            } catch (NullPointerException ex) {
                // slightly suboptimal by catching NPE
                //System.out.println("NPE encountered in body");
            } catch (IllegalFieldValueException ex) {
                // detect function behaviour refac
                System.out.println("illegal filed value");
            }
            // refac catch more / all exceptions here !!

            a_pubDate = ap.parse_pubDate(a_pubDate);
            a_pubDate = clean(a_pubDate);
            article.setPubDate(a_pubDate);

            // set extractedText
            String a_extractedText = "";
            a_extractedText = parse_xml(item_elem, "ExtractedText");
            a_extractedText = clean(a_extractedText);
            article.setExtractedText(a_extractedText);

            // set author
            //String a_author = "<This is the default string for author>";
            String a_author = "";
            try {
                a_author = parse_xml(item_elem, "author"); // todo check xml files for author

            } catch (NullPointerException ex) {
                // slightly suboptimal by catching NPE
                //System.out.println("no author field set"); // refac
            }
            a_author = clean(a_author);
            article.setAuthor(a_author);

            // set topic
            String a_topic = path.normalize().toString();
            a_topic = ap.parse_topic(a_topic);
            a_topic = clean(a_topic);
            article.setTopic(a_topic);

            // set source
            String a_source = parse_xml(item_elem, "link");
            a_source = ap.parse_source(a_source);
            a_source = clean(a_source);
            article.setSource(a_source);

            // set url
            String a_url = parse_xml(item_elem, "link");
            //a_url = ap.parse_url(a_url);
            a_url = clean(a_url);
            article.setUrl(a_url);

            // @now
            // TODO - these are missing
            // id,source, topic, author 
            // HOW TO FIND id, source, topic and author :
            // ----------------------------------------------
            // id - find by parsing file path
            // source - find by parsing link
            // topic - find by parsing
            // author - find by parsing xml file, sometimes they have this in the xml file (didn't see this so far)
            s += "";

            // collect sets
        } catch (Exception e) {
            e.printStackTrace();
        }

        return article;
    }

    /**
     * Generates List<Article> object from a Hashmap <Path, Document>
     *
     * @param fileList - Hashmap of files
     */
    public List<Article> parseFileList(Map<Path, Document> fileList) {
        List<Article> articles = new ArrayList<Article>();
        Set<String> topics_set = new HashSet<String>();
        Path path;
        Document doc;
        // . = null;
        // needed to avoid - object might not have been initialized error
        doc = null;
        path = null;

        for (Map.Entry<Path, Document> entry : fileList.entrySet()) {
            path = entry.getKey();
            doc = entry.getValue();
            Article article = this.parse(path, doc);
            articles.add(article);
            if (GlobalsDebug.set_cnt < GlobalsDebug.set_cnt_max) {
                topics_set.add(article.getTopic());
                GlobalsDebug.set_cnt++;
                System.out.println(article);
            }
        }
        System.out.println(topics_set);
        return articles;
    }

    /**
     * Debug functions
     *
     * @author dbeckstein
     */
    public String debug() {

        FileService tmp_FileService = new FileService();

        Map<Path, Document> fileList; //bug
        fileList = tmp_FileService.getArticles_debug("_few_de/"); //bug

        Map<Path, Document> fileList_germany = tmp_FileService.getArticles_debug("germany/");
        Map<Path, Document> fileList_us = tmp_FileService.getArticles_debug("US"); //bug

        System.out.println(fileList.size());
        List<Article> articles;
        //articles = this.parseFileList(fileList);
        articles = this.parseFileList(fileList_us);
        articles = this.parseFileList(fileList_germany);

        return "... finished debug";
    }

}
