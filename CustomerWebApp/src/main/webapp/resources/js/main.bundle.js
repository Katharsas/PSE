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
//declare var $; bug, place this in definiton file?, how to embed other js docs=?
var result = {
    "cards": [
        {
            "action": {
                "type": "Source",
                "job": "This is a job",
            }
        },
        {
            "action": {
                "type": "Pource",
                "job": "This is a join",
            }
        },
    ]
};
var MyConsole = (function () {
    function MyConsole() {
    }
    MyConsole.prototype.log = function (s) {
        console.log("" + s);
    };
    MyConsole.prototype.get = function (id) {
        return document.getElementById(id);
    };
    return MyConsole;
}());
;
var ServerConnection = (function () {
    function ServerConnection() {
    }
    ServerConnection.prototype.post = function (s) {
        cs.log("" + s);
        jl.log("post: " + s, "ntf");
    };
    return ServerConnection;
}());
;
var JsLog = (function () {
    function JsLog() {
    }
    JsLog.prototype.log = function (s, status_name) {
        //#json?? FF9838
        var status = ["err", "msg", "ntf"];
        var status_display = ["Error", "Message", "Notification"];
        var colors = ["FF6159", "FF9F51", "22B8EB", "", ""];
        //             orange  
        var jl = document.getElementById("js_log"); //in constructor rein
        var col_id = status.indexOf(status_name);
        // allert rasie bug , erro rif col_id < 0
        var status_display_name = status_display[col_id];
        s = s.replace("\n", "<br>");
        s = status_display_name + "\n\n" + s;
        var txt = s.replace("\n", "<br><br>");
        jl.innerHTML = txt;
        //jl.parentElement.style.background = "#"+colors[col_id];
        jl.style.borderColor = "#" + colors[col_id];
    };
    JsLog.prototype.get = function (id) {
        return document.getElementById(id);
    };
    return JsLog;
}());
;
//var greeter = new Greeter("Hello, world!");
// Excat order of these next commands is important 
var cs = new MyConsole();
var jl = new JsLog();
var conn = new ServerConnection();
// var jl = document.getElementById("js_log"); bug why not here global
/*
    $(document).ready(() => {
          console.log('ts 1');
 });
 window.onload
 */
