package esfeeder;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
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
    private final static Path archive = Paths.get("./../RSSCrawler/archive_dev");

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
                Document articleXml = dBuilder.parse(archive.resolve(articlePath).toFile());
                result.put(articlePath, articleXml);
            }
            return result;

        } catch (ParserConfigurationException | SAXException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    /**
     * Daniel's debug code
     *
     * Functions to extract xml files from the Crawler archive, so that xml_parser.java can be tested an some sample files
     *
     * @return
     */
    //private final static Path archive_devDaniel = Paths.get("../Daniel_ESDemo_Crawler/data/_few");
    /**
     * List all files that are in this path, including all subdirectories recursively)
     *
     * @param directoryName
     * @return
     */
    private static List<File> listFiles_debug(String directoryName) {
        File directory = new File(directoryName);

        List<File> resultList = new ArrayList<File>();

        // get all the files from a directory
        File[] fList = directory.listFiles();
        //resultList.addAll(Arrays.asList(fList));
        for (File file : fList) {
            if (file.isFile()) {
                resultList.add(file);
            } else if (file.isDirectory()) {
                resultList.addAll(listFiles_debug(file.getAbsolutePath()));
            }
        }
        //System.out.println(fList);
        return resultList;
    }

    /**
     * Parses articles in folder "subpath_name" into Map<Path, Document>
     *
     * @param subpath_name - name of archive directory (where the Crawler files are located)
     * @return
     */
    public Map<Path, Document> getArticles_debug(String subpath_name) {

        String path_name = "../Daniel_ESDemo_Crawler/data/" + subpath_name; // bug todo, not use this bad String concat

        List<Path> articlePaths = new ArrayList<Path>();//Collections.<Path>emptyList();
        //List<String> list = Collections.<String>emptyList();

        List<File> fileList = listFiles_debug(path_name);

        for (File file : fileList) {
            //articlePaths.add(  (file.getPath()) );
            //articlePaths.add(  Paths.get(file.getPath();) );
            Path _p = file.toPath();
            //System.out.print("added path ");
            //System.out.println(_p);
            articlePaths.add(_p);
        }
        //articlePathString -> Paths.get(articlePathString)
        Map<Path, Document> articles = getArticles(articlePaths);
        return articles;
    }

}
