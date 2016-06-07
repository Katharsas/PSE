package esfeeder;
import java.util.List;

import shared.ArticleId;

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
