package esfeeder;

/**
 *
 * @author jmothes
 */
public class ESFeederRunnable implements Runnable {

	private NewArticleManager newArticleManager;
	private DuplicateManager duplicateManager;

    @Override
    public void run() {
    }
	
	public static void main(String[] args) {
		startFeeding();
	}
	
	private static void startFeeding(){
		System.out.println("Executing ESFeeder...");
    	//FileService fileService = new FileService();
		//Bug wh no classed found??
		//commented this to make project compile #todo refac
		//List<Path> newArticlePaths = fileService.getSubscribedArticles(false);

        /*
        * Daniel's code
        * Some test and debugging code to compile and test the XmlParser class
         */
        Article a = new Article();
        XmlParser x = new XmlParser();
        //String s = x.parse(sample_file);
        String s = x.debug();
        System.out.println(s);
        System.out.println("... finished");
	}
}

