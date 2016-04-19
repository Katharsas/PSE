package de.iisys.mmis.rssparser;

import java.util.*;

/**
 * The class NewsItemComparator provides a comparator for objects of class "NewsItem". For
 * this purpose two items are compared by their publication date. With this approach the 
 * comparator facilitates the sorting of news item according to their publications date.
 * 
 * @author Richard Goebel
 *
 */
public class NewsItemComparator implements Comparator<NewsItem> {
  
  public int compare(NewsItem o1, NewsItem o2) {
    return o2.getPubDate().compareTo(o1.getPubDate());
  }
}