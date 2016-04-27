package de.iisys.mmis.rssServer;

import java.net.*;

/**
 * This class defines a task for the RSS server. This task is defined by the URL providing
 * the location of an RSS file, the language and the topic of the articles and a time interval
 * between two visits of the site. Note that the language and the topic are specified by the
 * user and are not deduced from the RSS feed or the articles as such. The class also stores
 * the elapsed time since the last visit of a location.
 * 
 * @author Richard Goebel
 *
 */
public class RSSTask {
	private URL url;
	private String country;
	private String lang;
	private String topic;
	private long interval; // time interval for visiting URL in ms
	private long elapsed; // elapsed time since last visit

	public RSSTask(URL url, String country, String lang, String topic, int interval) {
		this.url = url;
		this.country = country; 
		this.lang = lang;
		this.topic = topic;
		this.interval = interval;
	}

	public URL getURL() {
		return url;
	}
	
	public String getCountry() {
		return country;
	}

	public String getLang() {
		return lang;
	}

	public String getTopic() {
		return topic;
	}

	public long getInterval() {
		return interval;
	}

	public void setInterval(long interval) {
		this.interval = interval;
	}

	public long getElapsed() {
		return elapsed;
	}

	public void resetElapsed() {
		elapsed = 0;
	}

	public void addElapsed(long diff) {
		elapsed += diff;
	}
}