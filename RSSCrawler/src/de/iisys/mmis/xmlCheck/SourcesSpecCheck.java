package de.iisys.mmis.xmlCheck;

import java.io.*;
import javax.xml.*;
import javax.xml.parsers.*;
import javax.xml.transform.dom.*;
import javax.xml.validation.*;

import org.xml.sax.helpers.*;
import org.w3c.dom.*;

public class SourcesSpecCheck {
	String currdir;

	public SourcesSpecCheck(String dir) {
		currdir = dir;
	}

	/**
	 * The method "readSourceFile" reads an XML file and checks, whether this file
	 * is complied with the schema definition for source file.
	 * @param file XML file specifying an RSS source
	 */
	public void readSourceFile(File file) {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		Document doc = null;

		dbf.setValidating(true);
		dbf.setIgnoringComments(true);
		dbf.setIgnoringElementContentWhitespace(true);
		dbf.setExpandEntityReferences(true);
		dbf.setNamespaceAware(true);

		try {
			DocumentBuilder db = dbf.newDocumentBuilder();
			db.setErrorHandler(new DefaultHandler());
			doc = db.parse(file);
			SchemaFactory sf = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
			Schema schema = sf.newSchema(new File(currdir + "/RSSFeeds.xsd"));
			Validator v = schema.newValidator();
			v.validate(new DOMSource(doc));
		} catch(Exception e) {
			System.out.println("Invalid format of XML File: " + e);
			return;
		}
		System.out.println("Format of XML file is valid!");
	}
	

	public static void main(String[] args) throws Exception {
		SourcesSpecCheck check = new SourcesSpecCheck(new java.io.File( "." ).getCanonicalPath());
		check.readSourceFile(new File(args[0]));
	}
}