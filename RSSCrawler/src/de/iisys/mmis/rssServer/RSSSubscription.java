package de.iisys.mmis.rssServer;

import de.iisys.mmis.rssparser.*;

import java.util.LinkedList;
/**
 * The class RSSSubscription represents a subscription of a user of the archive. The user
 * specifies patterns describing conditions for articles of interest. File names of new articles 
 * satisfying at least one pattern are provided via notification files stored in the
 * directory specified as the argument of the single constructor. 
 * 
 * @author Richard Goebel
 *
 */
public class RSSSubscription {
	private String filename;
	private LinkedList<RSSPattern> patterns = new LinkedList<RSSPattern>();

	public RSSSubscription (String filename) {
		this.filename = filename;
	}
	
	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}
	
	public void addPattern(RSSPattern p) {
		patterns.add(p);
	}

	public LinkedList<RSSPattern> getPatterns() {
		return patterns;
	}
	
	public boolean check(String country, String lang, String topic, String source, Item item) {
		for (RSSPattern pattern : patterns) {
			if (pattern.check(country, lang, topic, source, item.getPubDate())) {
				return true;				
			}
		}
		return false;
	}
}
