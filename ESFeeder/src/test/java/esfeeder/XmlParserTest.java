package esfeeder;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import shared.Article;

public class XmlParserTest {

	XmlParser xmlParser;
	private final static Path archive = Paths.get("./../RSSCrawler/archive_dev");

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		xmlParser = new XmlParser();
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testParse_xml() {
		String returnValue;
		Element item_elem;

		// Declaration of the method for making the method public
		Class<? extends XmlParser> targetClass = xmlParser.getClass();
		Class[] cArg = new Class[2];
		cArg[0] = Element.class;
		cArg[1] = String.class;
		Method method = null;
		try {
			method = targetClass.getDeclaredMethod("parse_xml", cArg);
		} catch (NoSuchMethodException | SecurityException e1) {
			e1.printStackTrace();
		}
		method.setAccessible(true);

		// Declaration of Element

		item_elem = generateElement("../Daniel_ESDemo_Crawler/data/germany/de/career/HherweiterKarriere/y2016/m2/d16",
				"RSS634430312.xml");

		// Test NullPointerException
		try {
			try {
				method.invoke(xmlParser, null, null);
				fail("Should throw NullPointer");
			} catch (InvocationTargetException e) {
				if (e.getCause() instanceof RuntimeException)
					throw (RuntimeException) e.getCause();
				else
					throw e;
			} catch (IllegalArgumentException | IllegalAccessException e) {
				e.printStackTrace();
			}
		} catch (NullPointerException e) {

		} catch (Exception e) {
			e.printStackTrace();
		}

		// Other Tests
		try {
			returnValue = (String) method.invoke(targetClass, item_elem, "pubDate");
			assertEquals("Implementation incorrect", "Tue, 16 Feb 2016 19:08:35 -0000", returnValue);
			returnValue = (String) method.invoke(targetClass, item_elem, "category");
			assertEquals("Implementation incorrect", "Beruf", returnValue);
			returnValue = (String) method.invoke(targetClass, item_elem, "nosuchthingtagthingy");
			assertEquals("Implementation incorrect", "", returnValue);

		} catch (NullPointerException e) {

		} catch (InvocationTargetException | IllegalAccessException e) {
			fail("Should not throw NullPointerException!");
			e.printStackTrace();
		}

		item_elem = generateElement("../Daniel_ESDemo_Crawler/data/US/en/technology/CNNcomTechnology/y2012/m8/d3",
				"RSS1635295952.xml");

		try {
			returnValue = (String) method.invoke(targetClass, item_elem, "pubDate");
			System.out.println(returnValue);
			assertEquals("Implementation incorrect", "Fri, 03 Aug 2012 11:59:24 EDT", returnValue);
			returnValue = (String) method.invoke(targetClass, item_elem, "category");
			assertEquals("Implementation incorrect", "", returnValue);
			returnValue = (String) method.invoke(targetClass, item_elem, "nosuchthingtagthingy");
			assertEquals("Implementation incorrect",
					"Put your phone down for a second, teen texters -- there are some things you've got to hear.&lt;img src=\"http://feeds.feedburner.com/~r/rss/edition_technology/~4/mFKZeL3oHyM\" height=\"\1\" width=\"1\"/&gt;",
					returnValue);

		} catch (NullPointerException e) {

		} catch (InvocationTargetException | IllegalAccessException e) {
			fail("Should not throw NullPointerException!");
			e.printStackTrace();
		}
	}

	@Test
	public void testParse() {
		Document doc = null;

		String returnValue;
		Class<? extends XmlParser> targetClass = xmlParser.getClass();
		Class[] cArg = new Class[2];
		cArg[0] = Path.class;
		cArg[1] = Document.class;
		Method method = null;

		try {
			method = targetClass.getDeclaredMethod("parse", cArg);
			method.setAccessible(true);
		} catch (NoSuchMethodException | SecurityException e) {
			e.printStackTrace();
		}

		try {
			try {
				method.invoke(targetClass, null, null);
				fail("Should throw NullPointer");
			} catch (InvocationTargetException e) {
				if (e.getCause() instanceof RuntimeException)
					throw (RuntimeException) e.getCause();
				else
					throw e;
			}
		} catch (NullPointerException e) {

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	@Test
	public void testParseFileList() {
		try {
			xmlParser.parseFileList(null);
			fail("Should throw Nullpointer");
		} catch (NullPointerException e) {

		}
		fail("Not yet implemented");
	}

	private Element generateElement(String path, String file) {
		File inputFile;
		DocumentBuilderFactory dbFactory;
		DocumentBuilder dBuilder;
		Document doc = null;
		NodeList nList_c;
		Node item_node;

		inputFile = new File(path + "/" + file);
		dbFactory = DocumentBuilderFactory.newInstance();
		try {
			dBuilder = dbFactory.newDocumentBuilder();
			doc = dBuilder.parse(inputFile);
		} catch (ParserConfigurationException | SAXException | IOException e) {
			e.printStackTrace();
		}
		doc.getDocumentElement().normalize();
		nList_c = doc.getElementsByTagName("item");
		item_node = nList_c.item(0);
		return (Element) item_node;
	}
}
