(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Ajax;
(function (Ajax) {
    var contextUrl = "http://localhost:8080/CWA/";
    var urlBase = contextUrl + "getArticles/search";
    var headers = { accept: "application/json,*/*;q=0.8" };
    function getByQuery(query, filters, skip, limit) {
        var params = [];
        params.push("query=" + query);
        var filterParams = filters.toUrlParam();
        console.log("__filter__", filterParams);
        if (filterParams !== "")
            params.push(filterParams);
        params.push("range=" + skip + "-" + limit);
        var url = urlBase + "?" + params.join("&");
        // TODO make xhr request, return jqXHR
        var settings = {
            url: url,
            headers: headers,
            processData: false,
            contentType: false,
            type: "GET"
        };
        return $.ajax(settings);
    }
    Ajax.getByQuery = getByQuery;
    function getBySimilar(articleId, skip, limit) {
        // TODO
        return null;
    }
    Ajax.getBySimilar = getBySimilar;
})(Ajax = exports.Ajax || (exports.Ajax = {}));
},{}],2:[function(require,module,exports){
"use strict";
var FilterOptions = (function () {
    function FilterOptions() {
        this.topics = [];
        this.sources = [];
        this.fromDate = "1980-01-01";
        this.toDate = "2020-01-01"; // bug , better defaults ? 
    }
    /**
     * Convert filter options to url parameter string of format
     * "param1=value1&param2=value2&param4=value3" for use as url parameters.
     */
    FilterOptions.prototype.toUrlParam = function () {
        var params = [];
        if (this.topics.length !== 0)
            params.push("topics=" + this.concatMultiParam(this.topics));
        if (this.sources.length !== 0)
            params.push("sources=" + this.concatMultiParam(this.sources));
        if (this.fromDate !== null)
            params.push("from=" + this.fromDate);
        if (this.toDate !== null)
            params.push("to=" + this.toDate);
        return params.join("&");
    };
    FilterOptions.prototype.concatMultiParam = function (array) {
        return array.join(";");
    };
    return FilterOptions;
}());
exports.FilterOptions = FilterOptions;
},{}],3:[function(require,module,exports){
"use strict";
var Ajax_1 = require("./Ajax");
var FilterOptions_1 = require("./FilterOptions");
var ArticleResult = (function () {
    function ArticleResult() {
    }
    return ArticleResult;
}());
$(document).ready(function () {
    // search for articles with query "Suchwort"
    Ajax_1.Ajax.getByQuery("Suchwort", new FilterOptions_1.FilterOptions(), 0, 10)
        .done(function (result) {
        if (result.errorMessage !== null) {
            console.log(result.errorMessage);
        }
        else {
            console.log("Articles received:");
            for (var _i = 0, _a = result.articles; _i < _a.length; _i++) {
                var article = _a[_i];
                console.log(article);
            }
        }
    })
        .fail(function () {
        console.log("Sending request failed!");
    });
});
},{"./Ajax":1,"./FilterOptions":2}],4:[function(require,module,exports){

},{}]},{},[3,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L215SGVsbG8udHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L3R5cGluZ3MvanF1ZXJ5LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDSUEsSUFBYyxJQUFJLENBZ0NqQjtBQWhDRCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLElBQUksVUFBVSxHQUFHLDRCQUE0QixDQUFDO0lBQ2pELElBQU0sT0FBTyxHQUFXLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUMxRCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25E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QUFNLENBQUMsUUFBUSxFQUFmLGNBQWUsRUFBZixJQUFlLENBQUM7Z0JBQS9CLElBQUksT0FBTyxTQUFBO2dCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDckI7UUFDRixDQUFDO0lBQ0YsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7O0FDekJIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuICAgIHZhciBjb250ZXh0VXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvQ1dBL1wiO1xyXG5cdGNvbnN0IHVybEJhc2U6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NlYXJjaFwiO1xyXG5cdGNvbnN0IGhlYWRlcnMgPSB7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uLCovKjtxPTAuOFwiIH07XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVF1ZXJ5KHF1ZXJ5OiBTdHJpbmcsIGZpbHRlcnM6IEZpbHRlck9wdGlvbnMsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJxdWVyeT1cIiArIHF1ZXJ5KTtcclxuXHJcblx0XHRsZXQgZmlsdGVyUGFyYW1zOiBzdHJpbmcgPSBmaWx0ZXJzLnRvVXJsUGFyYW0oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19cIixmaWx0ZXJQYXJhbXMpO1xyXG5cdFx0aWYgKGZpbHRlclBhcmFtcyAhPT0gXCJcIikgcGFyYW1zLnB1c2goZmlsdGVyUGFyYW1zKTtcclxuXHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2UgKyBcIj9cIiArIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlTaW1pbGFyKGFydGljbGVJZDogU3RyaW5nLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0Ly8gVE9ET1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIEZpbHRlck9wdGlvbnMge1xyXG5cclxuXHR0b3BpY3M6IHN0cmluZ1tdID0gW107XHJcblx0c291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgIFxyXG4gICAgZnJvbURhdGU6IHN0cmluZyA9IFwiMTk4MC0wMS0wMVwiO1xyXG5cdHRvRGF0ZTogc3RyaW5nID0gXCIyMDIwLTAxLTAxXCI7IC8vIGJ1ZyAsIGJldHRlciBkZWZhdWx0cyA/IFxyXG4gICAgXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnQgZmlsdGVyIG9wdGlvbnMgdG8gdXJsIHBhcmFtZXRlciBzdHJpbmcgb2YgZm9ybWF0XHJcblx0ICogXCJwYXJhbTE9dmFsdWUxJnBhcmFtMj12YWx1ZTImcGFyYW00PXZhbHVlM1wiIGZvciB1c2UgYXMgdXJsIHBhcmFtZXRlcnMuXHJcblx0ICovXHJcblx0dG9VcmxQYXJhbSgpOiBzdHJpbmcge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50b3BpY3MubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInRvcGljcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnRvcGljcykpO1xyXG5cdFx0aWYgKHRoaXMuc291cmNlcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwic291cmNlcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnNvdXJjZXMpKTtcclxuXHRcdGlmICh0aGlzLmZyb21EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcImZyb209XCIgKyB0aGlzLmZyb21EYXRlKTtcclxuXHRcdGlmICh0aGlzLnRvRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJ0bz1cIiArIHRoaXMudG9EYXRlKTtcclxuXHJcblx0XHRyZXR1cm4gcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjb25jYXRNdWx0aVBhcmFtKGFycmF5OiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYXJyYXkuam9pbihcIjtcIik7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7QWpheH0gZnJvbSBcIi4vQWpheFwiO1xyXG5pbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuXHJcbmNsYXNzIEFydGljbGVSZXN1bHQge1xyXG5cdGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG5cdGFydGljbGVzOiBhbnlbXTsgLy8gVE9ETyBkZWZpbmUgQXJ0aWNsZSB3aGVuIEFydGljbGUgc2VydmVyIGNsYXNzIGlzIHN0YWJsZVxyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHJcblx0Ly8gc2VhcmNoIGZvciBhcnRpY2xlcyB3aXRoIHF1ZXJ5IFwiU3VjaHdvcnRcIlxyXG5cdEFqYXguZ2V0QnlRdWVyeShcIlN1Y2h3b3J0XCIsIG5ldyBGaWx0ZXJPcHRpb25zKCksIDAsIDEwKVxyXG5cdFx0LmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcblx0XHRcdGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcblx0XHRcdFx0Zm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGFydGljbGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5mYWlsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG5cdFx0fSk7XHJcbn0pO1xyXG4iLCIiXX0=
