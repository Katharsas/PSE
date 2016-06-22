(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Ajax;
(function (Ajax) {
    //var contextUrl = "http://localhost:8080/CWA/";
    var urlBase = contextUrl + "getArticles/search";
    var urlBase_metadata = contextUrl + "getMetadata";
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
    function getMetadata() {
        var url = urlBase_metadata;
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
    Ajax.getMetadata = getMetadata;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L215SGVsbG8udHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L3R5cGluZ3MvanF1ZXJ5LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDSUEsSUFBYyxJQUFJLENBZ0RqQjtBQWhERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLGdEQUFnRDtJQUNuRCxJQUFNLE9BQU8sR0FBVyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsSUFBTSxnQkFBZ0IsR0FBVyxVQUFVLEdBQUcsYUFBYSxDQUFDO0lBQzVELElBQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFFLENBQUM7SUFFekQsb0JBQTJCLEtBQWEsRUFBRSxPQUFzQixFQUFFLElBQVksRUFBRSxLQUFhO1FBQzVGLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUU5QixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUUzQyxJQUFJLEdBQUcsR0FBVyxPQUFPLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENB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SUFBSSw2QkFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNyRCxJQUFJLENBQUMsVUFBUyxNQUFxQjtRQUNuQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsQ0FBQyxDQUFnQixVQUFlLEVBQWYsS0FBQSxNQUFNLENBQUMsUUFBUSxFQUFmLGNBQWUsRUFBZixJQUFlLENBQUM7Z0JBQS9CLElBQUksT0FBTyxTQUFBO2dCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDckI7UUFDRixDQUFDO0lBQ0YsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7O0FDekJIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuICAgIC8vdmFyIGNvbnRleHRVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9DV0EvXCI7XHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9tZXRhZGF0YTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0TWV0YWRhdGFcIjtcclxuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlRdWVyeShxdWVyeTogU3RyaW5nLCBmaWx0ZXJzOiBGaWx0ZXJPcHRpb25zLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicXVlcnk9XCIgKyBxdWVyeSk7XHJcblxyXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fXCIsZmlsdGVyUGFyYW1zKTtcclxuXHRcdGlmIChmaWx0ZXJQYXJhbXMgIT09IFwiXCIpIHBhcmFtcy5wdXNoKGZpbHRlclBhcmFtcyk7XHJcblxyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUlxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKCk6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlX21ldGFkYXRhIDtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5U2ltaWxhcihhcnRpY2xlSWQ6IFN0cmluZywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdC8vIFRPRE9cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBGaWx0ZXJPcHRpb25zIHtcclxuXHJcblx0dG9waWNzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdHNvdXJjZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGZyb21EYXRlOiBzdHJpbmcgPSBcIjE5ODAtMDEtMDFcIjtcclxuXHR0b0RhdGU6IHN0cmluZyA9IFwiMjAyMC0wMS0wMVwiOyAvLyBidWcgLCBiZXR0ZXIgZGVmYXVsdHMgPyBcclxuICAgIFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0IGZpbHRlciBvcHRpb25zIHRvIHVybCBwYXJhbWV0ZXIgc3RyaW5nIG9mIGZvcm1hdFxyXG5cdCAqIFwicGFyYW0xPXZhbHVlMSZwYXJhbTI9dmFsdWUyJnBhcmFtND12YWx1ZTNcIiBmb3IgdXNlIGFzIHVybCBwYXJhbWV0ZXJzLlxyXG5cdCAqL1xyXG5cdHRvVXJsUGFyYW0oKTogc3RyaW5nIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMudG9waWNzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJ0b3BpY3M9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy50b3BpY3MpKTtcclxuXHRcdGlmICh0aGlzLnNvdXJjZXMubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInNvdXJjZXM9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy5zb3VyY2VzKSk7XHJcblx0XHRpZiAodGhpcy5mcm9tRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJmcm9tPVwiICsgdGhpcy5mcm9tRGF0ZSk7XHJcblx0XHRpZiAodGhpcy50b0RhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY29uY2F0TXVsdGlQYXJhbShhcnJheTogc3RyaW5nW10pOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGFycmF5LmpvaW4oXCI7XCIpO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQge0FqYXh9IGZyb20gXCIuL0FqYXhcIjtcclxuaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcblxyXG5jbGFzcyBBcnRpY2xlUmVzdWx0IHtcclxuXHRlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuXHRhcnRpY2xlczogYW55W107IC8vIFRPRE8gZGVmaW5lIEFydGljbGUgd2hlbiBBcnRpY2xlIHNlcnZlciBjbGFzcyBpcyBzdGFibGVcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblxyXG5cdC8vIHNlYXJjaCBmb3IgYXJ0aWNsZXMgd2l0aCBxdWVyeSBcIlN1Y2h3b3J0XCJcclxuXHRBamF4LmdldEJ5UXVlcnkoXCJTdWNod29ydFwiLCBuZXcgRmlsdGVyT3B0aW9ucygpLCAwLCAxMClcclxuXHRcdC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG5cdFx0XHRpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG5cdFx0XHRcdGZvciAobGV0IGFydGljbGUgb2YgcmVzdWx0LmFydGljbGVzKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhhcnRpY2xlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuZmFpbChmdW5jdGlvbigpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuXHRcdH0pO1xyXG59KTtcclxuIiwiIl19
