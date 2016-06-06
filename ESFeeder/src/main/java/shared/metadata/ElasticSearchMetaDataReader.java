package shared.metadata;

/**
 * 
 * @author Jan Mothes
 */
public interface ElasticSearchMetaDataReader {
	public String getMetaDataFromIndex(MetaDataType filterTypes);
}
