package esfeeder;

/**
 *
 * @author jmothes
 */

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;

import elasticsearch.ElasticSearchWriter;
import shared.Article;

/**
 * Main entry point.
 * Executes a single ESFeeder iteration. Can be used inside a Thread to be executed periodically.
 */
public class ESFeederRunnable implements Runnable {

	public static void main(String[] args) {
		new ESFeederRunnable().run();
	}
	
	@Override
	public void run() {
		System.out.println("Executing ESFeeder..."); // DEBUG

		// Gang of Three
		FileService fileService = new FileService();
		XmlParser xmlParser = new XmlParser();
		
		// Returns a Map with Path to Document; false -> don't delete
		// Notification Files
		Map<Path, Document> newArticlePaths = fileService.getSubscribedArticles(false);
		// Uses the Map and returns an ArrayList with Articles
		List<Article> newArticles = xmlParser.parseFileList(newArticlePaths);

		try(ElasticSearchWriter esWriter = new ElasticSearchWriter()) {
			esWriter.putMany(newArticles);
		} catch (IOException createESW) {
			throw new UncheckedIOException(createESW);
		}
	}
}
