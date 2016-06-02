package esfeeder;

/**
 * @author dbeckstein
 * @author akolb
 */

public class Article{

	private ArticleId id; //hashed article name
	private String title,
			pubDate, //"2000-12-11"
			extractedText,
			author = "",
			topic, //buisiness, culture
			source, //spiegel.de, cnn.com
			url; //link to article

	//metainfos can be placed here if needed
	private String[] meta;

	public Article(){
		//empty
    }

	/*
	 * Getter & Setter
	 */
    public ArticleId getArticleId() {
        return id;
    }

    public Article setArticleId(ArticleId id) {
        this.id = id;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public Article setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getPubDate() {
        return pubDate;
    }

    public Article setPubDate(String pubDate) {
        this.pubDate = pubDate;
        return this;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public Article setExtractedText(String extractedText) {
        this.extractedText = extractedText;
        return this;
    }

    public String getAuthor() {
        return author;
    }

    public Article setAuthor(String author) {
        this.author = author;
        return this;
    }

    public String getTopic() {
        return topic;
    }

    public Article setTopic(String topic) {
        this.topic = topic;
        return this;
    }

    public String getSource() {
        return source;
    }

    public Article setSource(String source) {
        this.source = source;
        return this;
    }

    public String getUrl() {
        return url;
    }

    public Article setUrl(String url) {
        this.url = url;
        return this;
    }

    public String[] getMeta() {
        return meta;
    }

    public void setMeta(String[] meta) {
        this.meta = meta;
    }

}