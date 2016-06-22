package cwa.service;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;
import static org.elasticsearch.index.query.QueryBuilders.rangeQuery;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Objects;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

//import shared.ElasticSearchController;
import shared.Article;
import shared.ArticleId;
import shared.ElasticSearchController;
import shared.metadata.MetaDataType;

/**
 *
 * @author akolb
 * @author jmothes
 */
@Service
@Order(3)
public class ElasticSearchReader extends ElasticSearchController
        implements MetaDataProvider, ArticleProvider {

    /**
     * Can only be created after the writer was started once! Throws an exception otherwise
     */
    public ElasticSearchReader() throws IndexNotFoundException {

        super();

        //checks if the index is in the db
        boolean searchIndex_exists = client.admin().indices().prepareExists(searchIndex).get().isExists();
        if (!searchIndex_exists) {
            throw new IndexNotFoundException(searchIndex);
        } else {
            //Everything is good
        }
    }

    /**
     * @return an Article from the ES db needs the ID of the object
     */
    private Article getById(ArticleId id) {

        // renamed id, to id_str because, ArticleId id already uses variable "id"
		String id_str = id.getId();
		// TODO isExists check id existing
		//executes and gets the response
		GetResponse getResponse = client.prepareGet(searchIndex, indexType, id_str).get();
		String title = (String) getResponse.getSource().get(obj_title);
		String pubDate = (String) getResponse.getSource().get(obj_pubDate);
		String content = (String) getResponse.getSource().get(obj_content);
		String author = (String) getResponse.getSource().get(obj_author);
		String source = (String) getResponse.getSource().get(obj_source);
		String topic = (String) getResponse.getSource().get(obj_topic);
		String url = (String) getResponse.getSource().get(obj_url);

		return new Article(id.getId())
                      .setTitle(title)
                      .setPubDate(pubDate)
                      .setExtractedText(content)
                      .setAuthor(source)
                      .setTopic(topic)
                      .setUrl(url);

	}

	/**
	 * @return a resultlist for the respective query
	 *
	 */
	private ArrayList<Article> getResults(String searchIndex, String indexType, long time, QueryBuilder queryBuilder, int skip, int limit){

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

		int listLength = searchHits.totalHits() > (limit-skip) ? limit-skip : (int) searchHits.totalHits();//TODO: .totalHits() might return the amount of elements in current SearchHits (which shouldn't be the case), not the total amount of found articles. CRITICAL! Needs to be testet
		ArrayList<Article> resultList = new ArrayList<Article>(listLength); //relustList has either the size of the requestet amount of articles or less if ES returns less resluts

		//ES returns max. 10 hits per List, we can't change that
		while( searchHits.hits().length != 0 ){ //breaks if the list is empty
            for (SearchHit hit : searchHits.hits()){

                      resultList.add(
                          new Article(hit.getId())
                          .setTitle((String) hit.getSource().get(obj_title))
                          .setPubDate((String) hit.getSource().get(obj_pubDate))
                          .setExtractedText((String) hit.getSource().get(obj_content))
                          .setAuthor((String) hit.getSource().get(obj_source))
                          .setTopic((String) hit.getSource().get(obj_topic))
                          .setUrl((String) hit.getSource().get(obj_url))
                          .setAuthor((String) hit.getSource().get(obj_author))
                      );
            }

            //get me the next hits. ES knows which articles are already delivered by using the Search-ID
           searchResponse = client.prepareSearchScroll(searchResponse.getScrollId()).setScroll(new TimeValue(time)).get();
           searchHits = searchResponse.getHits();
        }

        // if ES didn't find any articles resultsList should be empty + the size should be zero
        return resultList;


	}

	/**
	 * @return a list with Article from the db
	 *
	 * @param topics - is a list with checked topics, can be empty
	 * @param sources - is a list with checked sources, can be empty
	 * @param skip - don't give me the first <skip> results
	 * @param limit - give me max. <limit> article
	 * @params from - give me only article that are newer then <from>, can be null -> no restrictions to the past
	 * @params to - give me only articles that are older then <to>, can be null -> <to> == today
	 */
	@Override
	public ArrayList<Article> getByQuery(String query, int skip, int limit, String[] topics, String[] sources, LocalDate from, LocalDate to){

		//check if null
		Objects.requireNonNull(topics);
		Objects.requireNonNull(sources);
		Objects.requireNonNull(query);

		BoolQueryBuilder boolQueryBuilder = boolQuery();

		//add query for getting articles that have simlair content
		//default value is 30% smilarity, see "minimum_should_match" in https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html#_parameters_8
		MoreLikeThisQueryBuilder moreLikeThisQueryBuilder = moreLikeThisQuery(obj_content).likeText(query); //deprecated
//		MoreLikeThisQueryBuilder moreLikeThisQueryBuilder = moreLikeThisQuery(obj_content).like(content);
		boolQueryBuilder.must(moreLikeThisQueryBuilder);

		//add queries for getting articles that only have one of the listed topics
		for(String topic : topics){
        	boolQueryBuilder.must(
            	boolQuery().should(
                	matchQuery(obj_topic, topic)
                )
            );
        }

        //add queries for getting articles that only have one of the listed sources
		for(String source : sources){
			boolQueryBuilder.must(
		    	boolQuery().should(
                	matchQuery(obj_source, source)
                	)
            );
		}

		//add query for getting articles with a puDate greater-euqals then from
		boolQueryBuilder.must(
			rangeQuery(obj_pubDate).gte(from)
		);

		//add query for getting articles with a puDate lesser-equals then to
		boolQueryBuilder.must(
			rangeQuery(obj_pubDate).lte(to)
		);

		//execute the search with the query and return an arraylist with reults
		return this.getResults(searchIndex, indexType, 60000, boolQueryBuilder, skip, limit);
	}


	/**
	 * TODO throw NullPointerException oder IllegalArgumentException fuer articleId nicht existent
	 *
	 * Searches for similair Articles
	 * @return a List with articles
	 * @param skip - don't give me the first <skip> results
	 * @param limit - give me max. <limit> article
	 */
	@Override
	public ArrayList<Article> getSimilar(ArticleId articleId, int skip, int limit){

		//Article aus ArticleId lesen
		Article article = this.getById(articleId);
		String content = article.getExtractedText();

		//Only the contents are compared
		//default value is 30% smilarity, see "minimum_should_match" in https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html#_parameters_8
		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).likeText(content); //deprecated
//		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).like(content);

		//execute the search with the query and return an arraylist with reults
		return this.getResults(searchIndex, indexType, 60000, queryBuilder, skip, limit);
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