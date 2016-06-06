package cwa;

import java.util.Collection;

public interface MetaDataProvider {
	public Collection<String> getSources();
	public Collection<String> getTopics();
}
