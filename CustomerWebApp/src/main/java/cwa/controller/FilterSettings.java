package cwa.controller;

import java.time.OffsetDateTime;
import java.util.Objects;

/**
 * Filter parameter DAO for keyword/query search.
 * @author Jan Mothes
 */
public class FilterSettings {
	
	public final String[] topics;
	public final String[] sources;
	public final OffsetDateTime from;
	public final OffsetDateTime to;
	
	/**
	 * @param topics - If empty, any topic will be matched, if not empty, one of the given topics
	 * 		must match.
	 * @param sources - If empty, any source will be matched, if not empty, one of the given sources
	 * 		must match.
	 * @param from - Older articles than this date will not be matched. If null, no limit towards
	 * 		the past.
	 * @param to - Articles later than this date will not be machted. If null, no limit towards
	 * 		present.
	 */
	public FilterSettings(String[] topics, String[] sources, OffsetDateTime from, OffsetDateTime to) {
		Objects.requireNonNull(topics);
		this.topics = topics;
		Objects.requireNonNull(sources);
		this.sources = sources;
		
		this.from = from;
		this.to = to;
	}
}
