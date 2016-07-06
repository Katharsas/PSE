/* 
 *@auhor jmothes
 */

// util function for clean 
function pad(n: string, width: number) {
    //var z = z || '0';
    var z = '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
     
// __filter__ from=1980-01-01&to=2020-01-01
// __filter__ from=2015-8-7&to=2016-6-3
function clean(date: string) {
    var parts = date.split("-");
    parts[0] = pad(parts[0], 4);
    parts[1] = pad(parts[1], 2);
    parts[2] = pad(parts[2], 2);
    //return "1980-01-01";
    return parts.join("-");
}

export class FilterOptions {

    topics: string[] = [];
    sources: string[] = [];

    fromDate: string = "1980-01-01";
    toDate: string = "2020-01-01";
    

	/**
	 * Convert filter options to url parameter string of format
	 * "param1=value1&param2=value2&param4=value3" for use as url parameters.
	 */
    toUrlParam(): string {
        let params: string[] = [];

        if (this.topics.length !== 0) params.push("topics=" + this.concatMultiParam(this.topics));
        if (this.sources.length !== 0) params.push("sources=" + this.concatMultiParam(this.sources));
        if (this.fromDate !== null) {
            this.fromDate = clean(this.fromDate);
            //params.push("from=" + this.fromDate);
        }
        if (this.toDate !== null) {
            this.toDate = clean(this.toDate);
            //params.push("to=" + this.toDate);
        }
        //TODO activate date when date is working
		
        return params.join("&");
    }

    private concatMultiParam(array: string[]): string {
        return array.join(";");
    }
}
