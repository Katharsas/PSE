package esfeeder;
import java.nio.file.Path;
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
	
	
	public static void main(String[] args) {
		System.out.println("Executing ESFeeder...");
		FileService fileService = new FileService();
		List<Path> newArticlePaths = fileService.getSubscribedArticles(false);
	}
}
