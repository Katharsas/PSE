package esfeeder;
import java.util.List;

public class DuplicateManager {
	private static DuplicateManager duplicateManager;
	
	private DuplicateManager(){
		
	}
	
	public void manageDuplicates(List<ArticleId> newIds) {
		throw new UnsupportedOperationException("Not yet implemented");
	}
	
	public static DuplicateManager getDuplicateManager(){
		if(duplicateManager == null)
			duplicateManager = new DuplicateManager();
		return duplicateManager;
	}
}
