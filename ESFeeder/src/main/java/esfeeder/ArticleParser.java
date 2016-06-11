package esfeeder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.IllegalFieldValueException;

/**
 *
 * @author dbeckstein
 * @author jfranz
 */
public class ArticleParser {
    
    //TODO - dbeckstein
    // safe topics as set for debugging, check Author field parse nice names ,import run , new with better functions

    /**
     * Parses published date of article
     * 
     * @param pubDate - published date of article
     * @return pubDate that is formatted properly
     * @throws IllegalFieldValueException
     */
    public String parse_pubDate(String pubDate) throws IllegalFieldValueException {
        String pubDate_original, pubDate_formatted;
        pubDate_original = pubDate;
        pubDate_formatted = null;

        // if pubDate is empty, return empty string
        if (pubDate.length() == 0) {
            return "";
        }
        
        // Example value for pubDate:   Fri, 11 Nov 2011 13:02:53 EST
        //                              |-----------------------|
        //                                ^-- match this part
        pubDate = pubDate.substring(0, 25);
        // Example value for pubDate:   Fri, 11 Nov 2011 13:02:53
        //                                   |------------------|
        //                                       ^-- match this part
        pubDate = pubDate.substring(5, pubDate.length());

        // check if seconds == 60, which is invalid, and correct it to 59
        String secs = pubDate.substring(pubDate.length() - 2, pubDate.length());
        if (secs.equals("60")) {
            System.out.println(secs);
            pubDate = pubDate.substring(0, pubDate.length() - 2) + "59";
        }
        
        // Set locale , needed to parse ("Nov, Dec") of date string
        Locale.setDefault(new Locale("en", "US"));
        DateTimeFormatter formatter = DateTimeFormat.forPattern("dd MMM yyyy HH:mm:ss");
        DateTime dt = formatter.parseDateTime(pubDate);

        // Specify date format you want to get
        pubDate_formatted = new SimpleDateFormat("yyyy MM dd HH:mm:ss").format(dt.toDate());

        return pubDate_formatted;
    }
    
    /**
     * Parses source of article
     * 
     * @param source - source of article
     * @return source that is formatted properly
     */
    public String parse_source(String source) {
        String source_formatted;
        source_formatted = null;

        // parse url https:// , http:// - split on "//" sign and on "/" sign after the domain name
        // Example:
        // blog.google.com/hello/devblog/info.html ->  google.com 
        String pattern = ".*//(.*?)/.*";

        // Create a Pattern object
        Pattern reg = Pattern.compile(pattern);

        // Now create matcher object.
        Matcher m = reg.matcher(source);

        //System.out.println("in line:   " + s);
        if (m.find()) {
            source_formatted = m.group(1);
        } else {
            System.out.println("NO MATCH");
        }

        // Find position of second dot = "." from right side of url
        // why ? parse  blog.spiegel.de -> spiegel.de 
        //       parse  www.spiegel.de  -> spiegel.de 
        int dotCounter = 0;
        for (int sub = source_formatted.length(); sub > 0; sub--) {
            if (source_formatted.substring(sub - 1, sub).equals(".")) {
                dotCounter++;
            }
            if (dotCounter >= 2) {
                source_formatted = source_formatted.substring(sub, source_formatted.length());
                break;
            }else{
                // Do not change source formatted, because the proper "." was not found 
                //source_formatted = source_formatted;
            }
        }
        

        return source_formatted;
    }

    /**
     * Parses topic of article
     * 
     * @param topic - topic of article
     * @return topic that is formatted properly
     */
    public String parse_topic(String topic) {
        String topic_formatted;
        topic_formatted = null;
        String pattern_str;

        // us - matches us articles in filepath inside archiv-folder
        String us = "US\\en\\";
        // de - matches germany articles in filepath inside archiv-folder
        String de = "germany\\de\\";

        String p_us = Pattern.quote(us);
        String p_de = Pattern.quote(de);
        String p_end = Pattern.quote("\\");
        pattern_str = ".*[" + p_us + "," + p_de + "](.*)" + p_end + ".*";
        pattern_str = ".*(?:" + p_de + "|" + p_us + ")(.*?)" + p_end + ".*";

        Pattern regex_topic = Pattern.compile(pattern_str);

        // Now create matcher object.
        Matcher m_topic = regex_topic.matcher(topic);
        // System.out.println("in line:   " + topic);
        if (m_topic.find()) {
            topic_formatted = m_topic.group(1);
        } else {
            System.out.println("NO MATCH");
        }

        return topic_formatted;

    }

}
