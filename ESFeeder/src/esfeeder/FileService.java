package esfeeder;

import java.nio.file.Path;
import java.nio.file.Paths;

public class FileService {
	
	private final static Path notificationFolder = Paths.get("./../notifications");
	private final static String notificationFilePrefix = "notification_";
	private final static Path archive = Paths.get("./../../RSSCrawler/archive_dev");
}
