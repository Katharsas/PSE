package esfeeder;

import static org.junit.Assert.fail;

import org.w3c.dom.Document;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class XmlParserTest {
	
	XmlParser xmlParser;

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
	public void testParse() {
		Document doc = null;
		try{
			xmlParser.parse(null, null);
			fail("Should throw Nullpointer");
			xmlParser.parse(null, doc);
			fail("Should throw Nullpointer");
			xmlParser.parse(null, null);
			fail("Should throw Nullpointer");
		} catch (NullPointerException e){
			
		}
		fail("Not yet implemented");
	}

	@Test
	public void testParseFileList() {
		try{
			xmlParser.parseFileList(null);
			fail("Should throw Nullpointer");
		} catch (NullPointerException e){
			
		}
		fail("Not yet implemented");
	}
}
