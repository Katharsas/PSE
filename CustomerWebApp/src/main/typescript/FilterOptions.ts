    /* 
     *@auhor jmothes
     */

export class FilterOptions {

	topics: string[] = [];
	sources: string[] = [];
    
    fromDate: string = "1980-01-01";
	toDate: string = "2020-01-01"; // bug , better defaults ? 
    

	/**
	 * Convert filter options to url parameter string of format
	 * "param1=value1&param2=value2&param4=value3" for use as url parameters.
	 */
	toUrlParam(): string {
		let params: string[] = [];

		if (this.topics.length !== 0) params.push("topics=" + this.concatMultiParam(this.topics));
		if (this.sources.length !== 0) params.push("sources=" + this.concatMultiParam(this.sources));
		if (this.fromDate !== null) params.push("from=" + this.fromDate);
		if (this.toDate !== null) params.push("to=" + this.toDate);

		return params.join("&");
	}

	private concatMultiParam(array: string[]): string {
		return array.join(";");
	}
}
