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
import java.util.StringTokenizer;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.SAXException;

public class XmlParser {
    
    /**
     * Daniel's Debug function
     * 
     */   
     
    private static String parse_xml(Element node, String fld_name) {
        /*
       System.out.println(fld_name + " : " 
            + node
            .getElementsByTagName(fld_name)
            .item(0)
            .getTextContent() 
         );
         */
        return node
                .getElementsByTagName(fld_name)
                .item(0)
                .getTextContent();
    }

    public void parseFileList(Map<Path, Document> fileList) {
        
        // real function
        Path path;
        Document doc;
        doc = null;
        path = null;
        
        for (Map.Entry<Path, Document> entry : fileList.entrySet()) {
            path = entry.getKey();
            doc = entry.getValue();
            Article article = this.parse(path,doc);
            System.out.println(article);
        }
        //return path.normalize().toString();
        //return this.parse(path, doc);
    }

    public String debug() {

        try {
            /*
           *   debug stuff - todo delete on finish
             */
            // US\en\business\CNNcomBusiness\y2011\m11\d11
            //Path archive = Paths.get("./../RSSCrawler/archive_dev");
            Path archive = Paths.get("../Daniel_ESDemo_Crawler/data/");

            Map<Path, Document> fileList = new HashMap<>();

            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();

            String name_sample_file;
            name_sample_file = "_few/RSS973602347.xml";

            name_sample_file = "US/en/business/CNNcomBusiness/y2011/m11/d11/RSS973602347_test.xml";
            Path articlePath = Paths.get(name_sample_file);
            Document articleXml = dBuilder.parse(archive.resolve(articlePath).toFile());

            //fileList.put(articlePath, articleXml);
            FileService tmp_FileService = new FileService();
            
            fileList = tmp_FileService.getArticles_debug("_few_de/"); //bug
            
            System.out.println(fileList.size());
        

            this.parseFileList(fileList);
            return "finished debug";
        } catch (SAXException ex) {
            Logger.getLogger(XmlParser.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(XmlParser.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParserConfigurationException ex) {
            Logger.getLogger(XmlParser.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "error happened";
    }

    public static Article parse(Path path, Document doc) {
        String s = "";
        Article article = new Article();
        try {

            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            /*
         String xml_str= "<?xml version=\"1.0\"?><class><student></student></class>";
         InputSource inputFile = new InputSource( new ByteArrayInputStream(xml_str.getBytes("utf-8") )  );
             */
            //File inputFile = new File("input.txt");
            //File inputFile = new File("article.xml");

            //Document doc = dBuilder.parse(inputFile);
            doc.getDocumentElement().normalize();

//         System.out.println("Root element :" 
//            + doc.getDocumentElement().getNodeName());
            Element doc_el;
            doc_el = doc.getDocumentElement();

            // @now - these attributes are bad, they read wrong stuff from the xml file
            //parse_xml(doc_el, "title");
            //parse_xml(doc_el, "language");
            //parse_xml(doc_el, "description");
            //parse_xml(doc_el, "pubDate");
            NodeList nList = doc.getElementsByTagName("image");
            Node image_node = nList.item(0);
            Element image_elem = (Element) image_node;

            // @now - thes attributes are useless, they are from some title image
            //parse_xml( image_elem, "url");
            //parse_xml( image_elem, "link");
            // @now -  this is important, it finds the item (the article item in the xml file)
            //         and reads this item node
            NodeList nList_c = doc.getElementsByTagName("item");
            Node item_node = nList_c.item(0);
            Element item_elem = (Element) item_node;

            // id source and topic and author is missing TODO
            //a_title += 
            article.setTitle(
                parse_xml(item_elem, "title")
            );
            s += "\n";
            s += parse_xml(item_elem, "link"); // = url
            String link_str = parse_xml(item_elem, "link");
            s += "\n";
            //s += parse_xml(item_elem, "description");
            //s += "\n";
            s += parse_xml(item_elem, "pubDate");
            s += "\n";

            String path_str = path.normalize().toString();

            s += path_str;

            String line = "This order was placed for QT3000! OK?";
            String pattern;
            String pattern_str;
            //line = path_str;
            //String pattern = ".*htt(p).*";
            //String pattern = "http://(\\d+)(.*).";
            //                  https 

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

            parse_xml(item_elem, "ExtractedText");

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

}
