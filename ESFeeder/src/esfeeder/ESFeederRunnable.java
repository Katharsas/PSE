package esfeeder;
import java.util.List;

public class ESFeederRunnable implements Runnable {

	private NewArticleManager newArticleManager;
	private DuplicateManager duplicateManager;
	
	@Override
	public void run() {
		newArticleManager = new NewArticleManager();
		List<ArticleId> newIds = newArticleManager.manageArticles();
		duplicateManager = new DuplicateManager();
		duplicateManager.manageDuplicates(newIds);
	}
	
}
