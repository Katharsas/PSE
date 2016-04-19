package de.iisys.mmis.rssparser;

import java.io.*;
import java.net.*;
import java.text.*;
import java.util.*;

import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;

import org.xml.sax.helpers.*;
import org.w3c.dom.*;

import de.iisys.mmis.logging.ServerLogfile;

/**
 * The class RSSParser reads XML files from RSS Feeds, extracts the content of these files
 * and store this content as objects of class Channel. These objects represents
 * referenced articles by objects of class Item. For every article an XML file is generated
 * which has a very similar form as the original file from the feed but contains only the
 * reference to a single article. In addition to a regular RSS file the archived files includes
 * the element "ExtractedText" providing the extracted text from the article itself.
 * The parser uses the Boiler Pipe library for this extraction task.
 * 
 * @author Richard Goebel
 *
 */
public class RSSParser {
	private final int TIMEOUT = 15000; // timeout for boilerpipe
	private DocumentBuilder db;
	private ServerLogfile errorFile, messageFile;

	/**
	 * The constructor registers the two logfiles for errors and messages and initializes
	 * a document builder for parsing XML files;
	 * 
	 * @param messageFile reference to message file
	 * @param errorFile reference to error file
	 */
	public RSSParser (ServerLogfile messageFile, ServerLogfile errorFile) {
		this.errorFile = errorFile;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		dbf.setValidating(false);
		dbf.setNamespaceAware(true);
		dbf.setIgnoringComments(true);
		dbf.setIgnoringElementContentWhitespace(true);
		dbf.setExpandEntityReferences(true);
		try {
			db = dbf.newDocumentBuilder();
			db.setErrorHandler(new DefaultHandler());
		} catch(Exception e) {
			errorFile.writeEvent("RSSParser", "constructor", "Failed to generate document builder: " + e);
		}
	}

	/**
	 * Support function retrieving the textual content of an XML element
	 * @param elem root element as the start point for the search
	 * @param tagName specifies element for which the text content needs to be retrieved
	 * @return
	 */
	private String getElemContent(Element elem, String tagName) {
		String result = null;
		NodeList list = elem.getElementsByTagName(tagName);
		if (list != null && list.item(0) != null) {
			Element subElem = (Element) list.item(0);
			if (subElem.getChildNodes() != null && subElem.getChildNodes().item(0) != null) {
				result = subElem.getChildNodes().item(0).getNodeValue();
			}
		}
		return result;
	}

	/**
	 * Support function removing all occurrences of the specified elements below a root element.
	 * This function also removes all irrelevant white space. 
	 * @param root root element
	 * @param tagName element to be deleted 
	 */
	private void removeElements(Element root, String tagName) {
		NodeList childList = root.getChildNodes();
		Element elemNode;
		Text textNode;
		int pos=0;
		while (childList.item(pos) != null) {
			if (childList.item(pos) instanceof Element) {
				elemNode = (Element) childList.item(pos);
				if (elemNode.getNodeName().toLowerCase().equals(tagName)) {
					elemNode.getParentNode().removeChild(elemNode);
					continue;
				}
			}
			if (childList.item(pos) instanceof Text) {
				textNode = (Text) childList.item(pos);
				if (textNode.getData().trim().length() == 0) {
					textNode.getParentNode().removeChild(textNode);
					continue;
				}
			}
			pos++;
		}
	}

	/**
	 * Support function generating the directory name for a new archive file
	 * including sub directories for the date
	 * @param prefix top level directory
	 * @param lang language
	 * @param topic specifies a topic (e.g. "politics")
	 * @param rsstitle the title of RSS the channel (not the article!)
	 * @param d the date of the article
	 * @return
	 */
	private String genDateDirName(String prefix, String country, String lang, String topic, String rsstitle, Date d) {
		StringBuffer sb = new StringBuffer();
		GregorianCalendar calendar = new GregorianCalendar();
		calendar.setTime(d);
		sb.append(prefix);
		sb.append(country);
		sb.append('/');
		sb.append(lang);
		sb.append('/');
		sb.append(topic);
		sb.append('/');
		sb.append(rsstitle.replaceAll("\\W+", ""));
		sb.append("/y" + calendar.get(Calendar.YEAR));
		sb.append("/m" + (calendar.get(Calendar.MONTH)+1));
		sb.append("/d" + calendar.get(Calendar.DAY_OF_MONTH));
		return sb.toString();
	}

