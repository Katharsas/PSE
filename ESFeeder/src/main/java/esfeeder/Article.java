package esfeeder;

/**
 * @author dbeckstein
 * @author akolb
 */
public class Article {

    private final ArticleId id; //hashed article name

    // _tmp is a placeholder string to make formatting 
    // of following attributes here nicer
    private String _tmp,
            title,
            pubDate, //"2000-12-11"
            extractedText,
            author = "",
            topic, //buisiness, culture
            source, //spiegel.de, cnn.com
            url; //link to article

    //metainfos can be placed here if needed
    private String[] meta;

    public Article(String id) {
        this.id = new ArticleId(id);
    }

    @Override
    public String toString() {
        String s = "";
        s += "_______________ \n";
        s += "#Article object \n";
        s += "articleID:     ";
        s += this.getArticleId_str() + "\n";
        s += "title:         ";
        s += this.getTitle() + "\n";
        s += "pubDate:       ";
        s += this.getPubDate() + "\n";
        s += "author:        ";
        s += this.getAuthor() + "\n";
        s += "topic:         ";
        s += this.getTopic() + "\n";
        s += "source:        ";
        s += this.getSource() + "\n";
        s += "url:           ";
        s += this.getUrl() + "\n";

        // print the first n chars of ExtreactedText
        String tmp_et;
        int get_first_n_chars = 130;
        tmp_et = this.getExtractedText();

        if (tmp_et.length() < 100) {
            get_first_n_chars = tmp_et.length();
        }

        s += "extractedText: " + "\n";
        s += "------------------------------\n";
        s += tmp_et.substring(0, get_first_n_chars) + "..." + "\n";
        s += "------------------------------\n";

        return s;
    }

    /*
	 * Getter & Setter
     */
    public ArticleId getArticleId() {
        return id;
    }

    public String getArticleId_str() {
        return id.getId().toString(); //bug ? refac
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPubDate() {
        return pubDate;
    }

    public void setPubDate(String pubDate) {
        this.pubDate = pubDate;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String[] getMeta() {
        return meta;
    }

    public void setMeta(String[] meta) {
        this.meta = meta;
    }

}
