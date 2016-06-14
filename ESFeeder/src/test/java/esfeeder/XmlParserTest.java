package esfeeder;

import static org.junit.Assert.fail;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
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
	public void testParse_xml() {
		String returnValue;
		Class targetClass = xmlParser.getClass();
		Class[] cArg = new Class[2];
		cArg[0] = Element.class;
		cArg[1] = String.class;
		Method method;
		
		try {
			method = targetClass.getDeclaredMethod("parse_xml", cArg);
			method.setAccessible(true);

			method.invoke(targetClass, cArg);
			fail("Should throw NullPointer");
		} catch (NoSuchMethodException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SecurityException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (InvocationTargetException e) {

		} catch (IllegalAccessException e) {
		} catch (NullPointerException e) {

		}

		try {

		} catch (NullPointerException e) {

		} catch (Exception e) {

		}
	}

	@Test
	public void testParse() {
		Document doc = null;
		try {
			xmlParser.parse(null, null);
			fail("Should throw Nullpointer");
			xmlParser.parse(null, doc);
			fail("Should throw Nullpointer");
			xmlParser.parse(null, null);
			fail("Should throw Nullpointer");
		} catch (NullPointerException e) {

		}
		fail("Not yet implemented");
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
}
