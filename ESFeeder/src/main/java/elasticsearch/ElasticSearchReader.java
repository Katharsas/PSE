package elasticsearch;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.search.SearchHit;

import esfeeder.Article;
import esfeeder.ArticleId;
import shared.metadata.MetaDataSerializer;
import shared.metadata.MetaDataType;

/**
 *
 * @author akolb
 * @author jmothes
 */

public class ElasticSearchReader extends ElasticSearchController
		implements MetaDataProvider {

	private SearchResponse currentSearchResponse;

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

	/*
	 * returns an object from the ES db
	 * needs the ID of the object
	 * is this method even needed?
	 */
	public void getById( ArticleId id ){

        // renamed id, to id_str because, ArticleId id already uses variable "id"
		String id_str = id.getId();

		//executes and gets the response
		GetResponse getResponse = client.prepareGet(searchIndex, indexType, id_str).get();
		String title = (String) getResponse.getSource().get(obj_title);
		String pubDate = (String) getResponse.getSource().get(obj_pubDate);
		String content = (String) getResponse.getSource().get(obj_content);
		String author = (String) getResponse.getSource().get(obj_author);


	}

	/*
	 * returns a list of objects from the db
	 * needs the name and type of the created index
	 * needs a string from one of the analyzed properties (fields) as searchquery
	 * needs an integer or date object from one of the properties (fields) as range
	 */
	public void getByQuery(){}

	
	/**
	 * Searches for similair Articles
	 * returns a List with 10 articles
	 */
	public List<Article> getSimilair(Article article){
	
		String content = article.getExtractedText();
		List<Article> resultList = new ArrayList<Article>(); //TODO welche Art von Liste?
		
		//Only the contents are compared
//		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).likeText(content); //deprecated
//		MoreLikeThisQueryBuilder queryBuilder = moreLikeThisQuery(obj_content).like(content);

		//Execute and get a response
//		currentSearchResponse = client.prepareSearch(indexName)
//                .setTypes(indexType)
//                .setSearchType(SearchType.QUERY_AND_FETCH) //arbitrary choice, see http://javadoc.kyubu.de/elasticsearch/v2.2.0/org/elasticsearch/action/search/SearchType.html
//                .setQuery(queryBuilder)
//                //.setFrom(0) //0 is default
//                //.setSize(10) //10 is default; either it returns 10 items per hitlist or 10 in total; NEEDS TO BE TESTED
//                .get();

        for (SearchHit hit : currentSearchResponse.getHits().hits()) {
        		
//                  resultList.add(
//                      new Article()
//                      .setArticleId(new ArticleId().setId(hit.getId()))
//                      .setTitle(hit.getSource().get(obj_title))
//                      .setPubDate(hit.getSource().get(obj_pubDate))
//                      .setExtractedText(hit.getSource().get(obj_ExtractedText))
//                      .setAuthor(hit.getSource().get(obj_source))
//                      .setTopic(hit.getSource().get(obj_topic))
//                      .setUrl(hit.getSource().get(obj_url))
//                  );
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