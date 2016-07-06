package cwa.service;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;

import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import cwa.controller.FilterSettings;
//import shared.ElasticSearchController;
import shared.Article;
import shared.ArticleId;
import shared.ElasticSearchController;
import shared.metadata.MetaDataType;

/**
 * Provides methods to search for articles and to get metadata from ESServer.
 *
 * @author akolb
 * @author jmothes
 */
@Service
@Qualifier("prod")
public class ElasticSearchReader extends ElasticSearchController
        implements MetaDataProvider, ArticleProvider {

	/**
	 * How many wrong letters is a search query allowed to have for a match ?
	 * Increasing this will exponentially explode the matching effort and thus decrease performance!
	 * Can be set to "AUTO" (see ElasticSearch documentation on "funzziness")
	 */
	private final Object allowedUserTypingErrors = 1;

	/**
     * Can only be created after the writer was started once! Throws an exception otherwise
     */
    public ElasticSearchReader() throws IndexNotFoundException {
        super();
        if (!doesSearchIndexExist()) {
            throw new IndexNotFoundException(searchIndex);
        }
    }

    private boolean doesSearchIndexExist() {
    	return client.admin().indices().prepareExists(searchIndex).get().isExists();
    }

    private Article createArticleFromSource(Map<String, Object> source, String id) {
    	return new Article(id)
            .setTitle((String) source.get(obj_title))
            .setPubDate((String) source.get(obj_content))
            .setExtractedText((String) source.get(obj_content))
            .setAuthor((String) source.get(obj_author))
            .setTopic((String) source.get(obj_topic))
            .setSource((String) source.get(obj_source))
            .setUrl((String) source.get(obj_url));
    }

    /**
     * @return an Article from the ES db needs the ID of the object
     */
    private Article getById(ArticleId id)throws IllegalArgumentException{
		final String id_str = id.getId();

		GetResponse getResponse = client.prepareGet(searchIndex, indexType, id_str).get();

		// response is empty -> articel with this Id doesn't exists in the db
		//don't know the difference between methods so using both
		if( !getResponse.isExists() || getResponse.isSourceEmpty() ){
			throw new IllegalArgumentException("404: Article with the ID " + id_str + " was not found in the database");
		}

		return createArticleFromSource(getResponse.getSource(), id_str);
	}

	/**
	 * @return a resultlist for the respective query
	 */
	private ArrayList<Article> executeQuery(String searchIndex, String indexType, long time, QueryBuilder queryBuilder, int skip, int limit){

		System.out.println("Querying ElasticSearch...");

		//Execute and get a response
		SearchResponse searchResponse = client.prepareSearch(searchIndex)
			.setTypes(indexType)
            .setSearchType(SearchType.QUERY_AND_FETCH) //arbitrary choice, see http://javadoc.kyubu.de/elasticsearch/v2.2.0/org/elasticsearch/action/search/SearchType.html
            .setScroll(new TimeValue(time)) //ES should remember this SearchRequest for <time> seconds
            .setQuery(queryBuilder)
            .setFrom(skip) //0 is default
            .setSize(limit) //10 is default; either <limit> applies to the hitlist (unlikely) or to the total search; TODO: NEEDS TO BE TESTED
            .get(); //execute and return Response

        SearchHits searchHits = searchResponse.getHits();

        int maxLength = limit - skip;
		int listLength = searchHits.totalHits() > maxLength ?
				maxLength : (int) searchHits.totalHits();
				//TODO: .totalHits() might return the amount of elements in current SearchHits (which shouldn't be the case), not the total amount of found articles. CRITICAL! Needs to be testet

		System.out.println(searchHits.totalHits() + " matching articles exist.");
		System.out.println("Clipping result to " + maxLength + " articles if necessary.");
		ArrayList<Article> resultList = new ArrayList<Article>(listLength); //relustList has either the size of the requested amount of articles or less if ES returns less resluts

		//ES returns max. 10 hits per List, we can't change that
		while( searchHits.hits().length != 0 ){ //breaks if the list is empty
            for (SearchHit hit : searchHits.hits()){
            	Article article = createArticleFromSource(hit.getSource(), hit.getId());
            	System.out.println("Found article title: " + article.getTitle());
                resultList.add(article);
            }

            //get me the next hits. ES knows which articles are already delivered by using the Search-ID
           searchResponse = client.prepareSearchScroll(searchResponse.getScrollId()).setScroll(new TimeValue(time)).get();
           searchHits = searchResponse.getHits();
        }

		System.out.println("Query complete.");
        // if ES didn't find any articles resultsList should be empty + the size should be zero
        return resultList;
	}

	@Override
	public ArrayList<Article> getByQuery(String query, int skip, int limit, FilterSettings filters){
		Objects.requireNonNull(query);
		Objects.requireNonNull(filters);

		BoolQueryBuilder composedQuery = boolQuery();

		//add query for search keywords
		QueryBuilder matchQuery = QueryBuilders
				.multiMatchQuery(query, obj_title, obj_content, obj_author)
				.fuzziness(allowedUserTypingErrors);
		composedQuery.must(matchQuery);

		if(filters.topics.length > 0) {
			// articles must have one of the listed topics
			BoolQueryBuilder filterQuery = boolQuery();
			for(String topic : filters.topics){
				filterQuery.should(QueryBuilders.termQuery(obj_topic, topic));
	        }
			composedQuery.must(filterQuery);
		}
		if(filters.sources.length > 0) {
			//articles must have one of the listed sources
			BoolQueryBuilder innerQuery = boolQuery();
			for(String source : filters.sources){
				innerQuery.should(QueryBuilders.termQuery(obj_source, source));
	        }
			composedQuery.must(innerQuery);
		}

		// articles must have a puDate greater-equals than "from"
		QueryBuilder fromQuery = QueryBuilders.rangeQuery(obj_pubDate).gte(filters.from);
		composedQuery.must(fromQuery);
		// articles must a puDate lesser-equals than "to"
		QueryBuilder toQuery = QueryBuilders.rangeQuery(obj_pubDate).gte(filters.to);
		composedQuery.must(toQuery);

		return this.executeQuery(searchIndex, indexType, 60000, composedQuery, skip, limit);
	}

	/**
	 *
	 * @return a list with Articles that are "similar"
	 * throws the Exception from getById()
	 */

	@Override
	public ArrayList<Article> getSimilar(ArticleId articleId, int skip, int limit)throws IllegalArgumentException{

		//Article aus ArticleId lesen
		Article article = this.getById(articleId);
		String content = article.getExtractedText();

		//Only the contents are compared
		//default value is 30% smilarity, see "minimum_should_match" in https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html#_parameters_8
		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).likeText(content); //deprecated
//		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).like(content);

		//execute the search with the query and return an arraylist with reults
		return this.executeQuery(searchIndex, indexType, 60000, queryBuilder, skip, limit);
    }

    @Override
    public ArrayList<String> getSources() {
        return new ArrayList<String>(this.deserializeSet(MetaDataType.SOURCE));
    }

    @Override
    public ArrayList<String> getTopics() {
        return new ArrayList<String>(this.deserializeSet(MetaDataType.TOPIC));
    }

}