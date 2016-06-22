package cwa.service;

import java.time.LocalDate;
import java.util.List;

import shared.Article;
import shared.ArticleId;

public interface ArticleProvider {
	
	public List<Article> getByQuery(String query, int skip, int limit, String[] topics, String[] sources, LocalDate from, LocalDate to);
	public List<Article> getSimilar(ArticleId articleId, int skip, int limit);
}
