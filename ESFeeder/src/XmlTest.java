import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;
import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;

public class XmlTest{

	public static void main( String[] args ){
		
		Document doc = null;
	
		try{
		    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            doc = dBuilder.parse( "file.xml" );
            
        } catch ( ParserConfigurationException | SAXException e ) {
			System.out.println( "ParserConfigurationException" );
		} catch ( IOException e ) {
			System.out.println( "IOException" );
		}
		
		System.out.println( doc.getXmlVersion() );
	
	}

}