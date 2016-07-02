package esfeeder;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.joda.time.IllegalFieldValueException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import shared.Article;

/**
 * Provides methods to convert articles and their filepaths to {@link Article} objects.
 * Uses {@link ArticleParser}
 */
public class XmlParser {

    /**
     * Returns content of xml node
     *
     * @param node - document node (xml-node)
     * @param fld_name - name of xml field
     * @return
     */
    private static String parse_xml(Element node, String fld_name) {
        String return_value = null;
        try {
            return_value = node
                .getElementsByTagName(fld_name)
                .item(0)
                .getTextContent();
            } catch (NullPointerException ex) {
                //System.out.println("NullPointerException encountered in parse_xml");
                // return_value is left as = null, gets checked lateron with (if (return_value == null))
        }

        if (return_value == null){
            return_value = "";
        }
        if (return_value.length()==0){
            return_value = "";
        }
        return return_value;
    }

    // Trim string
    private String clean(String s) {
        if (s != null) {
            s = s.trim();
        }
        return s;
    }

    /**
     * Parse HashMap element <Path, Document> to Article element
     *
     * @param path
     * @param doc
     * @return
     */
    private Article parse(Path path, Document doc) {
        String s = "";
        // Create ArticleParser to parse content of xml-tags, into Article class (this is like a tiny util class)
        ArticleParser articleParser = new ArticleParser();

        // Article - set id on init
        String id = path.normalize().toString();
        // Create Article element
        Article article = new Article(id);

        // bug todo - check id, is path normal? this long string thingy?, check null
        try {

            // Select proper nodes from xml
            doc.getDocumentElement().normalize();

            Element doc_el;
            doc_el = doc.getDocumentElement();

            NodeList nList_c = doc.getElementsByTagName("item");
            Node item_node = nList_c.item(0);
            Element item_elem = (Element) item_node;

            // Article - set several attributes of Article Class
            // set title
            String a_title = "";
            a_title = parse_xml(item_elem, "title");
            a_title = clean(a_title);
            article.setTitle(a_title);

            // set pubDate
            String a_pubDate = "";
            try {
                a_pubDate = parse_xml(item_elem, "pubDate"); // bug try catch here !
            } catch (NullPointerException ex) {
                //System.out.println("NPE encountered in body");
            } catch (IllegalFieldValueException ex) {
                // detect function behaviour refac
                //System.out.println("illegal filed value");
            }

            a_pubDate = articleParser.parse_pubDate(a_pubDate);
            a_pubDate = clean(a_pubDate);
            article.setPubDate(a_pubDate);

            // set extractedText
            String a_extractedText = "";
            a_extractedText = parse_xml(item_elem, "ExtractedText");
            a_extractedText = clean(a_extractedText);
            article.setExtractedText(a_extractedText);

            // set author
            String a_author = "";
            try {
                a_author = parse_xml(item_elem, "dc:creator"); // todo check xml files for author, <author><dc:...>

            } catch (NullPointerException ex) {
                //System.out.println("no author field set"); // refac
            }
            a_author = clean(a_author);
            article.setAuthor(a_author);

            // set topic
            String a_topic = path.normalize().toString();
            a_topic = articleParser.parse_topic(a_topic);
            a_topic = clean(a_topic);
            article.setTopic(a_topic);

            // set source
            String a_source = parse_xml(item_elem, "link");
            a_source = articleParser.parse_source(a_source);
            a_source = clean(a_source);
            article.setSource(a_source);

            // set url
            String a_url = parse_xml(item_elem, "link");
            a_url = clean(a_url);
            article.setUrl(a_url);

            // @now
            // TODO - these are missing
            // better catch, try ... structure here - refac todo
            s += "";

        } catch (Exception e) {
            e.printStackTrace();//bug refac ?
        }

        return article;
    }

    /**
     * Generates List<Article> object from a Hashmap <Path, Document>
     *
     * @param fileList - Hashmap of files
     */
    public List<Article> parseFileList(Map<Path, Document> fileList) {
        List<Article> articles = new ArrayList<Article>();
        Path path;
        Document doc;
        // Setting null needed to avoid - object might not have been initialized error
        doc = null;
        path = null;

        for (Map.Entry<Path, Document> entry : fileList.entrySet()) {
            path = entry.getKey();
            doc = entry.getValue();
            Article article = this.parse(path, doc);
            articles.add(article);
        }
        //System.out.println(topics_set);
        return articles;
    }
}