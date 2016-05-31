package esfeeder;
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
		List<Path> newArticlePaths = fileService.getSubscribedArticles(false);
		

	}
}