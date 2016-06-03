package esfeeder;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;

import elasticsearch.ElasticSearchController;
import elasticsearch.ElasticSearchWriter;

public class NewArticleManager {
	private static NewArticleManager newArticleManager;
	private ElasticSearchController eswriter;
	private FileService fileservice;
	
	private NewArticleManager(){
		try {
			eswriter = new ElasticSearchWriter();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		fileservice = new FileService();
	}
	
	public List<ArticleId> manageArticles() {
		Map<Path, Document> articles;
		articles = fileservice.getSubscribedArticles(true);
		throw new UnsupportedOperationException("Not yet implemented!");
	}
	
	//TODO Replace Object with some kind of Json-Object
	public List<ArticleId> addArticles(List<Object> json){
		throw new UnsupportedOperationException("Not yet implemented!");
	}
	
	public void parseToJson(Map<Path, Document> xml){
		throw new UnsupportedOperationException("Not yet implemented!");
	}
	
	public static NewArticleManager getNewArticleManager(){
		if(newArticleManager == null)
			newArticleManager = new NewArticleManager();
		return newArticleManager;
	}
	
}
