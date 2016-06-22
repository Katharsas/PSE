import {FilterOptions} from "./FilterOptions";

declare var contextUrl: string;

export module Ajax {
    //var contextUrl = "http://localhost:8080/CWA/";
	const urlBase: string = contextUrl + "getArticles/search";
	const urlBase_metadata: string = contextUrl + "getMetadata";
	const headers = { accept: "application/json,*/*;q=0.8" };

	export function getByQuery(query: String, filters: FilterOptions, skip: number, limit: number): JQueryXHR {
		let params: string[] = [];
		params.push("query=" + query);

		let filterParams: string = filters.toUrlParam();
        console.log("__filter__",filterParams);
		if (filterParams !== "") params.push(filterParams);

		params.push("range=" + skip + "-" + limit);

		let url: string = urlBase + "?" + params.join("&");
		// TODO make xhr request, return jqXHR
		
		let settings = {
			url: url,
			headers: headers,
			processData: false,
			contentType: false,
			type: "GET"
		};
		return $.ajax(settings);
	}
    
    export function getMetadata(): JQueryXHR {
		let url: string = urlBase_metadata ;
		// TODO make xhr request, return jqXHR
		
		let settings = {
			url: url,
			headers: headers,
			processData: false,
			contentType: false,
			type: "GET"
		};
		return $.ajax(settings);
	}


	export function getBySimilar(articleId: String, skip: number, limit: number): JQueryXHR {
		// TODO
		return null;
	}
}