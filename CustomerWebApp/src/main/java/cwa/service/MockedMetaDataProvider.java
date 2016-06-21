package cwa.service;

import java.util.Arrays;
import java.util.Collection;

import org.springframework.stereotype.Service;

@Service
public class MockedMetaDataProvider implements MetaDataProvider {

	@Override
	public Collection<String> getSources() {
		return Arrays.asList(new String[]{"www.faz.net", "www.spiegel.de"});
	}

	@Override
	public Collection<String> getTopics() {
		return Arrays.asList(new String[]{"Politik", "Sport"});
	}
	
}
