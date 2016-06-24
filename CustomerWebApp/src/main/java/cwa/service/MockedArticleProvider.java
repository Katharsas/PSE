package cwa.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import cwa.controller.FilterSettings;
import shared.Article;
import shared.ArticleId;

@Service
@Qualifier("mock")
public class MockedArticleProvider implements ArticleProvider {

	@Override
	public ArrayList<Article> getByQuery(String query, int skip, int limit, FilterSettings filters) {
		final Article testArticle = new Article("testId");
		testArticle.setAuthor("testAuthor");
		testArticle.setExtractedText("testExtractedText");
		testArticle.setSource("www.testSource.net");
		testArticle.setPubDate("2015-03-02");
		testArticle.setTitle("testTitle");
		testArticle.setTopic("testTopic");
		testArticle.setUrl("www.testSource.net/testArticle");
		final ArrayList<Article> result = new ArrayList<>();
		result.add(testArticle);
		return result;
	}

	@Override
	public ArrayList<Article> getSimilar(ArticleId articleId, int skip, int limit) {
		return new ArrayList<>();
	}

}
