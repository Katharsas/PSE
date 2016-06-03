package esfeeder;

/**
 * @author dbeckstein
 * @author akolb
 */
public class Article {

    private final ArticleId id; //hashed article name

    private String title,
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
        return this.title;
    }

    /*
	 * Getter & Setter
     */
    public ArticleId getArticleId() {
        return id;
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
