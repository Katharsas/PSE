package cwa.service;

import java.time.LocalDate;
import java.util.ArrayList;

import shared.Article;
import shared.ArticleId;

public interface ArticleProvider {
	
	public ArrayList<Article> getByQuery(String query, int skip, int limit, String[] topics, String[] sources, LocalDate from, LocalDate to);
	public ArrayList<Article> getSimilar(ArticleId articleId, int skip, int limit);
}
