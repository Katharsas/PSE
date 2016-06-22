package cwa.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
@Qualifier("mock")
public class MockedMetaDataProvider implements MetaDataProvider {

	@Override
	public List<String> getSources() {
		return Arrays.asList(new String[]{"www.faz.net", "www.spiegel.de"});
	}

	@Override
	public List<String> getTopics() {
		return Arrays.asList(new String[]{"Politik", "Sport"});
	}
	
}
