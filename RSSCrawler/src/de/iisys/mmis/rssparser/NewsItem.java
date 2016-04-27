package de.iisys.mmis.rssparser;


/**
 * A news item combines the information from an object of class "Channel" and an object of class 
 * "Item" into a single object.
 * @author Richard Goebel
 *
 */
public class NewsItem extends Item {
  private String source;
  private String content;
  private String country;
  private String language;
  private String copyright;
  
  public NewsItem() {
  }
  
  public NewsItem(Item item) {
    setTitle(item.getTitle());
    setDescription(item.getDescription());
    setLink(item.getLink());
    setAuthor(item.getAuthor());
    setGuid(item.getGuid());
    setPubDate(item.getPubDate());
  }
  
  
  public void setSource(String s) {
    source = s;
  }
  
  public String getSource() {
    return source;
  }
  
  public void setContent(String c) {
    content = c;
  }
  
  public String getContent() {
    return content;
  }
  
  public String getCountry() { 
	  return country;
  }

  public void setCountry(String country) {
	  this.country = country;
  }
  
  public void setLanguage(String l) {
    language = l;
  }
  
  public String getLanguage() {
    return language;
  }
  
  public void setCopyright(String c) {
    copyright = c;
  }
  
  public String getCopyright() {
    return copyright;
  }
  
  public String toString() {
    return getTitle();
  }
}