

public class Article{

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

	private String id, //hashed article name
			title,
			pubDate, //"2000-12-11"
			extractedText,
			author = "",
			topic, //buisiness, culture
			source, //Spiegel, CNN
			url; //link to article
			
	//metainfos can be placed here if needed
	private String[] meta;

	public Article(){
    
    }


}