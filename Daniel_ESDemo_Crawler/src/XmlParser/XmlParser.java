/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package XmlParser;

/**
 *
 * @author Daniel
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
         
         parse_xml(doc_el, "title");
         parse_xml(doc_el, "language");
         //parse_xml(doc_el, "description");
         parse_xml(doc_el, "pubDate");
         
         NodeList nList = doc.getElementsByTagName("image");
         Node image_node = nList.item(0);
         Element image_elem = (Element) image_node;
       
         parse_xml( image_elem, "url");
         parse_xml( image_elem, "link");

         
         
         NodeList nList_c = doc.getElementsByTagName("item");
         Node item_node = nList_c.item(0);
         Element item_elem = (Element) item_node;
       
         //parse_xml(doc_el, "");
         parse_xml(item_elem, "title");
         parse_xml(item_elem, "link");
         parse_xml(item_elem, "description");
         parse_xml(item_elem, "pubDate");
          //parse_xml(item_elem, "media:thumbnail");//guid?
         s = parse_xml(item_elem, "ExtractedText");
          
         
      } catch (Exception e) {
         e.printStackTrace();
      }
      return s;
   }

}
