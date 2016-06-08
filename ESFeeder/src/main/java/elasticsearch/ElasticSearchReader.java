package elasticsearch;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.time.LocalDate;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import static org.elasticsearch.index.query.QueryBuilders.moreLikeThisQuery;
import org.elasticsearch.action.search.SearchType;

import shared.Article;
import shared.ArticleId;
import shared.metadata.MetaDataSerializer;
import shared.metadata.MetaDataType;

/**
 *
 * @author akolb
 * @author jmothes
 */

public class ElasticSearchReader extends ElasticSearchController
		implements MetaDataProvider {

	/**
	 * Can only be created after the writer was started once!
	 * Throws an exception otherwise
	 */
	public ElasticSearchReader() throws IndexNotFoundException{

		super();

		//checks if the index is in the db
		boolean searchIndex_exists =  client.admin().indices().prepareExists(searchIndex).get().isExists();
		if( !searchIndex_exists ){
			throw new IndexNotFoundException(searchIndex);
		}else{
			//Everything is good
		}
	}

	/**
	 * @return an Article from the ES db
	 * needs the ID of the object
	 */
	private Article getById(ArticleId id){

        // renamed id, to id_str because, ArticleId id already uses variable "id"
		String id_str = id.getId();

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
	 * @return a list with Article from the db
	 * needs the name and type of the created index
	 * needs a string from one of the analyzed properties (fields) as searchquery
	 * needs an integer or date object from one of the properties (fields) as range
	 *
	 * @param topics - is a list with checked topics, can be empty
	 * @param sources - is a list with checked sources, can be empty
	 * @param skip - don't give me the first <skip> results
	 * @param limit - give me max. <limit> article
	 * @params from - give me only article that are newer then <from>, can be null -> no restrictions to the past
	 * @params to - give me only articles that are older then <to>, can be null -> <to> == today
	 */
	public void getByQuery(String query, int skip, int limit, String[] topics, String[] sources, LocalDate from, LocalDate to){
	
		
	
	}


	/**
	 * Searches for similair Articles
	 * @return a List with articles
	 * @param skip - don't give me the first <skip> results
	 * @param limit - give me max. <limit> article
	 */
	public ArrayList<Article> getSimilair(ArticleId articleId, int skip, int limit){
	
		//Article aus ArticleId lesen
		Article article = this.getById(articleId);
		String content = article.getExtractedText();
		ArrayList<Article> resultList; //vll später kreieren mit der größe der Hitlist

		//Only the contents are compared
		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).likeText(content); //deprecated
//		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).like(content);

		//Execute and get a response
		SearchResponse currentSearchResponse = client.prepareSearch(searchIndex)
                .setTypes(indexType)
                .setSearchType(SearchType.QUERY_AND_FETCH) //arbitrary choice, see http://javadoc.kyubu.de/elasticsearch/v2.2.0/org/elasticsearch/action/search/SearchType.html
                .setQuery(queryBuilder)
                .setFrom(skip) //0 is default
                .setSize(limit) //10 is default; either it returns 10 items per hitlist or 10 in total; TODO: NEEDS TO BE TESTED
                .get();
		
		//
		SearchHits searchHits = currentSearchResponse.getHits();
		
		int listLength = searchHits.totalHits() > (limit-skip) ? limit-skip : (int) searchHits.totalHits();
		resultList = new ArrayList<Article>(listLength);
		
        for (SearchHit hit : searchHits.hits()) {

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

        return resultList;

	}

	@Override
	public Collection<String> getSources() {
		return MetaDataSerializer.deserializeSet(MetaDataType.SOURCE, this);
	}

	@Override
	public Collection<String> getTopics() {
		return MetaDataSerializer.deserializeSet(MetaDataType.TOPIC, this);
	}

}