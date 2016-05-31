/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package XmlParser;

/**
 *
 * @author Daniel
 * @author akraft
 */
   
import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
//import javax.json.*;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import java.io.*;
import java.util.StringTokenizer;


public class XmlParser {
   
    

   private static String parse_xml(Element node, String fld_name){
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
   
 
   public static String parse(File inputFile){
      String s = "";
      try {	
     
         DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
         DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
         /*
         String xml_str= "<?xml version=\"1.0\"?><class><student></student></class>";
         InputSource inputFile = new InputSource( new ByteArrayInputStream(xml_str.getBytes("utf-8") )  );
         */
         //File inputFile = new File("input.txt");
         //File inputFile = new File("article.xml");
         
         Document doc = dBuilder.parse(inputFile);
         
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
         
         parse_xml(item_elem, "title");
         parse_xml(item_elem, "link"); // = url
         parse_xml(item_elem, "description");
         parse_xml(item_elem, "pubDate");
          
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
         
         
         s = "return value dummy"; 
         
      } catch (Exception e) {
         e.printStackTrace();
      }
      return s;
   }

}