	/**
	 * Support function generating the directory name for a new archive file
	 * without sub directories for the date
	 * @param prefix top level directory
	 * @param lang language
	 * @param topic specifies a topic (e.g. "politics")
	 * @param rsstitle the title of RSS the channel (not the article!)
	 * @return
	 */
	private String genDirName(String prefix, String country, String lang, String topic, String rsstitle) {
		StringBuffer sb=new StringBuffer();
		sb.append(prefix);
		sb.append(country);
		sb.append('/');
		sb.append(lang);
		sb.append('/');
		sb.append(topic);
		sb.append('/');
		sb.append(rsstitle.replaceAll("\\W+", ""));
		sb.append('/');		
		sb.append("timeless");
		return sb.toString();
	}

	/**
	 * Support function generating the file name of an archive file
	 * @param prefix file prefix
	 * @param title title of article used to generate the hash code
	 * @param suffix file suffix
	 * @return
	 */
	private String genFileName(String prefix, String title, String suffix) {
		StringBuffer sb = new StringBuffer();
		sb.append(prefix);
		sb.append(title.hashCode());
		sb.append(suffix);
		return sb.toString();
	}


	/** 
	 * Support function checking whether a file in the specified directory exists. 
	 * In this case the function returns true.
	 * @param dirName directory name for archive file
	 * @param fileName name of archive file
	 * @return
	 */
	private boolean checkFile(String dirName, String fileName) {
		File file = new File(dirName);
		if (! file.exists()) {
			return false;
		}
		dirName += fileName;
		file = new File(dirName);
		return file.exists();
	}

	/** 
	 * Support function for storing an archive file. As a very first step the function
	 * checks whether the corresponding directory exists. In the case the directory
	 * does not exist, the function will generate it. Otherwise the file is stored 
	 * and the function returns true.
	 * 
	 * @param doc document content to be stored
	 * @param dirName directory name for archive file
	 * @param fileName name of archive file
	 * @return
	 */
	private boolean storeFile(Document doc, String dirName, String fileName) {
		File file = new File(dirName);
		try {
			if (! file.exists()) {
				file.mkdirs();
			}

			dirName += fileName;
			file = new File(dirName);
			TransformerFactory tf = TransformerFactory.newInstance();
			Transformer transformer = tf.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

			DOMSource source = new DOMSource(doc);
			StreamResult sink = new StreamResult(file);
			transformer.transform(source,sink);
			return true;

		} catch(Exception e) {
			errorFile.writeEvent("RSSParser", "storeFile", "Error writing XML file " + dirName + ": " +  e);
			return false;
		}
	}

	/**
	 * The method genChannel generates an object of class Channel from the top level element 
	 * "channel" of an RSS file.
	 * @param channel top level element of an RSS file
	 * @return object of class "Channel"
	 */
	public Channel genChannel(Element channel) {
		Channel result = new Channel();
		result.setTitle(getElemContent(channel,"title"));
		result.setLink(getElemContent(channel,"link"));
		result.setDescription(getElemContent(channel,"description"));
		result.setLanguage(getElemContent(channel,"language"));
		result.setCopyright(getElemContent(channel,"copyright"));
		result.setPubDate(getElemContent(channel,"pubDate"));
		try {
			int t = Integer.parseInt(getElemContent(channel,"ttl"));
			result.setTTL(t);
		} catch(Exception e) {
			// probably no valid 'time to live' available
		}
		return result;
	}

