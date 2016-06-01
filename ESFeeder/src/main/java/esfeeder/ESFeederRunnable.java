package esfeeder;
import java.io.File;
import java.nio.file.Path;
import java.util.List;

/**
 *
 * @author jmothes
 */
 
public class ESFeederRunnable implements Runnable {

	private NewArticleManager newArticleManager;
	private DuplicateManager duplicateManager;

	@Override
	public void run() {
		newArticleManager = new NewArticleManager();
		List<ArticleId> newIds = newArticleManager.manageArticles();
		duplicateManager = new DuplicateManager();
	}


	public static void main(String[] args) {
		System.out.println("Executing ESFeeder...");
    	FileService fileService = new FileService();
//      commented this to make project compile #todo refac
//      List<Path> newArticlePaths = fileService.getSubscribedArticles(false);

        /*
        * Daniel's code
        * Some test and debugging code to compile and test the XmlParser class
        */
        Article a = new Article();
        XmlParser x = new XmlParser();
        String name_sample_file = "../Daniel_ESDemo_Crawler/data/_few/RSS973602347.xml";
        File sample_file = new File(name_sample_file);
        String s = x.parse(sample_file);
        System.out.println(s);
        System.out.println("... finished");
                
		

	}
}