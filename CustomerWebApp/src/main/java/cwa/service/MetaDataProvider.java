package cwa.service;

import java.util.List;

/**
 * Provides metadata for frontend filters.
 * @author jmothes
 */
public interface MetaDataProvider {
	public List<String> getSources();
	public List<String> getTopics();
}
