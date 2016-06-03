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
import java.util.List;
import java.util.StringTokenizer;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

public class XmlParser {

    private static String parse_xml(Element node, String fld_name) {

        return node
                .getElementsByTagName(fld_name)
                .item(0)
                .getTextContent();
    }

    public static Article parse(Path path, Document doc) {
        String s = "";

        //Article - set id
        String id = path.normalize().toString();
        Article article = new Article(id);

        try {

            doc.getDocumentElement().normalize();

            Element doc_el;
            doc_el = doc.getDocumentElement();

            NodeList nList = doc.getElementsByTagName("image");
            Node image_node = nList.item(0);
            Element image_elem = (Element) image_node;

            NodeList nList_c = doc.getElementsByTagName("item");
            Node item_node = nList_c.item(0);
            Element item_elem = (Element) item_node;

            // Article - set title
            String a_title = parse_xml(item_elem, "title");

            article.setTitle(a_title);

            article.setPubDate(
                    parse_xml(item_elem, "pubDate")
            );
            article.setExtractedText(
                    parse_xml(item_elem, "ExtractedText")
            );
            article.setAuthor(
                    ""//parse_xml(item_elem, "author")
            );

            s += "\n";
            s += parse_xml(item_elem, "link"); // = url
            s += "\n";

            s += parse_xml(item_elem, "pubDate");
            s += "\n";

            String link_str = parse_xml(item_elem, "link");
            String path_str = path.normalize().toString();

            String line = "This order was placed for QT3000! OK?";
            String pattern;
            String pattern_str;

            // US\en\
            // Germany\de\
            String us = "(US\\en\\)";
            //String de = "(germany\\de\\)";
            // refac todo debug
            String de = "_few_de\\de\\";

            String p_us = Pattern.quote(us);
            String p_de = Pattern.quote(de);
            String p_end = Pattern.quote("\\");
            pattern_str = ".*[" + p_us + "," + p_de + "](.*)" + p_end + ".*";
            pattern_str = ".*" + p_de + "(.*?)" + p_end + ".*";
            System.out.println(pattern_str);

            Pattern regex_topic = Pattern.compile(pattern_str);

            // Now create matcher object.
            line = path_str;
            Matcher m_topic = regex_topic.matcher(line);
            System.out.println("in line:   " + line);
            if (m_topic.find()) {
                //System.out.println("Found value: " + m_topic.group(0));
                System.out.println("Found value: " + m_topic.group(1));
                //System.out.println("Found value: " + m.group(2));
            } else {
                System.out.println("NO MATCH");
            }

            /*
            * parse url
            * https:// , http:// - split on "//" sign
            * blog.google.com/hello/devblog/info.html
             */
            pattern = ".*//(.*?)/.*";
            //System.out.println(pattern);
            System.out.println("---");
            //   \\.*

            // Create a Pattern object
            Pattern r = Pattern.compile(pattern);

            // Now create matcher object.
            line = link_str;
            Matcher m = r.matcher(line);
            System.out.println("in line:   " + line);
            if (m.find()) {
                //System.out.println("Found value: " + m.group(0));
                System.out.println("Found value: " + m.group(1));
                //System.out.println("Found value: " + m.group(2));
            } else {
                System.out.println("NO MATCH");
            }

            // @now
            // TODO - these are missing
            // id, source, topic, author 
            // HOW TO FIND id, source, topic and author :
            // ----------------------------------------------
            // id - find by parsing file path
            // source - find by parsing link
            // topic - find by parsing
            // author - find by parsing xml file, sometimes they have this in the xml file (didn't see this so far)
            s += "";

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
        Path path;
        Document doc;
        // . = null;
        // needed to avoid - object might not hae been initialized error
        doc = null;
        path = null;

        for (Map.Entry<Path, Document> entry : fileList.entrySet()) {
            path = entry.getKey();
            doc = entry.getValue();
            Article article = this.parse(path, doc);
            System.out.println(article);
            articles.add(article);
        }
        return articles;
    }

    /**
     * Debug functions
     *
     * @author dbeckstein
     */
    public String debug() {

        FileService tmp_FileService = new FileService();

        Map<Path, Document> fileList = tmp_FileService.getArticles_debug("_few_de/"); //bug

        System.out.println(fileList.size());

        List<Article> articles = this.parseFileList(fileList);
        return "... finished debug";
    }

}
