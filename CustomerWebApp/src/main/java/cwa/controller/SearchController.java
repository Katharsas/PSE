package cwa.controller;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.PatternSyntaxException;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cwa.service.ArticleProvider;
import cwa.service.MetaDataProvider;
import shared.Article;
import shared.ArticleId;

/**
 * Controller for search query and similar search with easy custom validation
 * mechanism.
 * 
 * @author jmothes
 */
@Controller
public class SearchController {
	
	private final ArticleProvider articleProvider;
	private final MetaDataProvider metaDataProvider;
	
	@Inject
	public SearchController(@Qualifier("prod") ArticleProvider articleProvider, @Qualifier("prod") MetaDataProvider metaDataProvider) {
		this.articleProvider = articleProvider;
		this.metaDataProvider = metaDataProvider;
	}
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String indexPage() {
		return "search.html";
	}
	
	@RequestMapping(value = "/getMetadata", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, List<String>> metaData() {
		System.out.println("------------------------------------- getMetaData Request START");
		Map<String, List<String>> metaData = new HashMap<>();
		metaData.put("sources", metaDataProvider.getSources());
		metaData.put("topics", metaDataProvider.getTopics());
        metaData.put("errorMessage", null);
        System.out.println("------------------------------------- getMetaData Request END");
		return metaData;
	}
	
	/**
	 * @param id - id of the article of which to find similar articles
	 * @param range - range in form "x-y" where x is skipped articles, y is limit (1-based)
	 * 
	 * @return Similar articles or "validation" error or "idNotFound" error.
	 */
	@RequestMapping(value = "/getArticles/similar", method = RequestMethod.GET)
	@ResponseBody
	public ArticleResult similar(
			@RequestParam(value = "id", required = true) String id,
			@RequestParam(value = "range", required = false) String range
			) {
		try {
			System.out.println("------------------------------------- getSimilar Request START");
			// TODO check if article for this id exists or catch exception or something
			// and return "idNotFound" if no article exists
			final ArticleId articleId = new ArticleId(id);
			final Pair<Integer, Integer> rangeParsed = parseRange(range);
			final List<Article> articles =
					articleProvider.getSimilar(articleId, rangeParsed.a, rangeParsed.b);
			System.out.println("------------------------------------- getSimilar Request END");
			return new ArticleResult(articles);
		} catch(final ValidationException e) {
			return new ArticleResult("validation", e.getMessage());
		}
	}
	
	/**
	 * 
	 * @param query - search string
	 * @param range - range in form "x-y" where x is skipped articles, y is limit (1-based)
	 * @param topics - allowed topics if any, otherwise all topics are allowed
	 * @param sources - allowed sources if any, otherwise all sources are allowed
	 * @param from - limit old article dates if exists, otherwise no limit towards the past
	 * @param to - limit new article dates if exists, otherwise no limit towards current day
	 * 
	 * @return Subset of matching articles according to range & filters or "validation" error.
	 */
	@RequestMapping(value = "/getArticles/search", method = RequestMethod.GET)
	@ResponseBody
	public ArticleResult search(
			@RequestParam(value = "query", required = true) String query,
			@RequestParam(value = "range", required = false) String range,
			@RequestParam(value = "topics", required = false) String topics,
			@RequestParam(value = "sources", required = false) String sources,
			@RequestParam(value = "from", required = false) String from,
			@RequestParam(value = "to", required = false) String to
			) {
		try {
			System.out.println();
			System.out.println("------------------------------------- getArticles Request START");
			System.out.println("Controller query from user: " + "query");
			final Pair<Integer, Integer> rangeParsed = parseRange(range);
			final String[] topicsParsed = parseStringList(topics);
			final String[] sourcesParsed = parseStringList(sources);
			System.out.println("Controller topicsFilter from user: " + Arrays.toString(topicsParsed));
			System.out.println("Controller sourcesFilter from user: " + Arrays.toString(sourcesParsed));
			final OffsetDateTime fromParsed = parseDate(from);
			final OffsetDateTime toParsed = parseDate(to).plusDays(1);
			
			final FilterSettings filters =
					new FilterSettings(topicsParsed, sourcesParsed, fromParsed, toParsed);
			final List<Article> articles =
					articleProvider.getByQuery(query, rangeParsed.a, rangeParsed.b, filters);
			System.out.println("------------------------------------- getArticles Request END");
			return new ArticleResult(articles);
		} catch(final ValidationException e) {
			return new ArticleResult("validation", e.getMessage());
		}
	}

	/**
	 * @param date - format: yyyy-mm-dd UTC-Offset
	 */
	private OffsetDateTime parseDate(String date) {
		if (date == null) return null;
		else {
			date += "T00:00:00+01:00";// TODO client should set timezone from browser
            DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
            return OffsetDateTime.parse(date, formatter);
        }
	}
	
	private String[] parseStringList(String strings) {
		if (strings == null) return new String[]{};
		else return strings.split(";");
	}
	
	private Pair<Integer,Integer> parseRange(String range) {
		final int skip, limit;
		if(range == null || range == "") {
			skip = 0;
			limit = 10;
		} else {
			try {
				final int seperatorCount = StringUtils.countMatches(range, '-');
				if (seperatorCount == 0) {
					skip = 0;
					limit = Integer.parseInt(range);
				}
				else if (seperatorCount == 1) {
					final String[] rangeSplit = range.split("-");
					final String skipString = rangeSplit[0];
					skip = skipString == "" ? 0 : Integer.parseInt(skipString);
					limit = Integer.parseInt(rangeSplit[1]);
				}
				else throw new ValidationException("Range must have format 'x-y' or '-y' or 'y'");
			} catch(PatternSyntaxException | NumberFormatException e) {
				throw new ValidationException("Range must have format 'x-y' or '-y' or 'y'");
			}
		}
		return new Pair<Integer, Integer>(skip, limit);
	}
	
	private static class ValidationException extends RuntimeException {
		private static final long serialVersionUID = 6014557233308178662L;
		public ValidationException(String message) {
			super(message);
		}
	}
	
	protected static class ArticleResult {
		public final String errorMessage;
		public final List<Article> articles;
		public ArticleResult(String error, String errorMessage) {
			this.errorMessage = errorMessage;
			this.articles = null;
		}
		public ArticleResult(List<Article> articles) {
			this.articles = articles;
			this.errorMessage = null;
		}
	}
	
	public static class Pair<A,B> {
		public final A a;
		public final B b;
		public Pair(A a, B b) { 
		    this.a = a; 
		    this.b = b; 
		}
	}
}
