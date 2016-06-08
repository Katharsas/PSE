package cwa.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.regex.PatternSyntaxException;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.common.inject.Inject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cwa.service.ArticleProvider;
import shared.Article;

@Controller
public class SearchController {
	
	private final ArticleProvider articleProvider;
	
	@Inject
	public SearchController(ArticleProvider articleProvider) {
		this.articleProvider = articleProvider;
	}
	
	@RequestMapping(value = "/search", method = RequestMethod.GET)
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
			final Pair<Integer, Integer> rangeParsed = parseRange(range);
			final String[] topicsParsed = parseStringList(topics);
			final String[] sourceParsed = parseStringList(sources);
			final LocalDate fromParsed = parseDate(from);
			final LocalDate toParsed = parseDate(to);
			ArrayList<Article> articles = articleProvider.getByQuery(query,
					rangeParsed.a, rangeParsed.b, topicsParsed, sourceParsed, fromParsed, toParsed);
			return new ArticleResult(articles);
		} catch(ValidationException e) {
			return new ArticleResult(e.getMessage());
		}
	}

	/**
	 * @param date - format: yyyy-mm-dd UTC-Offset
	 */
	private LocalDate parseDate(String date) {
		if (date == null) return null;
		else return LocalDate.parse(date, DateTimeFormatter.ISO_OFFSET_DATE);
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
				int seperatorCount = StringUtils.countMatches(range, '-');
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
		public final ArrayList<Article> articles;
		public ArticleResult(String errorMessage) {
			this.errorMessage = errorMessage;
			this.articles = null;
		}
		public ArticleResult(ArrayList<Article> articles) {
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
