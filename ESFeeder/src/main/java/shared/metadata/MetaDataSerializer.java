package shared.metadata;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.UncheckedIOException;
import java.util.Base64;
import java.util.Set;

/**
 * 
 * @author jmothes
 */
public class MetaDataSerializer {

	public static interface ElasticSearchMetaDataReader {
		/**
		 * Get meta-data of given type from index.
		 */
		public String getMetaDataFromIndex(MetaDataType type);
	}
	
	public interface ElasticSearchMetaDataWriter {
		/**
		 * Overwrites meta-data in ElasticSearch for given FilterType.
		 */
		public void writeMetaDataToIndex(String encoded, MetaDataType type);
	}
	
    public static void serializeSet(Set<?> anySet, MetaDataType filterType, ElasticSearchMetaDataWriter es) {
    	ByteArrayOutputStream baos;
        try (ObjectOutputStream oos = new ObjectOutputStream(baos = new ByteArrayOutputStream())) {
            oos.writeObject(anySet);
            final String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
            es.writeMetaDataToIndex(base64, filterType);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static <T> Set<T> deserializeSet(MetaDataType filterType, ElasticSearchMetaDataReader es) {
        byte[] base64 = Base64.getDecoder().decode(es.getMetaDataFromIndex(filterType));
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(base64))) {
            @SuppressWarnings("unchecked")
            Set<T> anySet = (Set<T>) ois.readObject();
            return anySet;
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Could not convert serialized object to Set!", e);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}