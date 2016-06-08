package cwa.service;

import java.util.ArrayList;

import shared.Article;
import shared.ArticleId;

public interface ArticleProvider {
	public ArrayList<Article> getByQuery(String query, String[] topics, String[] sources, int amount);
	public ArrayList<Article> getSimilar(ArticleId articleId, int amount);
}
