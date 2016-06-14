package esfeeder;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.joda.time.IllegalFieldValueException;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class ArticleParserTest {

	ArticleParser articleParser;
	
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {	
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		articleParser = new ArticleParser();
	}

	@After
	public void tearDown() throws Exception {
		articleParser = null;
	}

	@Test
	public void testParse_pubDate() {
		String returnValue;
		try{
			articleParser.parse_pubDate(null);
			fail("Should throw Nullpointer");
		} catch (NullPointerException e){
		}
		
		returnValue = articleParser.parse_pubDate("");
		assertEquals("Empty String not catched!", "", returnValue);
		
		returnValue = articleParser.parse_pubDate("Sat, 12 Nov 2011 13:02:53 EST");
		assertEquals("Implementation incorrect","2011 11 12 13:02:53",returnValue);
		
		returnValue = articleParser.parse_pubDate("Tue, 14 Jun 2016 10:50:20 EST");
		assertEquals("Implementation incorrect", "2016 06 14 10:50:20", returnValue);
		
		try{
			articleParser.parse_pubDate("SomeRandomCharaktersAndStuffYouSeeEveryDayAnItIsPrettyLong");
			fail("Should throw something");
			articleParser.parse_pubDate("Tes");
			fail("Should throw something");
			articleParser.parse_pubDate("123");
			fail("Should throw something");
			articleParser.parse_pubDate("XYZ, 40 Fex 0001 99:99:99 ECT");
			fail("Should throw something");
		} catch (Exception e){
			
		}
	}

	@Test
	public void testParse_source() {
		String returnValue;
		returnValue = articleParser.parse_source("http://blog.google.com/hello/devblog/info.html");
		assertEquals("Implementation incorrect", "google.com", returnValue);
		returnValue = articleParser.parse_source("");
		assertEquals("Empty String not catched!", "", returnValue);
		returnValue = articleParser.parse_source("https://www.google.de");
		assertEquals("Implementation incomplete", "google.de", returnValue);
		returnValue = articleParser.parse_source("http://blog.tumblr.co.uk/index.html");
		assertEquals("Implementation incomplete", "tumblr.co.uk", returnValue);
	}

	@Test
	public void testParse_topic() {
		fail("Not yet implemented");
	}

}
