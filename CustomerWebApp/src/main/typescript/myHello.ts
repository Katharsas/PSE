import {Ajax} from "./Ajax";
import {FilterOptions} from "./FilterOptions";

class ArticleResult {
	errorMessage: string;
	articles: any[]; // TODO define Article when Article server class is stable
}

$(document).ready(function() {

	// search for articles with query "Suchwort"
	Ajax.getByQuery("Suchwort", new FilterOptions(), 0, 10)
		.done(function(result: ArticleResult) {
			if (result.errorMessage !== null) {
				console.log(result.errorMessage);
			} else {
				console.log("Articles received:");
				for (let article of result.articles) {
					console.log(article);
				}
			}
		})
		.fail(function() {
			console.log("Sending request failed!");
		});
});
