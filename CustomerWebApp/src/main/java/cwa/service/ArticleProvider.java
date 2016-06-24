package cwa.service;

import java.time.OffsetDateTime;
import java.util.List;

import cwa.controller.FilterSettings;
import shared.Article;
import shared.ArticleId;

public interface ArticleProvider {
	
	/**
	 * Searches for articles matching a given search query and satisfying filters.
	 * @return A list of articles ordered from beginning to end: relevant -> less relevant.
	 * 		The list will be of length (limit - skip).
	 *
	 * @param query - A string containing any number of terms that will be used to find articles
	 * 		with as many of those terms as possible.
	 * @param skip - Result will not include that many of the most relevant articles.
	 * @param limit - Result will only include up to the n-th relevant article, n being limit.
	 * @param filters - see {@link FilterSettings#FilterSettings(String[], String[], OffsetDateTime, OffsetDateTime)} 
	 */
	public List<Article> getByQuery(String query, int skip, int limit, FilterSettings filters);
	
	/**
	 * Searches for articles similar to a given article.
	 * @return A list of articles ordered from beginning to end: similar -> less similar.
	 * 
	 * @param articleId - Id of the article that resulting articles will be similar to.
	 * @param skip - Result will not include that many of the most similar articles.
	 * @param limit - Result will only include up to the n-th similar article, n being limit.
	 * 
	 * @throws IllegalArgumentException If the given articleId does not exist in database.
	 */
	public List<Article> getSimilar(ArticleId articleId, int skip, int limit);
}
