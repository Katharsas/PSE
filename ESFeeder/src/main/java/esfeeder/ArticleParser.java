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

	//TODO Variablennamen vergeben!
	/**
	 * 
	 * @param s
	 * @return
	 * @throws IllegalFieldValueException
	 */
    public String parse_pubDate(String s) throws IllegalFieldValueException {
        String r, s_raw, d_formatted;

        if (s.length() == 0) {

            return "";
        }
        s_raw = s;
        r = null;
        d_formatted = null;
        s = s.substring(0, 25);
        s = s.substring(12 - 7, s.length());
        // check if secs == 60?
        String secs = s.substring(s.length() - 2, s.length());
        if (secs.equals("60")) {
            System.out.println(secs);
            s = s.substring(0, s.length() - 2) + "59";
        }
        if (1 == 1) {
            Locale.setDefault(new Locale("en", "US"));
            DateTimeFormatter formatter = DateTimeFormat.forPattern("dd MMM yyyy HH:mm:ss");
            DateTime dt = formatter.parseDateTime(s);

            d_formatted = new SimpleDateFormat("yyyy MM dd HH:mm:ss").format(dt.toDate());
        }
        if (1 == 0) {
            r = s_raw;
            r += "----";
            //r += s;
            r += d_formatted;
        }
        r = d_formatted;
        return r;
    }

    //TODO
    /*
     * actionlogout, ActionSay ... ! site/say?message=lkj alles in site conntroler
     *
     * article proper stirng object print parse data, topic ....
     *
     * important : safe topics as set import run , new with better functions
     *
     *
     * parse url https:// , http:// - split on "//" sign blog.google.com/hello/devblog/info.html
     *
     *
     * if (1==0){ s = s.substring(0,3); Date date; date=null; try { date = new SimpleDateFormat("MMM", Locale.ENGLISH).parse(s); d_formatted = new SimpleDateFormat("HH:mm:ss yyyy MMM dd").format(date); } catch (ParseException ex) { Logger.getLogger(ArticleParser.class.getName()).log(Level.SEVERE, null, ex); } }
     *
     *
     *
     */
    
    
    /**
     * @param s
     * @return
     */
    public String parse_source(String s) {
        String r;
        r = null;

        String pattern = ".*//(.*?)/.*";
        //System.out.println(pattern);
        //System.out.println("---");
        //   \\.*

        // Create a Pattern object
        Pattern reg = Pattern.compile(pattern);

        // Now create matcher object.
        Matcher m = reg.matcher(s);
        //System.out.println("in line:   " + s);
        if (m.find()) {
            //System.out.println("Found value: " + m.group(0));
            r = m.group(1);
            //System.out.println("Found value: " + r);
            //System.out.println("Found value: " + m.group(2));
        } else {
            System.out.println("NO MATCH");
            //System.exit(1);
            //bug
        }
        // get second dot = "." from right side of url
        // why ? parse  blog.spiegel.de -> spiegel.de 
        //       parse  www.spiegel.de  -> spiegel.de 
        int dotCounter = 0;
        for (int sub = r.length(); sub > 0; sub--) {
            if (r.substring(sub - 1, sub).equals(".")) {
                dotCounter++;
            }
            if (dotCounter >= 2) {
                r = r.substring(sub, r.length());
                break;
            }
        }

        return r;
    }

    /**
     * 
     * @param topic
     * @return
     */
    public String parse_topic(String topic) {
        String r;
        r = null;
        String pattern_str;

        // US\en\
        // Germany\de\
        //String de = "(germany\\de\\)";
        // refac todo debug
        //String de = "_few_de\\de\\";
        String us = "US\\en\\";
        String de = "germany\\de\\"; //bug gemrany?

        String p_us = Pattern.quote(us);
        String p_de = Pattern.quote(de);
        String p_end = Pattern.quote("\\");
        pattern_str = ".*[" + p_us + "," + p_de + "](.*)" + p_end + ".*";
        pattern_str = ".*(?:" + p_de + "|" + p_us + ")(.*?)" + p_end + ".*";
        //System.out.println(pattern_str);

        Pattern regex_topic = Pattern.compile(pattern_str);

        // Now create matcher object.
        Matcher m_topic = regex_topic.matcher(topic);
        //System.out.println("in line:   " + topic);
        if (m_topic.find()) {
            r = m_topic.group(1);
            //System.out.println("Found value: to " + r);
        } else {
            System.out.println("NO MATCH");
            //System.exit(1); //bug
        }

        return r;

    }

}
