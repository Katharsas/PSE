(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Ajax;
(function (Ajax) {
    var urlBase = contextUrl + "search";
    var headers = { accept: "application/json,*/*;q=0.8" };
    function getByQuery(query, filters, skip, limit) {
        var params = [];
        params.push("query=" + query);
        var filterParams = filters.toUrlParam();
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
        this.topics = null;
        this.sources = null;
        this.fromDate = null;
        this.toDate = null;
    }
    /**
     * Convert filter options to url parameter string of format
     * "param1=value1&param2=value2&param4=value3" for use as url parameters.
     */
    FilterOptions.prototype.toUrlParam = function () {
        var params = [];
        if (this.topics !== null)
            params.push("topics=" + this.concatMultiParam(this.topics));
        if (this.sources !== null)
            params.push("sources=" + this.concatMultiParam(this.sources));
        if (this.fromDate)
            params.push("from=" + this.fromDate);
        if (this.toDate)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L215SGVsbG8udHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L3R5cGluZ3MvanF1ZXJ5LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDSUEsSUFBYyxJQUFJLENBOEJqQjtBQTlCRCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ25CLElBQU0sT0FBTyxHQUFXLFVBQVUsR0FBRyxRQUFRLENBQUM7SUFDOUMsSUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsNEJBQTRCLEVBQUUsQ0FBQztJQUV6RCxvQkFBMkIsS0FBYSxFQUFFLE9BQXNCLEVBQUUsSUFBWSxFQUFFLEtBQWE7UUFDNUYsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRTlCLElBQUksWUFBWSxHQUFXLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVuRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRTNDLElBQUksR0FBRyxHQUFXLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxzQ0FBc0M7UUFFdEMsSUFBSSxRQUFRLEdBQUc7WUFDZCxHQUFHLEVBQUUsR0FBRztZQUNSLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFdBQVcsRUFBRSxL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SUFBSSxDQUFDO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7O0FDekJIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xuXG5kZWNsYXJlIHZhciBjb250ZXh0VXJsOiBzdHJpbmc7XG5cbmV4cG9ydCBtb2R1bGUgQWpheCB7XG5cdGNvbnN0IHVybEJhc2U6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcInNlYXJjaFwiO1xuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVF1ZXJ5KHF1ZXJ5OiBTdHJpbmcsIGZpbHRlcnM6IEZpbHRlck9wdGlvbnMsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcblx0XHRwYXJhbXMucHVzaChcInF1ZXJ5PVwiICsgcXVlcnkpO1xuXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XG5cdFx0aWYgKGZpbHRlclBhcmFtcyAhPT0gXCJcIikgcGFyYW1zLnB1c2goZmlsdGVyUGFyYW1zKTtcblxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XG5cblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcblx0XHRcblx0XHRsZXQgc2V0dGluZ3MgPSB7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0XHR0eXBlOiBcIkdFVFwiXG5cdFx0fTtcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcblx0fVxuXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVNpbWlsYXIoYXJ0aWNsZUlkOiBTdHJpbmcsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XG5cdFx0Ly8gVE9ET1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59IiwiZXhwb3J0IGNsYXNzIEZpbHRlck9wdGlvbnMge1xuXG5cdHRvcGljczogc3RyaW5nW10gPSBudWxsO1xuXHRzb3VyY2VzOiBzdHJpbmdbXSA9IG51bGw7XG5cblx0ZnJvbURhdGU6IHN0cmluZyA9IG51bGw7XG5cdHRvRGF0ZTogc3RyaW5nID0gbnVsbDtcblxuXHQvKipcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcblx0ICogXCJwYXJhbTE9dmFsdWUxJnBhcmFtMj12YWx1ZTImcGFyYW00PXZhbHVlM1wiIGZvciB1c2UgYXMgdXJsIHBhcmFtZXRlcnMuXG5cdCAqL1xuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcblxuXHRcdGlmICh0aGlzLnRvcGljcyAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJ0b3BpY3M9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy50b3BpY3MpKTtcblx0XHRpZiAodGhpcy5zb3VyY2VzICE9PSBudWxsKSBwYXJhbXMucHVzaChcInNvdXJjZXM9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy5zb3VyY2VzKSk7XG5cdFx0aWYgKHRoaXMuZnJvbURhdGUpIHBhcmFtcy5wdXNoKFwiZnJvbT1cIiArIHRoaXMuZnJvbURhdGUpO1xuXHRcdGlmICh0aGlzLnRvRGF0ZSkgcGFyYW1zLnB1c2goXCJ0bz1cIiArIHRoaXMudG9EYXRlKTtcblxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XG5cdH1cblxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gYXJyYXkuam9pbihcIjtcIik7XG5cdH1cbn1cbiIsImltcG9ydCB7QWpheH0gZnJvbSBcIi4vQWpheFwiO1xuaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XG5cbmNsYXNzIEFydGljbGVSZXN1bHQge1xuXHRlcnJvck1lc3NhZ2U6IHN0cmluZztcblx0YXJ0aWNsZXM6IGFueVtdO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHQvLyBzZWFyY2ggZm9yIGFydGljbGVzIHdpdGggcXVlcnkgXCJTdWNod29ydFwiXG5cdEFqYXguZ2V0QnlRdWVyeShcIlN1Y2h3b3J0XCIsIG5ldyBGaWx0ZXJPcHRpb25zKCksIDAsIDEwKVxuXHRcdC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xuXHRcdFx0aWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzdWx0LmVycm9yTWVzc2FnZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkFydGljbGVzIHJlY2VpdmVkOlwiKTtcblx0XHRcdFx0Zm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhhcnRpY2xlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmZhaWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xuXHRcdH0pO1xufSk7XG4iLCIiXX0=
