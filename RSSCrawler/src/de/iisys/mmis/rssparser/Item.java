package de.iisys.mmis.rssparser;

import java.util.*;

/**
 * An object of class "Item" provides the information retrieved from an element "item" from 
 * an RSS file.
 * @author Richard Goebel
 *
 */
public class Item {
  private String title;
  private String description;
  private String link;
  private String author;
  private String guid;
  private Date pubDate;
  private String text;
  private String html;
  private String fileName;
  private boolean pubDateSystemTime; // true if system time was used for pubDate

  public Item() {
  }
  
  public void setTitle(String s) {
    title = s;
  }
  
  public String getTitle() {
    return title;
  }
  
  public void setDescription(String s) {
    description = s;
  }
  
  public String getDescription() {
    return description;
  }
  
  public void setLink(String s) {
    link = s;
  }
  
  public String getLink() {
    return link;
  }
  
  public void setAuthor(String s) {
    author = s;
  }
  
  public String getAuthor() {
    return author;
  }
  
  public void setGuid(String s) {
    guid = s;
  }
  
  public String getGuid() {
    return guid;
  }
  
  public void setPubDate(Date d) {
    pubDate= d;
  }
  
  public Date getPubDate() {
    return pubDate;
  }
  
  public void setText(String text) {
    this.text = text;
  }
  
  public String getText() {
    return text;
  }
  
  public void setHtml(String html) {
	this.html = html;
  }
  
  public String getHtml() {
    return html;
  }
	  
  public void setFileName(String fileName) {
	  this.fileName = fileName;
  }
  
  public String getFileName() {
	  return fileName;
  }
  
  public void setPubDateSystemTime(Boolean timeChanged){
	  pubDateSystemTime = timeChanged;
  }
  
  public boolean getPubDateSystemTime () {
	  return pubDateSystemTime;
  }
	   
  public String toString() {
    StringBuffer sb = new StringBuffer();
    
    sb.append("TITLE: ");
    sb.append(title);
    sb.append('\n');
    sb.append("DESCRIPTION: ");
    sb.append(description);
    sb.append('\n');
    sb.append("LINK: ");
    sb.append(link);
    sb.append('\n');
    sb.append("AUTHOR: ");
    sb.append(author);
    sb.append('\n');
    sb.append("GUID: ");
    sb.append(guid);
    sb.append('\n');
    sb.append("PUBLICATION DATE: ");
    sb.append(pubDate);
    sb.append('\n');
    sb.append('\n');
    
    return sb.toString();
  }
}