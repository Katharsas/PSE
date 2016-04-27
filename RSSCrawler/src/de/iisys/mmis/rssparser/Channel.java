package de.iisys.mmis.rssparser;

import java.util.*;

/**
 * An object of class "Channel" provides the information retrieved from the element "channel"
 * in an RSS file.
 * @author Richard Goebel
 *
 */

public class Channel {
  private String title;
  private String link;
  private String description;
  private String language;
  private String copyright;
  private String pubDate;
  private int ttl; // time to live in minutes
  private LinkedList<Item> items = new LinkedList<Item>();
  
  public Channel() {
  }
  
  public void setTitle(String t) {
    title = t;
  }
  
  public String getTitle() {
    return title;
  }
  
  public void setLink(String l) {
    link = l;
  }
  
  public String getLink() {
    return link;
  }
  
  public void setDescription(String d) {
    description = d;
  }
  
  public String getDescription() {
    return description;
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
  
  public void setPubDate(String d) {
    pubDate = d;
  }
  
  public String getPubDate() {
    return pubDate;
  }
  
  public void setTTL(int t) {
    ttl = t;
  }
  
  public int getTTL() {
    return ttl;
  }
  
  public void addItem(Item item) {
    items.add(item);
  }
  
  public LinkedList<Item> getItems() {
    return items;
  }
  
  public String toString() {
    StringBuffer sb = new StringBuffer ();
    sb.append("TITLE: ");
    sb.append(title);
    sb.append('\n');
    sb.append("LINK: ");
    sb.append(link);
    sb.append('\n');
    sb.append("DESCRIPTION: ");
    sb.append(description);
    sb.append('\n');
    sb.append("LANGUAGE: ");
    sb.append(language);
    sb.append('\n');
    sb.append("COPYRIGHT: ");
    sb.append(copyright);
    sb.append('\n');
    sb.append("PUBLICATION DATE: ");
    sb.append(pubDate);
    sb.append('\n');
    sb.append('\n');
    return sb.toString();
  }
}