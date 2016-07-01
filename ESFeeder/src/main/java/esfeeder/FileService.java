package esfeeder;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 * Handles any file based operations for ESFeeder.
 *
 * @author jmothes
 * @author akolb
 */
public class FileService {

    private final static Charset encoding = StandardCharsets.UTF_8;

    // notifications
    private final static Path notificationFolder = Paths.get("./notifications");
    private final static String notificationFilePrefix = "notification_";

    // archive
    private final static Path archiveParent = Paths.get("./../RSSCrawler");

    // filter for cwa
    private final static Path cwaTopics = Paths.get("./cwaFilter/topics.ser");
    private final static Path cwaSources = Paths.get("./cwaFilter/sources.ser");

    /**
     * Calls {@link #getArticles(List)} with paths from {@link #getSubscribedArticlePaths(boolean)}.
     */
    public Map<Path, Document> getSubscribedArticles(boolean deleteNotificationFiles) {
        return getArticles(getSubscribedArticlePaths(deleteNotificationFiles));
    }

    /**
     * Reads in every line of every notification file in the notification folder. Converts the lines to paths and returns them. Notification fileNames must start with {@link #notificationFilePrefix}.
     *
     * @param deleteNotificationFiles - If true,
     * @return - All lines as a list of Path objects.
     */
    private List<Path> getSubscribedArticlePaths(boolean deleteNotificationFiles) {
        try {
            if (!notificationFolder.toFile().exists()) {
                notificationFolder.toFile().mkdirs();
            }
            List<Path> notificationFiles = Files.walk(notificationFolder)
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().startsWith(notificationFilePrefix))
                    .collect(Collectors.toList());

            List<Path> newArticles = notificationFiles.stream()
                    .flatMap(getLines)
                    .peek(articlePathString -> System.out.println(
                    		"Reading path from notification file: " + articlePathString))
                    .map(articlePathString -> Paths.get(articlePathString))
                    .collect(Collectors.toList());

            if (deleteNotificationFiles) {
                notificationFiles.stream()
                        .forEach(notificationFile -> notificationFile.toFile().delete());
            }
            return newArticles;

        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    /**
     * Converts a path to a stream of all lines in that file.
     */
    private Function<Path, Stream<String>> getLines = (path) -> {
        try {
            return Files.lines(path, encoding);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    };

    /**
     * @param articlePaths - Any paths that point to XML article files.
     * @return - Maps the given paths to the corresponding XML file content.
     */
    public Map<Path, Document> getArticles(Collection<Path> articlePaths) {
        try {
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();

            Map<Path, Document> result = new HashMap<>();
            for (Path articlePath : articlePaths) {
                Document articleXml = dBuilder.parse(archiveParent.resolve(articlePath).toFile());
                result.put(articlePath, articleXml);
            }
            return result;

        } catch (ParserConfigurationException | SAXException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
