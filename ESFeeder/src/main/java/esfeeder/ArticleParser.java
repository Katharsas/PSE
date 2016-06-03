/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package esfeeder;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author Daniel
 */
public class ArticleParser {

    public String parse_pubDate(String s) {
        String r;
        r = s;

        return r;
    }

        /**
         *
         * todo
         *
         * actionlogout, ActionSay ... ! site/say?message=lkj alles in site conntroler
         *
         * article proper stirng object print parse data, topic ....
         *
         * important : safe topics as set import run , new with better functions
         *
         *
         * parse url https:// , http:// - split on "//" sign blog.google.com/hello/devblog/info.html
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
            System.exit(1);
            //bug
        }

        return r;
    }

    public String parse_topic(String topic) {
        String r;
        r = null;
        String pattern_str;

        // US\en\
        // Germany\de\
        String us = "(US\\en\\)";
        //String de = "(germany\\de\\)";
        // refac todo debug
        //String de = "_few_de\\de\\";
        String de = "\\de\\"; //bug gemrany?

        String p_us = Pattern.quote(us);
        String p_de = Pattern.quote(de);
        String p_end = Pattern.quote("\\");
        pattern_str = ".*[" + p_us + "," + p_de + "](.*)" + p_end + ".*";
        pattern_str = ".*" + p_de + "(.*?)" + p_end + ".*";
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
            System.exit(1); //bug
        }
        
        return r;

    }

}
