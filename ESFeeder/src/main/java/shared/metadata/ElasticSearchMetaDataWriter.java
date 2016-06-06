package shared.metadata;

public interface ElasticSearchMetaDataWriter {
	
	// TODO delete old, save argument
	// ElasticSearch: "type" : "binary"
	// https://www.elastic.co/guide/en/elasticsearch/reference/current/binary.html
	public void writeMetaDataToIndex(String encoded, MetaDataType filterType);
	    
    
}
