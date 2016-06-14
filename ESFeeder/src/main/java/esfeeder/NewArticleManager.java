package esfeeder;

/**
 *
 * @author jmothes
 * @author pmarek
 *
 */
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;

import elasticsearch.ElasticSearchWriter;
import shared.ArticleId;

public class NewArticleManager {
	private static NewArticleManager newArticleManager;
	private ElasticSearchWriter esWriter;
	private FileService fileService;

	private NewArticleManager(){
		try {
			esWriter = new ElasticSearchWriter();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		fileService = new FileService();
	}

	public void manageArticles() {
	
		//Map<Path, Document> articles;
		articles = fileservice.getSubscribedArticles(true);
		
	}

	public static NewArticleManager getNewArticleManager(){
		if(newArticleManager == null)
			newArticleManager = new NewArticleManager();
		return newArticleManager;
	}

}