	/**
	 * The method genItem generates an object of class "Item" from an item element of
	 * an RSS file.
	 * 
	 * @param item Element "item" from RSS file
	 * @return Object of class "Item"
	 */
	public Item genItem(Element item) {
		DateFormat formatter = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.ENGLISH);
		Date date;
		Item itemObj = new Item();
		itemObj.setTitle(getElemContent(item, "title"));
		try {
			date = formatter.parse(getElemContent(item, "pubDate"));
			itemObj.setPubDateSystemTime(false);
		} catch(Exception e) {
			messageFile.writeEvent("RSSParser", "genItem", "Invalid time format: " + getElemContent(item, "pubDate"));
			// use current system time instead
			date = new Date(System.currentTimeMillis());
			itemObj.setPubDateSystemTime(true);
		}
		itemObj.setDescription(getElemContent(item, "description"));
		itemObj.setLink(getElemContent(item, "link"));
		itemObj.setAuthor(getElemContent(item, "author"));
		itemObj.setGuid(getElemContent(item, "guid"));
		itemObj.setPubDate(date);
		return itemObj;
	}

	/** The function parseFeed reads an RSS feed from the specified URL and
	 * generates corresponding files for every contained item to the archive. 
	 * For every item the function retrieves the text from its corresponding
	 * article using the boilerpipe ()http://code.google.com/p/boilerpipe/. 
	 * Finally the function returns a channel object representing the content 
	 * of the feed.
	 * 
	 * @param url Location of RSS file
	 * @param country Country
	 * @param lang Language
	 * @param topic specifies a topic (e.g. "politics")
	 * @param archivedir top level directory of archive
	 * @return Channel object
	 */

	@SuppressWarnings("deprecation")
	public Channel parseFeed(URL url, String country, String lang, String topic, String archivedir) {
		Channel result;
		InputStream is = null;
		try {
			is = url.openStream();
			Document indoc = db.parse(is);

			// generate channel object for rss file
			Element channelIn = (Element) indoc.getElementsByTagName("channel").item(0);
			result = genChannel(channelIn);

			// generate output document and copy content of input into this document
			Document outdoc = db.newDocument();
			outdoc.appendChild(outdoc.importNode(indoc.getDocumentElement(),true));

			// remove all item nodes from the output document
			Element channelOut = (Element) outdoc.getElementsByTagName("channel").item(0);
			removeElements(channelOut,"item");

			// insert stepwise all items into output document and print it out
			Item itemObj;
			Element itemNode;
			Element textNode;
			String title;
			Date date;
			String archiveDirName;
			String timelessDirName;
			String fileName;
			File file;
			BoilerpipeThread boilerpipe;
			BoilerpipeMonitor monitor;

			NodeList childList = channelIn.getElementsByTagName("item");
			for (int i = 0; i < childList.getLength(); i++) {
				itemNode = (Element) childList.item(i);
				itemObj = genItem(itemNode);
				title = itemObj.getTitle();
				date = itemObj.getPubDate();
				fileName = genFileName("/RSS", title, ".xml");
				archiveDirName=genDateDirName(archivedir, country, lang, topic, result.getTitle(), date);

				if (itemObj.getPubDateSystemTime()==false) {
					// valid publication date found: no system time used
					if (checkFile(archiveDirName,fileName)) {
						// file already exists
						continue;
					}
				}
				else {
					// no publication date found: system time used
					// generate directory name for timeless directory
					timelessDirName=genDirName(archivedir, country, lang, topic, result.getTitle()); 
					if (checkFile(timelessDirName,fileName)) {
						// file name already exists in directory timeless
						continue;
					}
					file = new File(timelessDirName);
					if (! file.exists()) {
						// directory timeless does not exist
						file.mkdirs();
					}
					// generate empty file in directory timeless
					new FileOutputStream(timelessDirName + fileName).close();
				}
				
				synchronized(itemObj) {
					try{
					boilerpipe = new BoilerpipeThread(itemObj, errorFile);
					monitor = new BoilerpipeMonitor(boilerpipe,TIMEOUT);
					boilerpipe.start();
					monitor.start();
					itemObj.wait(TIMEOUT);
					monitor.stop();
					}
					catch (Exception m){
						errorFile.writeEvent("RSSParser", "Parse Feed", "Exception added by me: "+ m);
						
						continue;
					}
				}
							
				if (itemObj.getText() != null) {
					itemNode = (Element) channelOut.appendChild(outdoc.importNode(itemNode,true));
					textNode = outdoc.createElement("ExtractedText");
					textNode.appendChild(outdoc.createTextNode(itemObj.getText()));
					itemNode.appendChild(textNode);
					storeFile(outdoc,archiveDirName,fileName);
					// set file name in item object and add it to result list for notifications
					itemObj.setFileName(archiveDirName + fileName);
					result.addItem(itemObj);
				}
				channelOut.removeChild(itemNode);
			}
		}
		catch(Exception e) {
			errorFile.writeEvent("RSSParser", "parseFeed", "Exception: " + e);
			return null;
		}
		finally {
			if (is != null) {
				try {
					is.close();
				}
				catch (Exception e) {}
			}
		}
		return result;
	}

	/** The function parseArchiveFile reads an archived RSS file and generates an object of
	 * class NewsItem from this file
	 * @return NewsItem
	 */

	public NewsItem parseArchiveFile(File file) {
		NewsItem nItem;
		try {
			Document indoc = db.parse(file);

			// generate channel object for archived file
			Element channelNode = (Element) indoc.getElementsByTagName("channel").item(0);
			Channel channel = genChannel(channelNode);

			// generate item object for archived file
			Element itemNode = (Element) channelNode.getElementsByTagName("item").item(0);
			Item itemObj = genItem(itemNode);

			// Combine channel and item information in newsItem object
			nItem = new NewsItem(itemObj);
			nItem.setSource(channel.getTitle());
			nItem.setContent(channel.getDescription());
			nItem.setLanguage(channel.getLanguage());
			nItem.setCopyright(channel.getCopyright());			
		}
		catch(Exception e) {
			errorFile.writeEvent("RSSParser", "parseArchiveFile", "Exception: " + e);
			return null;
		}
		return nItem;
	}
}