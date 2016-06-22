package esfeeder;

/**
 *
 * @author jmothes
 */

import java.io.IOException;
import java.lang.Exception;
import java.util.Map;
import java.nio.file.Path;
import java.util.List;

import org.w3c.dom.Document;

import shared.Article;
import elasticsearch.ElasticSearchWriter;


public class ESFeederRunnable implements Runnable {

    @Override
    public void run() {
    }

	public static void main(String[] args) {
		startFeeding();
	}

	private static void startFeeding(){
System.out.println("Executing ESFeeder..."); //DEBUG

		//Gang of Three
    	FileService fileService = new FileService();
    	XmlParser xmlParser = new XmlParser();
    	ElasticSearchWriter esWriter;

		//Returns a Map with Path to Document; false -> don't delete Notification Files
		Map<Path, Document> newArticlePaths = fileService.getSubscribedArticles(false);
		//Uses the Map and returns an ArrayList with Articles
		List<Article> newArticles = xmlParser.parseFileList(newArticlePaths);

    	try{
    		esWriter = new ElasticSearchWriter();
    		try{
				esWriter.putMany(newArticles);
			}catch(IOException putArticle){
				//Puts the Articles from the ArrayList in ES
				putArticle.printStackTrace();
				//last call to esWriter that can and must be done! esWriter == destroyed
				esWriter.free();
			}
    	}catch(IOException createESW){
    		createESW.printStackTrace();
    	}catch(Exception e){
    		e.printStackTrace();
    	}



        /*
        * Daniel's code
        * Some test and debugging code to compile and test the XmlParser class
         */
        XmlParser x = new XmlParser();
        //String s = x.parse(sample_file);
        // -------------------------------------- new debug stuff
        //String s = x.debug();
        //System.out.println(s);
        //System.out.println("... finished");
    }
}
