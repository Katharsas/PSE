package cwa.service;

import java.util.Collection;

/**
 * 
 * @author jmothes
 */
public interface MetaDataProvider {
	public Collection<String> getSources();
	public Collection<String> getTopics();
}
