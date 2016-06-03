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
    
    public String parse_pubDate (String s){
        String r;
        r = "k";
        
        return r;
    }

    
    public String parse_author (String s){
        String r;
        r = "k";
        
        return r;
    }
    
    public String parse_source (String s){
        String r;
        r = "k";
        
         /*
            * parse url
            * https:// , http:// - split on "//" sign
            * blog.google.com/hello/devblog/info.html
             */
            String pattern = ".*//(.*?)/.*";
            //System.out.println(pattern);
            System.out.println("---");
            //   \\.*

            // Create a Pattern object
            Pattern reg = Pattern.compile(pattern);

            // Now create matcher object.
            
            Matcher m = reg.matcher(s);
            System.out.println("in line:   " + s);
            if (m.find()) {
                //System.out.println("Found value: " + m.group(0));
                System.out.println("Found value: " + m.group(1));
                //System.out.println("Found value: " + m.group(2));
            } else {
                System.out.println("NO MATCH");
            }

        
        return r;
    }

    
    public String parse_topic (String s){
        String r;
        r = "k";
        
        
        
        
        
        
            String path_str = s;

            String line = "This order was placed for QT3000! OK?";
            String pattern;
            String pattern_str;

            // US\en\
            // Germany\de\
            String us = "(US\\en\\)";
            //String de = "(germany\\de\\)";
            // refac todo debug
            String de = "_few_de\\de\\";

            String p_us = Pattern.quote(us);
            String p_de = Pattern.quote(de);
            String p_end = Pattern.quote("\\");
            pattern_str = ".*[" + p_us + "," + p_de + "](.*)" + p_end + ".*";
            pattern_str = ".*" + p_de + "(.*?)" + p_end + ".*";
            System.out.println(pattern_str);

            Pattern regex_topic = Pattern.compile(pattern_str);

            // Now create matcher object.
            line = path_str;
            Matcher m_topic = regex_topic.matcher(line);
            System.out.println("in line:   " + line);
            if (m_topic.find()) {
                //System.out.println("Found value: " + m_topic.group(0));
                System.out.println("Found value: " + m_topic.group(1));
                //System.out.println("Found value: " + m.group(2));
            } else {
                System.out.println("NO MATCH");
            }

        return r;
        
    }

    
    

    
    
    
    
}
