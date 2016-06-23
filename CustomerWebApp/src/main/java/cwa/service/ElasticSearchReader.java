package cwa.service;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;

import java.time.LocalDate;
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
@Qualifier("prod")
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
    private Article getById(ArticleId id) {
		final String id_str = id.getId();
		
		// TODO isExists check id existing
		
		GetResponse getResponse = client.prepareGet(searchIndex, indexType, id_str).get();
		return createArticleFromSource(getResponse.getSource(), id_str);
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
                resultList.add(createArticleFromSource(hit.getSource(), hit.getId()));
            }

            //get me the next hits. ES knows which articles are already delivered by using the Search-ID
           searchResponse = client.prepareSearchScroll(searchResponse.getScrollId()).setScroll(new TimeValue(time)).get();
           searchHits = searchResponse.getHits();
        }

        // if ES didn't find any articles resultsList should be empty + the size should be zero
        return resultList;
	}
	
	@Override
	public ArrayList<Article> getByQuery(String query, int skip, int limit, String[] topics, String[] sources, LocalDate from, LocalDate to){
		
		QueryBuilder qb = QueryBuilders
				.multiMatchQuery(query, obj_title, obj_content, obj_author)
				.fuzziness(1); // TODO maybe use "AUTO" ?
		
		SearchResponse scrollResp = client.prepareSearch(searchIndex)
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                .setScroll(new TimeValue(60000))
                .setQuery(qb)
                .setFrom(0)
                .setSize(100)
                .execute()
                .actionGet();
		
		ArrayList<Article> resultList = new ArrayList<Article>();
		System.out.println("Querying ElasticSearch...");
		while (true) {
			for (SearchHit hit : scrollResp.getHits().getHits()) {
				System.out.println("Hit: ");
				System.out.println("  ->  " + hit.getSource().get(obj_title));
				
				resultList.add(createArticleFromSource(hit.getSource(), hit.getId()));
			}
			scrollResp = client.prepareSearchScroll(scrollResp.getScrollId()).setScroll(new TimeValue(60000)).execute()
					.actionGet();
			// Break condition: No hits are returned
			if (scrollResp.getHits().getHits().length == 0) {
				break;
			}
		}
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
//	@Override
	public ArrayList<Article> getByQueryOld(String query, int skip, int limit, String[] topics, String[] sources, LocalDate from, LocalDate to){

		//check if null
		Objects.requireNonNull(topics);
		Objects.requireNonNull(sources);
		Objects.requireNonNull(query);

		BoolQueryBuilder boolQueryBuilder = boolQuery();

		//add query for getting articles that have simlair content
		//default value is 30% smilarity, see "minimum_should_match" in https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html#_parameters_8
//		MoreLikeThisQueryBuilder moreLikeThisQueryBuilder = moreLikeThisQuery(obj_content).likeText(query); //deprecated
		MoreLikeThisQueryBuilder moreLikeThisQueryBuilder = moreLikeThisQuery(obj_content).like(query);
		boolQueryBuilder.must(moreLikeThisQueryBuilder);

		//add queries for getting articles that only have one of the listed topics
//		for(String topic : topics){
//        	boolQueryBuilder.must(
//            	boolQuery().should(
//                	matchQuery(obj_topic, topic)
//                )
//            );
//        }

        //add queries for getting articles that only have one of the listed sources
//		for(String source : sources){
//			boolQueryBuilder.must(
//		    	boolQuery().should(
//                	matchQuery(obj_source, source)
//                	)
//            );
//		}

		//add query for getting articles with a puDate greater-euqals then from
//		boolQueryBuilder.must(
//			rangeQuery(obj_pubDate).gte(from)
//		);

		//add query for getting articles with a puDate lesser-equals then to
//		boolQueryBuilder.must(
//			rangeQuery(obj_pubDate).lte(to)
//		);

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