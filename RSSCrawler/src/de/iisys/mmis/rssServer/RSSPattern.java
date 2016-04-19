package de.iisys.mmis.rssServer;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * An RSSPattern provides conditions for a subscription. Possible conditions are the language, 
 * the topic and the source of an article. In addition lower and upper bounds may be specified
 * separately for the year, the month and the day of the publication of an article. A missing
 * condition means that all values are allowed.
 * 
 * @author Richard Goebel
 *
 */
public class RSSPattern {
	private String country=null;
	private String lang=null;
	private String topic=null; 
	private String source=null;
	private int syear=Integer.MIN_VALUE;
	private int smonth=Integer.MIN_VALUE;
	private int sday=Integer.MIN_VALUE;
	private int eyear=Integer.MAX_VALUE;
	private int emonth=Integer.MAX_VALUE;
	private int eday=Integer.MAX_VALUE;

	public RSSPattern () {
		
	}
	
	public String getCountry() { 
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
	
	public String getLang() {
		return lang;
	}
	
	public void setLang(String lang) {
		this.lang = lang;
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
	
	public int getSyear() {
		return syear;
	}
	
	public void setSyear(int syear) {
		this.syear = syear;
	}
	
	public int getSmonth() {
		return smonth;
	}
	
	public void setSmonth(int smonth) {
		this.smonth = smonth;
	}
	
	public int getSday() {
		return sday;
	}
	
	public void setSday(int sday) {
		this.sday = sday;
	}
	
	public int getEyear() {
		return eyear;
	}
	
	public void setEyear(int eyear) {
		this.eyear = eyear;
	}
	
	public int getEmonth() {
		return emonth;
	}
	
	public void setEmonth(int emonth) {
		this.emonth = emonth;
	}
	
	public int getEday() {
		return eday;
	}
	
	public void setEday(int eday) {
		this.eday = eday;
	}
	
	boolean check (String country, String lang, String topic, String source, Date date) {
		GregorianCalendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH)+1;
		int day = calendar.get(Calendar.DAY_OF_MONTH);
		if (this.country != null && ! country.equals(this.country)) return false;
		if (this.lang != null && ! lang.equals(this.lang)) return false;
		if (this.topic != null && ! topic.equals(this.topic)) return false;
		if (this.source != null && ! source.equals(this.source)) return false;
		if (year < syear || year > eyear) return false;
		if (month < smonth || month > emonth) return false;
		if (day < sday || day > eday) return false;
		
		return true;
	}
		
}
