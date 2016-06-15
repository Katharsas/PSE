export class FilterOptions {

	topics: string[] = null;
	sources: string[] = null;

	fromDate: string = null;
	toDate: string = null;

	/**
	 * Convert filter options to url parameter string of format
	 * "param1=value1&param2=value2&param4=value3" for use as url parameters.
	 */
	toUrlParam(): string {
		let params: string[] = [];

		if (this.topics !== null) params.push("topics=" + this.concatMultiParam(this.topics));
		if (this.sources !== null) params.push("sources=" + this.concatMultiParam(this.sources));
		if (this.fromDate) params.push("from=" + this.fromDate);
		if (this.toDate) params.push("to=" + this.toDate);

		return params.join("&");
	}

	private concatMultiParam(array: string[]): string {
		return array.join(";");
	}
}