document.addEventListener("DOMContentLoaded", function (event) {
    //var k = "kj";
    on_load();
});
var global_filterOptions;
function on_load() {
    global_filterOptions = new FilterOptions_1.FilterOptions();
    var cs_log_ajax_hint = "___ajax___ ";
    global_filterOptions.topics.push("Politics");
    global_filterOptions.sources.push("cnn");
    global_filterOptions.toDate = "2016-12-25";
    //global_filterOptions.fromDate = "2000-12-25";
    Ajax_1.Ajax.getByQuery("Tiger Woods", global_filterOptions, 0, 10)
        .done(function (result) {
        if (result.errorMessage !== null) {
            console.log(cs_log_ajax_hint, result.errorMessage);
        }
        else {
            console.log(cs_log_ajax_hint, "Articles received:");
            for (var _i = 0, _a = result.articles; _i < _a.length; _i++) {
                var article = _a[_i];
                console.log(cs_log_ajax_hint, article);
                console.log(article.author);
            }
        }
    })
        .fail(function () {
        console.log(cs_log_ajax_hint, "Sending request failed!");
    });
    cs.log("hi k--jk--");
    //cs.get("res").innerHTML = greeter.greet();
    var list = document.getElementById("result_sample_list");
    var sample = document.getElementById("result_sample");
    var topic_list = document.getElementById("select_topic_list");
    for (var i = 0; i < 0; i++) {
        var el = sample.cloneNode(true); // bug overwritten by ts
        list.appendChild(el);
    }
    // bug get sources todo !!
    for (var i = 0; i < 15; i++) {
        var el = document.createElement('li');
        var text_node = document.createTextNode("Topic " + i);
        el.appendChild(text_node);
        topic_list.appendChild(el);
    }
    //*/
    function element_set_display(id, val) {
        var el = document.getElementById(id);
        el.style.display = val;
    }
    function element_show(id) {
        element_set_display(id, "block");
    }
    function element_hide(id) {
        //check status? raise error if hidden?
        element_set_display(id, "none");
    }
    function span_hidden_create(id, text) {
        var el = document.getElementById(id);
        var elements_to_remove = el.getElementsByClassName("span_hidden");
        while (elements_to_remove[0]) {
            elements_to_remove[0].parentNode.removeChild(elements_to_remove[0]);
        }
        var e = document.createElement("span");
        e.id = "span_hidden_" + id;
        e.className = "span_hidden";
        e.innerHTML = text;
        e.style.display = "none";
        el.appendChild(e);
        console.log(e);
    }
    function span_hidden_delete(id) {
        var el = document.getElementById(id);
        var elements_to_remove = el.getElementsByClassName("span_hidden");
        while (elements_to_remove[0]) {
            elements_to_remove[0].parentNode.removeChild(elements_to_remove[0]);
        }
    }
    function span_hidden_check(id, text) {
        var el = document.getElementById(id);
        var bool = false;
        var span_list = el.getElementsByClassName("span_hidden");
        //el.getElementById("span_hidden_"+id);
        // Wenn kein Hidden Span da, dann wert immer falsch!!
        //bug assumes just one clas raise warnign if more classes !! , cleared, by check lenght == 1
        if (span_list.length == 1) {
            var span = span_list[0];
            console.log(span.innerHTML, text);
            bool = ("" + text == "" + span.innerHTML);
        }
        else {
        }
        cs.log("" + bool);
        return bool;
    }
    function f_search_keywords(el) {
        var fld_search = document.getElementById("fld_search");
        var fld = fld_search.value;
        var keywords = fld;
        conn.post(keywords);
    }
    function f_search_filter(el) {
        var check = span_hidden_check("filter_settings", "state_show");
        if (check) {
            element_hide("filter_settings");
            span_hidden_delete("filter_settings");
            jl.log("Filter \n is closing.", "ntf");
        }
        else {
            element_show("filter_settings");
            span_hidden_create("filter_settings", "state_show");
            jl.log("Filter \n is opening.", "ntf");
        }
        //show hide, not toggle !!
    }
    var date_start = document.getElementById("date_start");
    var date_start_str = date_start.value.replace(/-/g, "/");
    var date_start_date = new Date(date_start_str);
    cs.log("" + date_start_date);
    cs.log(date_start_date.toString());
    function check_url_name(event) {
        //var url_name = window.location;//.pathname;
        //cs.log(url_name);
        var url_hash = window.location.hash; //.pathname;
        console.log(url_hash); // does not work in ie?? !!!
        var key = "search_filter";
        if (url_hash.indexOf("#" + key) == 0) {
            f_search_filter(key);
            cs.log(key);
        }
        //if #search_filter in url_hash
        //multiflag_last_hash = search_filter...
        //show fileter, seach keywords, show cache (grey, blue, black and white, theme all new cache, do post req.)
        // if keywords, post action = serach subaction = keywords data = keywords array, or cache_id request infos..., 
        // then show, post update grey are progress bar, filter infos get local storage filters__.., get filters from page? marked (span marke, real value, display...
    }
    function process_click_or_enter(ev) {
        console.log(ev);
        el = this;
        // bad gives full href with link
        //var href = el.href; 
        // nice, gives raw href, from element only ( e.g. #search_filter, instead of www.google.com/#seach_filter)
        var href = el.getAttribute("href");
        href = href.slice(1);
        //var key = "search_filter";
        //key = "#" + key;
        /*
        var is_same = (href == key) ;
        if (is_same){ //url_hash.indexOf("#"+key) == 0
        }
        */
        console.log("info href swithc--" + href + "--");
        console.log("bool", href == "seach_filter", href, "seach_filter");
        switch (href) {
            case "search_filter":
                f_search_filter(el);
                break;
            case "search_keywords":
                f_search_keywords(el);
                break;
            default:
        }
        cs.log("# selection was - " + href);
        console.log("href", href);
        console.log(el);
        //cs.log(el.getAttribute("href"));
    }
    var col_a = document.getElementsByTagName("A");
    //var list_a = Array.prototype.slice.call( col_a, 0 );
    var list_a = [];
    for (var i = 0; i < col_a.length; i++)
        list_a.push(col_a[i]);
    console.log("li", list_a);
    console.log("li", col_a.length);
    for (var i = 0; i < col_a.length; i++) {
        var anch = list_a[i]; // (<any> x);
        // todo bug, refac, check if class is normal link, then dont add any special onclick handling
        //console.log("i", anch);
        //var anch = (<any> list_a[i]  );
        anch.onclick = process_click_or_enter;
    }
    //var anch = null;
    /*
    for(var x in result) { // if you have named properties
       anch = result[x];
    }
    */
    //document.getElementById('anchorID')
    //document.getElementById('anchorID').
    /*
    if (window.onpopstate != undefined) {
       window.onpopstate = check_url_name;
    } else {
       window.onhashchange = check_url_name;
    }
    */
    /*
    window.onpopstate = function(event) {
       //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
       check_url_name();
    };
    */
    /*

    bug add serach button search button

window.addEventListener('popstate', listener);

const pushUrl = (href) => {
history.pushState({}, '', href);
window.dispatchEvent(new Event('popstate'));
};
    
var datestring = $("#date").val().replace(/-/g, "/");
var date = new Date(datestring);
//date.tostring());
var elements_sel= document.querySelectorAll('#Test, #Test *');
.addEventListener('click', function() {
  alert('Hello world again!!!');
}, false);
*/
    //$('.sys input[type=text], .sys select').each(function() {})
}
//window.onload = on_load();
//#tsc --watch -p js
/*
   clean up js, ts
   - on enter search, advanced search
   - offer date range
   - offer themes/topics
   - offer lupe show, use backroung image?? better, because css changebar
   - onclick a href open cache, search similar (intervall get new url), event new page? onpageload?
   - on
   - send post class, bind clicks ...
   - Filter by topic, by date
   - button , banner , progress bar for search, show post info !!
   - favorite topics in separte/first line (write my favorites= ? or not)
   
   - topics ya <a> for keymove
   - test everything keymove
   - filter, lupe keymove color
   
   - bug add serach button search button
   
   - filter add < < ^arrow down dazu aufklapp arrow !!
   - json to html for result !!
   - popstate io, IE ??
   
   - parse date, topic on server for validating !!
   - mark use of other author libraries !! for date !!,
   - close filter x (hide filder / symbolP?)
   
   apply filter

*/
},{"./Ajax":1,"./FilterOptions":2}],4:[function(require,module,exports){

},{}]},{},[3,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L21haW4udHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L3R5cGluZ3MvanF1ZXJ5LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDSUEsSUFBYyxJQUFJLENBZ0NqQjtBQWhDRCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLElBQUksVUFBVSxHQUFHLDRCQUE0QixDQUFDO0lBQ2pELElBQU0sT0FBTyxHQUFXLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUMxRCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELHND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QUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQixPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFakMsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTtRQUNuQyw2RkFBNkY7UUFDN0YseUJBQXlCO1FBQ3pCLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFDLHNCQUFzQixDQUFDO0lBYXZDLENBQUM7SUFFRCxrQkFBa0I7SUFDbEI7Ozs7TUFJRTtJQUVGLHFDQUFxQztJQUNyQyxzQ0FBc0M7SUFHdEM7Ozs7OztNQU1FO0lBQ0Y7Ozs7O01BS0U7SUFDSTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0JKO0lBRUYsNkRBQTZEO0FBRWhFLENBQUM7QUFFRCw0QkFBNEI7QUFFNUIsb0JBQW9CO0FBRXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZCRTs7QUNqWUwiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcblxyXG5kZWNsYXJlIHZhciBjb250ZXh0VXJsOiBzdHJpbmc7XHJcblxyXG5leHBvcnQgbW9kdWxlIEFqYXgge1xyXG4gICAgdmFyIGNvbnRleHRVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9DV0EvXCI7XHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgaGVhZGVycyA9IHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb24sKi8qO3E9MC44XCIgfTtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5UXVlcnkocXVlcnk6IFN0cmluZywgZmlsdGVyczogRmlsdGVyT3B0aW9ucywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcInF1ZXJ5PVwiICsgcXVlcnkpO1xyXG5cclxuXHRcdGxldCBmaWx0ZXJQYXJhbXM6IHN0cmluZyA9IGZpbHRlcnMudG9VcmxQYXJhbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX1wiLGZpbHRlclBhcmFtcyk7XHJcblx0XHRpZiAoZmlsdGVyUGFyYW1zICE9PSBcIlwiKSBwYXJhbXMucHVzaChmaWx0ZXJQYXJhbXMpO1xyXG5cclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZSArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVNpbWlsYXIoYXJ0aWNsZUlkOiBTdHJpbmcsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHQvLyBUT0RPXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgRmlsdGVyT3B0aW9ucyB7XHJcblxyXG5cdHRvcGljczogc3RyaW5nW10gPSBbXTtcclxuXHRzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBmcm9tRGF0ZTogc3RyaW5nID0gXCIxOTgwLTAxLTAxXCI7XHJcblx0dG9EYXRlOiBzdHJpbmcgPSBcIjIwMjAtMDEtMDFcIjsgLy8gYnVnICwgYmV0dGVyIGRlZmF1bHRzID8gXHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwiZnJvbT1cIiArIHRoaXMuZnJvbURhdGUpO1xyXG5cdFx0aWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcInRvPVwiICsgdGhpcy50b0RhdGUpO1xyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcblx0ZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcblx0YXJ0aWNsZXM6IGFueVtdOyAvLyBUT0RPIGRlZmluZSBBcnRpY2xlIHdoZW4gQXJ0aWNsZSBzZXJ2ZXIgY2xhc3MgaXMgc3RhYmxlXHJcbn1cclxuXHJcbiAgIC8vZGVjbGFyZSB2YXIgJDsgYnVnLCBwbGFjZSB0aGlzIGluIGRlZmluaXRvbiBmaWxlPywgaG93IHRvIGVtYmVkIG90aGVyIGpzIGRvY3M9P1xyXG5cclxuICAgdmFyIHJlc3VsdCA9IHsgXHJcbiAgICAgIFwiY2FyZHNcIjogW1xyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiU291cmNlXCIsXHJcbiAgICAgICAgICAgICAgIFwiam9iXCI6IFwiVGhpcyBpcyBhIGpvYlwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJhY3Rpb25cIjoge1xyXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJQb3VyY2VcIixcclxuICAgICAgICAgICAgICAgXCJqb2JcIjogXCJUaGlzIGlzIGEgam9pblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgIF1cclxuICAgfTtcclxuICAgXHJcbiAgIFxyXG5cclxuICAgY2xhc3MgTXlDb25zb2xlIHtcclxuICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICBsb2cocyA6IHN0cmluZykge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIrcyk7XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgY3MubG9nKFwiXCIrcyk7XHJcbiAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIrcywgXCJudGZcIik7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG4gICBjbGFzcyBKc0xvZyB7XHJcbiAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgbG9nKHM6c3RyaW5nLHN0YXR1c19uYW1lOnN0cmluZykge1xyXG4gICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgIHZhciBzdGF0dXMgPSBbXCJlcnJcIiwgXCJtc2dcIiwgXCJudGZcIiBdO1xyXG4gICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIiBdO1xyXG4gICAgICAgICB2YXIgY29sb3JzID0gW1wiRkY2MTU5XCIsIFwiRkY5RjUxXCIsXCIyMkI4RUJcIixcIlwiLFwiXCIgXTsgXHJcbiAgICAgICAgIC8vICAgICAgICAgICAgIG9yYW5nZSAgXHJcbiAgICAgICAgICAgIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyAvL2luIGNvbnN0cnVjdG9yIHJlaW5cclxuICAgICAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAgICAgLy8gYWxsZXJ0IHJhc2llIGJ1ZyAsIGVycm8gcmlmIGNvbF9pZCA8IDBcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5X25hbWUgPSBzdGF0dXNfZGlzcGxheVtjb2xfaWRdXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj5cIik7XHJcbiAgICAgICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIC8vamwucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG5cclxuICAgLy92YXIgZ3JlZXRlciA9IG5ldyBHcmVldGVyKFwiSGVsbG8sIHdvcmxkIVwiKTtcclxuICAgLy8gRXhjYXQgb3JkZXIgb2YgdGhlc2UgbmV4dCBjb21tYW5kcyBpcyBpbXBvcnRhbnQgXHJcbiAgIHZhciBjcyA9IG5ldyBNeUNvbnNvbGUoKTsgICAgXHJcbiAgIHZhciBqbCA9IG5ldyBKc0xvZygpO1xyXG4gICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcbiAgIC8vIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyBidWcgd2h5IG5vdCBoZXJlIGdsb2JhbFxyXG4gICAvKlxyXG4gICAgICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coJ3RzIDEnKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93Lm9ubG9hZFxyXG4gICAgKi9cclxuICAgIFxyXG4gICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICAgICAgLy92YXIgayA9IFwia2pcIjtcclxuICAgICAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gdmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zIDogYW55OyBcclxuIGZ1bmN0aW9uIG9uX2xvYWQoKXtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzLnB1c2goXCJQb2xpdGljc1wiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXMucHVzaChcImNublwiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IFwiMjAxNi0xMi0yNVwiO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgQWpheC5nZXRCeVF1ZXJ5KFwiVGlnZXIgV29vZHNcIiwgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCxyZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCxcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY3MubG9nKFwiaGkgay0tamstLVwiKTtcclxuICAgICAgLy9jcy5nZXQoXCJyZXNcIikuaW5uZXJIVE1MID0gZ3JlZXRlci5ncmVldCgpO1xyXG4gICAgICBcclxuICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMDsgaSsrKXsgLy9idWdcclxuICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2psLmxvZyhcIlRoaXMgcG9zdCB3YXNcXG5cIixcImVyclwiKTtcclxuICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAxNTsgaSsrKXtcclxuICAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgLy8gYnVnIGVycm9mIG9mIHR5cGVzY3JpcHQgPz9cclxuICAgICAgfVxyXG4gICAgICAvLyovXHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBlbGVtZW50X3NldF9kaXNwbGF5KGlkIDogc3RyaW5nLCB2YWwgOiBzdHJpbmcpe1xyXG4gICAgICAgICB2YXIgZWwgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpICApO1xyXG4gICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2hvdyhpZCA6IHN0cmluZyl7XHJcbiAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwiYmxvY2tcIik7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gZWxlbWVudF9oaWRlKGlkIDogc3RyaW5nKXtcclxuICAgICAgICAgLy9jaGVjayBzdGF0dXM/IHJhaXNlIGVycm9yIGlmIGhpZGRlbj9cclxuICAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJub25lXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jcmVhdGUoaWQgOiBzdHJpbmcsdGV4dCA6IHN0cmluZyl7XHJcbiAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgZSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSAgKTtcclxuICAgICAgICAgZS5pZCA9IFwic3Bhbl9oaWRkZW5fXCIraWQ7XHJcbiAgICAgICAgIGUuY2xhc3NOYW1lID0gXCJzcGFuX2hpZGRlblwiO1xyXG4gICAgICAgICBlLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgIGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICBlbC5hcHBlbmRDaGlsZChlKTtcclxuICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fZGVsZXRlKGlkIDogc3RyaW5nKXtcclxuICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NoZWNrKGlkIDogc3RyaW5nLHRleHQgOiBzdHJpbmcpe1xyXG4gICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgIHZhciBib29sID0gZmFsc2U7XHJcbiAgICAgICAgIHZhciBzcGFuX2xpc3QgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcbiAgICAgICAgIC8vZWwuZ2V0RWxlbWVudEJ5SWQoXCJzcGFuX2hpZGRlbl9cIitpZCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICAvLyBXZW5uIGtlaW4gSGlkZGVuIFNwYW4gZGEsIGRhbm4gd2VydCBpbW1lciBmYWxzY2ghIVxyXG4gICAgICAgICAvL2J1ZyBhc3N1bWVzIGp1c3Qgb25lIGNsYXMgcmFpc2Ugd2FybmlnbiBpZiBtb3JlIGNsYXNzZXMgISEgLCBjbGVhcmVkLCBieSBjaGVjayBsZW5naHQgPT0gMVxyXG4gICAgICAgICBpZiAoIHNwYW5fbGlzdC5sZW5ndGg9PTEgKXtcclxuICAgICAgICAgICAgdmFyIHNwYW4gPSBzcGFuX2xpc3RbMF07XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwYW4uaW5uZXJIVE1MLCB0ZXh0KTtcclxuICAgICAgICAgICAgYm9vbCA9ICggXCJcIit0ZXh0ID09IFwiXCIrc3Bhbi5pbm5lckhUTUwgKTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgY3MubG9nKFwiXCIrYm9vbCk7XHJcbiAgICAgICAgIHJldHVybiBib29sO1xyXG4gICAgICAgICBcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHMoZWw6IGFueSl7IFxyXG4gICAgICAgICB2YXIgZmxkX3NlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxkX3NlYXJjaFwiKTtcclxuICAgICAgICAgdmFyIGZsZCA9ICg8SFRNTElucHV0RWxlbWVudD4gZmxkX3NlYXJjaCkudmFsdWU7XHJcbiAgICAgICAgIHZhciBrZXl3b3JkcyA9IGZsZDtcclxuICAgICAgICAgY29ubi5wb3N0KGtleXdvcmRzKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfZmlsdGVyKGVsIDogYW55KXsgLy8gYnVnIGtleSBub3QgdXNlZFxyXG4gICAgICAgICB2YXIgY2hlY2sgPSBzcGFuX2hpZGRlbl9jaGVjayhcImZpbHRlcl9zZXR0aW5nc1wiLFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgaWYgKGNoZWNrKXtcclxuICAgICAgICAgICAgZWxlbWVudF9oaWRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBzcGFuX2hpZGRlbl9kZWxldGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgY2xvc2luZy5cIixcIm50ZlwiKTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2hvdyhcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgc3Bhbl9oaWRkZW5fY3JlYXRlKFwiZmlsdGVyX3NldHRpbmdzXCIsXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIG9wZW5pbmcuXCIsXCJudGZcIik7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgLy9zaG93IGhpZGUsIG5vdCB0b2dnbGUgISFcclxuICAgICAgfVxyXG4gICAgICB2YXIgZGF0ZV9zdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgdmFyIGRhdGVfc3RhcnRfc3RyID0gICg8SFRNTElucHV0RWxlbWVudD4gZGF0ZV9zdGFydCkudmFsdWUucmVwbGFjZSgvLS9nLCBcIi9cIik7XHJcbiAgICAgIHZhciBkYXRlX3N0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlX3N0YXJ0X3N0cik7XHJcbiAgICAgIGNzLmxvZyhcIlwiK2RhdGVfc3RhcnRfZGF0ZSk7XHJcbiAgICAgIGNzLmxvZyhkYXRlX3N0YXJ0X2RhdGUudG9TdHJpbmcoKSk7XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBjaGVja191cmxfbmFtZShldmVudCA6IGFueSl7XHJcbiAgICAgICAgIC8vdmFyIHVybF9uYW1lID0gd2luZG93LmxvY2F0aW9uOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgICAvL2NzLmxvZyh1cmxfbmFtZSk7XHJcbiAgICAgICAgIHZhciB1cmxfaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyh1cmxfaGFzaCk7IC8vIGRvZXMgbm90IHdvcmsgaW4gaWU/PyAhISFcclxuICAgICAgICAgdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiIDtcclxuICAgICAgICAgaWYgKHVybF9oYXNoLmluZGV4T2YoXCIjXCIra2V5KSA9PSAwKXtcclxuICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGtleSk7XHJcbiAgICAgICAgICAgIGNzLmxvZyhrZXkpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIC8vaWYgI3NlYXJjaF9maWx0ZXIgaW4gdXJsX2hhc2hcclxuICAgICAgICAgLy9tdWx0aWZsYWdfbGFzdF9oYXNoID0gc2VhcmNoX2ZpbHRlci4uLlxyXG4gICAgICAgICAvL3Nob3cgZmlsZXRlciwgc2VhY2gga2V5d29yZHMsIHNob3cgY2FjaGUgKGdyZXksIGJsdWUsIGJsYWNrIGFuZCB3aGl0ZSwgdGhlbWUgYWxsIG5ldyBjYWNoZSwgZG8gcG9zdCByZXEuKVxyXG4gICAgICAgICAvLyBpZiBrZXl3b3JkcywgcG9zdCBhY3Rpb24gPSBzZXJhY2ggc3ViYWN0aW9uID0ga2V5d29yZHMgZGF0YSA9IGtleXdvcmRzIGFycmF5LCBvciBjYWNoZV9pZCByZXF1ZXN0IGluZm9zLi4uLCBcclxuICAgICAgICAgLy8gdGhlbiBzaG93LCBwb3N0IHVwZGF0ZSBncmV5IGFyZSBwcm9ncmVzcyBiYXIsIGZpbHRlciBpbmZvcyBnZXQgbG9jYWwgc3RvcmFnZSBmaWx0ZXJzX18uLiwgZ2V0IGZpbHRlcnMgZnJvbSBwYWdlPyBtYXJrZWQgKHNwYW4gbWFya2UsIHJlYWwgdmFsdWUsIGRpc3BsYXkuLi5cclxuICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHByb2Nlc3NfY2xpY2tfb3JfZW50ZXIoZXYgOiBhbnkpe1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhldik7XHJcbiAgICAgICAgIGVsID0gdGhpcztcclxuXHJcbiAgICAgICAgIC8vIGJhZCBnaXZlcyBmdWxsIGhyZWYgd2l0aCBsaW5rXHJcbiAgICAgICAgIC8vdmFyIGhyZWYgPSBlbC5ocmVmOyBcclxuICAgICAgICAgLy8gbmljZSwgZ2l2ZXMgcmF3IGhyZWYsIGZyb20gZWxlbWVudCBvbmx5ICggZS5nLiAjc2VhcmNoX2ZpbHRlciwgaW5zdGVhZCBvZiB3d3cuZ29vZ2xlLmNvbS8jc2VhY2hfZmlsdGVyKVxyXG4gICAgICAgICB2YXIgaHJlZiA9ICg8YW55PmVsKS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xyXG4gICAgICAgICBocmVmID0gaHJlZi5zbGljZSgxKTtcclxuICAgICAgICAgLy92YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCI7XHJcbiAgICAgICAgIC8va2V5ID0gXCIjXCIgKyBrZXk7XHJcbiAgICAgICAgIC8qXHJcbiAgICAgICAgIHZhciBpc19zYW1lID0gKGhyZWYgPT0ga2V5KSA7XHJcbiAgICAgICAgIGlmIChpc19zYW1lKXsgLy91cmxfaGFzaC5pbmRleE9mKFwiI1wiK2tleSkgPT0gMFxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICovIFxyXG4gICAgICAgICBjb25zb2xlLmxvZyhcImluZm8gaHJlZiBzd2l0aGMtLVwiK2hyZWYrXCItLVwiKTtcclxuICAgICAgICAgY29uc29sZS5sb2coXCJib29sXCIsIGhyZWY9PVwic2VhY2hfZmlsdGVyXCIsIGhyZWYsIFwic2VhY2hfZmlsdGVyXCIgKTtcclxuICAgICAgICAgc3dpdGNoKGhyZWYpIHtcclxuICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9maWx0ZXJcIjpcclxuICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGVsKTtcclxuICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfa2V5d29yZHNcIjpcclxuICAgICAgICAgICAgICAgZl9zZWFyY2hfa2V5d29yZHMoZWwpO1xyXG4gICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgLy9kZWZhdWx0IGNvZGUgYmxvY2tcclxuICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgICB9IFxyXG4gICAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgICAgIGNzLmxvZyhcIiMgc2VsZWN0aW9uIHdhcyAtIFwiK2hyZWYpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcImhyZWZcIixocmVmKTtcclxuICAgICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4gICAgICAgICAvL2NzLmxvZyhlbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdmFyIGNvbF9hID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiQVwiKSAgKTtcclxuICAgICAgLy92YXIgbGlzdF9hID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGNvbF9hLCAwICk7XHJcbiAgICAgIHZhciBsaXN0X2E6IGFueSA9IFtdO1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIGxpc3RfYS5wdXNoKGNvbF9hW2ldKTtcclxuICAgICAgY29uc29sZS5sb2coIFwibGlcIiwgbGlzdF9hKTtcclxuICAgICAgY29uc29sZS5sb2coIFwibGlcIiwgY29sX2EubGVuZ3RoKTtcclxuICAgICAgXHJcbiAgICAgIGZvcih2YXIgaT0wO2k8Y29sX2EubGVuZ3RoO2krKykgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgIHZhciBhbmNoID0gbGlzdF9hW2ldOyAvLyAoPGFueT4geCk7XHJcbiAgICAgICAgIC8vIHRvZG8gYnVnLCByZWZhYywgY2hlY2sgaWYgY2xhc3MgaXMgbm9ybWFsIGxpbmssIHRoZW4gZG9udCBhZGQgYW55IHNwZWNpYWwgb25jbGljayBoYW5kbGluZ1xyXG4gICAgICAgICAvL2NvbnNvbGUubG9nKFwiaVwiLCBhbmNoKTtcclxuICAgICAgICAgLy92YXIgYW5jaCA9ICg8YW55PiBsaXN0X2FbaV0gICk7XHJcbiAgICAgICAgIGFuY2gub25jbGljaz1wcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAvKmZ1bmN0aW9uKCl7Lyogc29tZSBjb2RlICogL1xyXG4gICAgICAgICAgICAoIGFuY2ggKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICAvLyBOZWVkIHRoaXMgZm9yIElFLCBDaHJvbWUgP1xyXG4gICAgICAgICAvKiBcclxuICAgICAgICAgYW5jaC5vbmtleXByZXNzPWZ1bmN0aW9uKGUpeyAvL2llID8/XHJcbiAgICAgICAgICAgIGlmKGUud2hpY2ggPT0gMTMpey8vRW50ZXIga2V5IHByZXNzZWRcclxuICAgICAgICAgICAgICAgcHJvY2Vzc19jbGlja19vcl9lbnRlciggYW5jaCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgKi9cclxuICAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vdmFyIGFuY2ggPSBudWxsO1xyXG4gICAgICAvKlxyXG4gICAgICBmb3IodmFyIHggaW4gcmVzdWx0KSB7IC8vIGlmIHlvdSBoYXZlIG5hbWVkIHByb3BlcnRpZXNcclxuICAgICAgICAgYW5jaCA9IHJlc3VsdFt4XTtcclxuICAgICAgfVxyXG4gICAgICAqL1xyXG4gICAgICBcclxuICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5jaG9ySUQnKVxyXG4gICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbmNob3JJRCcpLlxyXG4gICAgICBcclxuICAgICAgIFxyXG4gICAgICAvKlxyXG4gICAgICBpZiAod2luZG93Lm9ucG9wc3RhdGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gY2hlY2tfdXJsX25hbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgIHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBjaGVja191cmxfbmFtZTtcclxuICAgICAgfVxyXG4gICAgICAqL1xyXG4gICAgICAvKlxyXG4gICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgIC8vY29uc29sZS5sb2coXCJsb2NhdGlvbjogXCIgKyBkb2N1bWVudC5sb2NhdGlvbiArIFwiLCBzdGF0ZTogXCIgKyBKU09OLnN0cmluZ2lmeShldmVudC5zdGF0ZSkpO1xyXG4gICAgICAgICBjaGVja191cmxfbmFtZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICAqL1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICBcclxuICAgICAgICAgICAgYnVnIGFkZCBzZXJhY2ggYnV0dG9uIHNlYXJjaCBidXR0b25cclxuICAgICAgXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGxpc3RlbmVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHVzaFVybCA9IChocmVmKSA9PiB7XHJcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCBocmVmKTtcclxuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3BvcHN0YXRlJykpO1xyXG4gICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgdmFyIGRhdGVzdHJpbmcgPSAkKFwiI2RhdGVcIikudmFsKCkucmVwbGFjZSgvLS9nLCBcIi9cIik7XHJcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZXN0cmluZyk7XHJcbiAgICAgIC8vZGF0ZS50b3N0cmluZygpKTtcdFxyXG4gICAgICB2YXIgZWxlbWVudHNfc2VsPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjVGVzdCwgI1Rlc3QgKicpO1xyXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGFsZXJ0KCdIZWxsbyB3b3JsZCBhZ2FpbiEhIScpO1xyXG4gICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICovXHJcbiAgICAgIFxyXG4gICAgICAvLyQoJy5zeXMgaW5wdXRbdHlwZT10ZXh0XSwgLnN5cyBzZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCkge30pXHJcblxyXG4gICB9XHJcbiAgIFxyXG4gICAvL3dpbmRvdy5vbmxvYWQgPSBvbl9sb2FkKCk7XHJcbiAgIFxyXG4gICAvLyN0c2MgLS13YXRjaCAtcCBqc1xyXG4gICBcclxuICAgLypcclxuICAgICAgY2xlYW4gdXAganMsIHRzXHJcbiAgICAgIC0gb24gZW50ZXIgc2VhcmNoLCBhZHZhbmNlZCBzZWFyY2hcclxuICAgICAgLSBvZmZlciBkYXRlIHJhbmdlXHJcbiAgICAgIC0gb2ZmZXIgdGhlbWVzL3RvcGljc1xyXG4gICAgICAtIG9mZmVyIGx1cGUgc2hvdywgdXNlIGJhY2tyb3VuZyBpbWFnZT8/IGJldHRlciwgYmVjYXVzZSBjc3MgY2hhbmdlYmFyXHJcbiAgICAgIC0gb25jbGljayBhIGhyZWYgb3BlbiBjYWNoZSwgc2VhcmNoIHNpbWlsYXIgKGludGVydmFsbCBnZXQgbmV3IHVybCksIGV2ZW50IG5ldyBwYWdlPyBvbnBhZ2Vsb2FkP1xyXG4gICAgICAtIG9uIFxyXG4gICAgICAtIHNlbmQgcG9zdCBjbGFzcywgYmluZCBjbGlja3MgLi4uXHJcbiAgICAgIC0gRmlsdGVyIGJ5IHRvcGljLCBieSBkYXRlXHJcbiAgICAgIC0gYnV0dG9uICwgYmFubmVyICwgcHJvZ3Jlc3MgYmFyIGZvciBzZWFyY2gsIHNob3cgcG9zdCBpbmZvICEhXHJcbiAgICAgIC0gZmF2b3JpdGUgdG9waWNzIGluIHNlcGFydGUvZmlyc3QgbGluZSAod3JpdGUgbXkgZmF2b3JpdGVzPSA/IG9yIG5vdClcclxuICAgICAgXHJcbiAgICAgIC0gdG9waWNzIHlhIDxhPiBmb3Iga2V5bW92ZVxyXG4gICAgICAtIHRlc3QgZXZlcnl0aGluZyBrZXltb3ZlXHJcbiAgICAgIC0gZmlsdGVyLCBsdXBlIGtleW1vdmUgY29sb3JcclxuICAgICAgXHJcbiAgICAgIC0gYnVnIGFkZCBzZXJhY2ggYnV0dG9uIHNlYXJjaCBidXR0b25cclxuICAgICAgXHJcbiAgICAgIC0gZmlsdGVyIGFkZCA8IDwgXmFycm93IGRvd24gZGF6dSBhdWZrbGFwcCBhcnJvdyAhIVxyXG4gICAgICAtIGpzb24gdG8gaHRtbCBmb3IgcmVzdWx0ICEhXHJcbiAgICAgIC0gcG9wc3RhdGUgaW8sIElFID8/IFxyXG4gICAgICBcclxuICAgICAgLSBwYXJzZSBkYXRlLCB0b3BpYyBvbiBzZXJ2ZXIgZm9yIHZhbGlkYXRpbmcgISFcclxuICAgICAgLSBtYXJrIHVzZSBvZiBvdGhlciBhdXRob3IgbGlicmFyaWVzICEhIGZvciBkYXRlICEhLCBcclxuICAgICAgLSBjbG9zZSBmaWx0ZXIgeCAoaGlkZSBmaWxkZXIgLyBzeW1ib2xQPylcclxuICAgICAgXHJcbiAgICAgIGFwcGx5IGZpbHRlclxyXG4gICBcclxuICAgKi9cclxuICAgXHJcbiAgICIsIiJdfQ==
