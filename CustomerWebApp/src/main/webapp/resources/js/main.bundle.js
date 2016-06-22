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
function createElem(elName, clsName) {
    var tmp = document.createElement(elName);
    tmp.classList.add(clsName);
    return tmp;
}
function addText(parent, txt) {
    var tmp = document.createTextNode(txt);
    parent.appendChild(tmp);
    //return tmp;
}
var HtmlBuilder;
(function (HtmlBuilder) {
    /**
     * Build html li element from article object
     * kkk
     */
    function buildArticle(article, parent) {
        //var tmp_clearfix = createElem("div","clearfix");
        var root = createElem("div", "result");
        var topic = createElem("div", "container_topic");
        var topic_button = createElem("div", "myButton");
        addText(topic_button, article.topic);
        topic.appendChild(topic_button);
        root.appendChild(topic);
        root.appendChild(createElem("div", "clearfix"));
        var title = createElem("div", "title");
        var a = document.createElement('a');
        a.href = article.url;
        addText(a, article.title);
        title.appendChild(a);
        root.appendChild(title);
        var link = createElem("div", "link");
        addText(link, article.url);
        root.appendChild(link);
        var date = createElem("div", "container_date");
        var date_button = createElem("div", "myButton");
        var date_date = createElem("span", "date");
        var raw_date = article.pubDate;
        //bug substr other behaviour than substring
        var date_y = raw_date.substring(0, 4);
        // here firefox js browser bug on substr(5,7)
        var date_m = raw_date.substring(5, 7).replace(/^0+(?!\.|$)/, '');
        var date_d = raw_date.substring(8, 10).replace(/^0+(?!\.|$)/, '');
        var formatted_date = date_d + "." + date_m + "." + date_y;
        addText(date_date, formatted_date);
        date_button.appendChild(date_date);
        //var date_time = createElem("span","time");
        //date_button.appendChild(date_time);
        date.appendChild(date_button);
        root.appendChild(date);
        root.appendChild(createElem("div", "clearfix"));
        var content = createElem("div", "content");
        addText(content, article.extractedText.substring(0, 300));
        root.appendChild(content);
        var author = createElem("div", "author");
        addText(author, article.author);
        root.appendChild(author);
        // img src="/CWA/resources/img/cache_arrow_down_small_grey.png";
        var container_buttons = createElem("div", "container_buttons");
        // bug refac todo, here aufklappen langer text !
        var cache_button = createElem("div", "myButton");
        var a = document.createElement('a');
        a.href = "#cache_id_1123243";
        var img = document.createElement('img');
        img.src = "/CWA/resources/img/cache_arrow_down_small_grey.png"; //"";
        a.appendChild(img);
        addText(a, "Cache");
        cache_button.appendChild(a);
        container_buttons.appendChild(cache_button);
        var similar_button = createElem("div", "myButton");
        var a = document.createElement('a');
        a.href = "#similar_id_1123243";
        addText(a, "Similar");
        similar_button.appendChild(a);
        container_buttons.appendChild(similar_button);
        root.appendChild(container_buttons);
        root.appendChild(createElem("div", "clearfix"));
        var _tmp = document.createElement('span'); //: any;
        var el = document.createElement('li');
        var text_node = document.createTextNode("Topkic kk");
        el.appendChild(text_node);
        _tmp.appendChild(el);
        console.log("__builder__", _tmp);
        //parent.appendChild(_tmp);
        //return el;
        // unsauberer code, build und append trennen eventl?
        var li = document.createElement('li');
        li.appendChild(root);
        parent.appendChild(li);
        //console.log("__builder__",root, topic);
        console.log("__builder__", li);
    }
    HtmlBuilder.buildArticle = buildArticle;
})(HtmlBuilder = exports.HtmlBuilder || (exports.HtmlBuilder = {}));
/*


      var list = document.getElementById("result_sample_list");
      var sample = document.getElementById("result_sample");
      
      var topic_list = document.getElementById("select_topic_list");
      
      for (var i=0; i< 0; i++){ //bug
         var el = sample.cloneNode(true); // bug overwritten by ts
         list.appendChild(el);
         //jl.log("This post was\n","err");
         //jl.log(i,"msg");
         //cs.log(i);
      }
      // bug get sources todo !!
      for (var i=0; i< 15; i++){
         var el =  (<Node> document.createElement('li')  );
         var text_node = document.createTextNode("Topic "+i) ;
         el.appendChild( text_node );
         topic_list.appendChild(el);
         //cs.log(i);
         // bug errof of typescript ??
      }
      //
      
  */
},{}],4:[function(require,module,exports){
"use strict";
var Ajax_1 = require("./Ajax");
var FilterOptions_1 = require("./FilterOptions");
var HtmlBuilder_1 = require("./HtmlBuilder");
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
                var list = document.getElementById("result_sample_list");
                //var sample = (<Node> document.getElementById("result_sample") );
                console.log(list);
                HtmlBuilder_1.HtmlBuilder.buildArticle(article, list);
            }
        }
    })
        .fail(function () {
        console.log(cs_log_ajax_hint, "Sending request failed!");
    });
    cs.log("hi ------ ");
    //cs.get("res").innerHTML = greeter.greet();
    var list = document.getElementById("result_sample_list");
    var sample = document.getElementById("result_sample");
    var topic_list = document.getElementById("select_topic_list");
    for (var i = 0; i < 0; i++) {
        var el = sample.cloneNode(true); // bug overwritten by ts
        list.appendChild(el);
    }
    // bug get sources todo !!
    var topic_set = [];
    topic_set = ["topic 1", "topic 2", "topic 3"];
    var cs_log_ajax_hint_1 = "______new_ajax____";
    Ajax_1.Ajax.getMetadata()
        .done(function (result) {
        if (result.errorMessage !== null) {
            console.log(cs_log_ajax_hint_1, result.errorMessage);
        }
        else {
            console.log(cs_log_ajax_hint_1, "New Articles received:");
            console.log(result); //.articles);
        }
    })
        .fail(function () {
        console.log(cs_log_ajax_hint_1, "Sending request failed!");
    });
    for (var i = 0; i < topic_set.length; i++) {
        var topicName = topic_set[i];
        var el = document.createElement('li');
        var text_node = document.createTextNode(topicName);
        el.appendChild(text_node);
        topic_list.appendChild(el);
    }
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
    //repeat this each 0.25 second !! bug todo refac
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
},{"./Ajax":1,"./FilterOptions":2,"./HtmlBuilder":3}],5:[function(require,module,exports){

},{}]},{},[4,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBLElBQWMsSUFBSSxDQWdEakI7QUFoREQsV0FBYyxJQUFJLEVBQUMsQ0FBQztJQUNoQixnREFBZ0Q7SUFDbkQsSUFBTSxPQUFPLEdBQVcsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0lBQzFELElBQU0sZ0JBQWdCLEdBQVcsVUFBVSxHQUFHLGFBQWEsQ0FBQztJQUM1RCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FB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Q0FBQztJQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQixPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFakMsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTtRQUNuQyw2RkFBNkY7UUFDN0YseUJBQXlCO1FBQ3pCLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFDLHNCQUFzQixDQUFDO0lBYXZDLENBQUM7SUFFRCxrQkFBa0I7SUFDbEI7Ozs7TUFJRTtJQUVGLHFDQUFxQztJQUNyQyxzQ0FBc0M7SUFHdEM7Ozs7OztNQU1FO0lBQ0Y7Ozs7O01BS0U7SUFDSTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0JKO0lBRUYsNkRBQTZEO0FBRWhFLENBQUM7QUFFRCw0QkFBNEI7QUFFNUIsb0JBQW9CO0FBRXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZCRTs7QUNqYUwiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcblxyXG5kZWNsYXJlIHZhciBjb250ZXh0VXJsOiBzdHJpbmc7XHJcblxyXG5leHBvcnQgbW9kdWxlIEFqYXgge1xyXG4gICAgLy92YXIgY29udGV4dFVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL0NXQS9cIjtcclxuXHRjb25zdCB1cmxCYXNlOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRBcnRpY2xlcy9zZWFyY2hcIjtcclxuXHRjb25zdCB1cmxCYXNlX21ldGFkYXRhOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRNZXRhZGF0YVwiO1xyXG5cdGNvbnN0IGhlYWRlcnMgPSB7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uLCovKjtxPTAuOFwiIH07XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVF1ZXJ5KHF1ZXJ5OiBTdHJpbmcsIGZpbHRlcnM6IEZpbHRlck9wdGlvbnMsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJxdWVyeT1cIiArIHF1ZXJ5KTtcclxuXHJcblx0XHRsZXQgZmlsdGVyUGFyYW1zOiBzdHJpbmcgPSBmaWx0ZXJzLnRvVXJsUGFyYW0oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19cIixmaWx0ZXJQYXJhbXMpO1xyXG5cdFx0aWYgKGZpbHRlclBhcmFtcyAhPT0gXCJcIikgcGFyYW1zLnB1c2goZmlsdGVyUGFyYW1zKTtcclxuXHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2UgKyBcIj9cIiArIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEoKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2VfbWV0YWRhdGEgO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlTaW1pbGFyKGFydGljbGVJZDogU3RyaW5nLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0Ly8gVE9ET1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIEZpbHRlck9wdGlvbnMge1xyXG5cclxuXHR0b3BpY3M6IHN0cmluZ1tdID0gW107XHJcblx0c291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgIFxyXG4gICAgZnJvbURhdGU6IHN0cmluZyA9IFwiMTk4MC0wMS0wMVwiO1xyXG5cdHRvRGF0ZTogc3RyaW5nID0gXCIyMDIwLTAxLTAxXCI7IC8vIGJ1ZyAsIGJldHRlciBkZWZhdWx0cyA/IFxyXG4gICAgXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnQgZmlsdGVyIG9wdGlvbnMgdG8gdXJsIHBhcmFtZXRlciBzdHJpbmcgb2YgZm9ybWF0XHJcblx0ICogXCJwYXJhbTE9dmFsdWUxJnBhcmFtMj12YWx1ZTImcGFyYW00PXZhbHVlM1wiIGZvciB1c2UgYXMgdXJsIHBhcmFtZXRlcnMuXHJcblx0ICovXHJcblx0dG9VcmxQYXJhbSgpOiBzdHJpbmcge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50b3BpY3MubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInRvcGljcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnRvcGljcykpO1xyXG5cdFx0aWYgKHRoaXMuc291cmNlcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwic291cmNlcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnNvdXJjZXMpKTtcclxuXHRcdGlmICh0aGlzLmZyb21EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcImZyb209XCIgKyB0aGlzLmZyb21EYXRlKTtcclxuXHRcdGlmICh0aGlzLnRvRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJ0bz1cIiArIHRoaXMudG9EYXRlKTtcclxuXHJcblx0XHRyZXR1cm4gcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjb25jYXRNdWx0aVBhcmFtKGFycmF5OiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYXJyYXkuam9pbihcIjtcIik7XHJcblx0fVxyXG59XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZUVsZW0oZWxOYW1lOnN0cmluZywgY2xzTmFtZTpzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHZhciB0bXAgPSAoPEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxOYW1lKSAgKTtcclxuICAgICAgICB0bXAuY2xhc3NMaXN0LmFkZChjbHNOYW1lKTtcclxuXHRcdHJldHVybiB0bXA7XHJcblx0fVxyXG5cclxuZnVuY3Rpb24gYWRkVGV4dChwYXJlbnQgOiBhbnksdHh0IDogc3RyaW5nKXtcclxuICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpICApO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCggdG1wICk7XHJcblx0XHQvL3JldHVybiB0bXA7XHJcblx0fVxyXG4gICAgXHJcbiAgICBcclxuXHJcbmV4cG9ydCBtb2R1bGUgSHRtbEJ1aWxkZXJ7XHJcblxyXG5cclxuICAgIFxyXG5cdC8qKlxyXG5cdCAqIEJ1aWxkIGh0bWwgbGkgZWxlbWVudCBmcm9tIGFydGljbGUgb2JqZWN0XHJcblx0ICoga2trXHJcblx0ICovXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQXJ0aWNsZShhcnRpY2xlIDogYW55LCBwYXJlbnQgOiBhbnkpe1xyXG4gICAgXHJcbiAgICAgICAgLy92YXIgdG1wX2NsZWFyZml4ID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJvb3QgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJyZXN1bHRcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB0b3BpYyA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNvbnRhaW5lcl90b3BpY1wiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BpY19idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIHRvcGljX2J1dHRvbiwgYXJ0aWNsZS50b3BpYyApO1xyXG4gICAgICAgICAgICB0b3BpYy5hcHBlbmRDaGlsZCh0b3BpY19idXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIHRvcGljICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIikgKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gY3JlYXRlRWxlbShcImRpdlwiLFwidGl0bGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9IGFydGljbGUudXJsO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggYSwgYXJ0aWNsZS50aXRsZSApO1xyXG4gICAgICAgICAgICB0aXRsZS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCB0aXRsZSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbGluayA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImxpbmtcIik7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBsaW5rLCBhcnRpY2xlLnVybCApOyAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggbGluayApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNvbnRhaW5lcl9kYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZV9kYXRlID0gY3JlYXRlRWxlbShcInNwYW5cIixcImRhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmF3X2RhdGUgPSBhcnRpY2xlLnB1YkRhdGU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vYnVnIHN1YnN0ciBvdGhlciBiZWhhdmlvdXIgdGhhbiBzdWJzdHJpbmdcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlX3kgPSByYXdfZGF0ZS5zdWJzdHJpbmcoMCw0KTtcclxuICAgICAgICAgICAgICAgIC8vIGhlcmUgZmlyZWZveCBqcyBicm93c2VyIGJ1ZyBvbiBzdWJzdHIoNSw3KVxyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVfbSA9IHJhd19kYXRlLnN1YnN0cmluZyg1LDcpLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlX2QgPSByYXdfZGF0ZS5zdWJzdHJpbmcoOCwxMCkucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRfZGF0ZSA9IGRhdGVfZCArIFwiLlwiICsgZGF0ZV9tICsgXCIuXCIgKyBkYXRlX3lcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGRhdGVfZGF0ZSwgZm9ybWF0dGVkX2RhdGUgKTtcclxuICAgICAgICAgICAgICAgIGRhdGVfYnV0dG9uLmFwcGVuZENoaWxkKGRhdGVfZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAvL3ZhciBkYXRlX3RpbWUgPSBjcmVhdGVFbGVtKFwic3BhblwiLFwidGltZVwiKTtcclxuICAgICAgICAgICAgICAgIC8vZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV90aW1lKTtcclxuICAgICAgICAgICAgZGF0ZS5hcHBlbmRDaGlsZChkYXRlX2J1dHRvbik7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChkYXRlKTtcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjbGVhcmZpeFwiKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBjb250ZW50LCBhcnRpY2xlLmV4dHJhY3RlZFRleHQuc3Vic3RyaW5nKDAsMzAwKSk7ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBjb250ZW50ICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBhdXRob3IgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJhdXRob3JcIik7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBhdXRob3IsIGFydGljbGUuYXV0aG9yICk7ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBhdXRob3IgKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBpbWcgc3JjPVwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY29udGFpbmVyX2J1dHRvbnMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjb250YWluZXJfYnV0dG9uc1wiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGJ1ZyByZWZhYyB0b2RvLCBoZXJlIGF1ZmtsYXBwZW4gbGFuZ2VyIHRleHQgIVxyXG4gICAgICAgICAgICB2YXIgY2FjaGVfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9IFwiI2NhY2hlX2lkXzExMjMyNDNcIjtcclxuICAgICAgICAgICAgICAgIHZhciBpbWcgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7Ly9cIlwiO1xyXG4gICAgICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggYSwgXCJDYWNoZVwiICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FjaGVfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICBjb250YWluZXJfYnV0dG9ucy5hcHBlbmRDaGlsZChjYWNoZV9idXR0b24pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBzaW1pbGFyX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSBcIiNzaW1pbGFyX2lkXzExMjMyNDNcIjtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGEsIFwiU2ltaWxhclwiICk7XHJcbiAgICAgICAgICAgIHNpbWlsYXJfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKHNpbWlsYXJfYnV0dG9uKTtcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBjb250YWluZXJfYnV0dG9ucyApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIF90bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSAgKTsgLy86IGFueTtcclxuICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGtpYyBra1wiKSA7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgIF90bXAuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixfdG1wKTtcclxuXHRcdC8vcGFyZW50LmFwcGVuZENoaWxkKF90bXApO1xyXG4gICAgICAgIC8vcmV0dXJuIGVsO1xyXG4gICAgICAgIC8vIHVuc2F1YmVyZXIgY29kZSwgYnVpbGQgdW5kIGFwcGVuZCB0cmVubmVuIGV2ZW50bD9cclxuICAgICAgICB2YXIgbGkgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblx0XHRwYXJlbnQuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLHJvb3QsIHRvcGljKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsbGkpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgXHJcblxyXG59XHJcblxyXG4vKlxyXG5cclxuXHJcbiAgICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgdG9waWNfbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0X3RvcGljX2xpc3RcIik7XHJcbiAgICAgIFxyXG4gICAgICBmb3IgKHZhciBpPTA7IGk8IDA7IGkrKyl7IC8vYnVnXHJcbiAgICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgLy9qbC5sb2coXCJUaGlzIHBvc3Qgd2FzXFxuXCIsXCJlcnJcIik7XHJcbiAgICAgICAgIC8vamwubG9nKGksXCJtc2dcIik7XHJcbiAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGJ1ZyBnZXQgc291cmNlcyB0b2RvICEhXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMTU7IGkrKyl7XHJcbiAgICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGljIFwiK2kpIDtcclxuICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgICAgIC8vIGJ1ZyBlcnJvZiBvZiB0eXBlc2NyaXB0ID8/XHJcbiAgICAgIH1cclxuICAgICAgLy9cclxuICAgICAgXHJcbiAgKi9cclxuXHJcbiIsImltcG9ydCB7QWpheH0gZnJvbSBcIi4vQWpheFwiO1xyXG5pbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuaW1wb3J0IHtIdG1sQnVpbGRlcn0gZnJvbSBcIi4vSHRtbEJ1aWxkZXJcIjtcclxuXHJcbmNsYXNzIEFydGljbGVSZXN1bHQge1xyXG5cdGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG5cdGFydGljbGVzOiBhbnlbXTsgLy8gVE9ETyBkZWZpbmUgQXJ0aWNsZSB3aGVuIEFydGljbGUgc2VydmVyIGNsYXNzIGlzIHN0YWJsZVxyXG59XHJcblxyXG4gICAvL2RlY2xhcmUgdmFyICQ7IGJ1ZywgcGxhY2UgdGhpcyBpbiBkZWZpbml0b24gZmlsZT8sIGhvdyB0byBlbWJlZCBvdGhlciBqcyBkb2NzPT9cclxuXHJcbiAgIHZhciByZXN1bHQgPSB7IFxyXG4gICAgICBcImNhcmRzXCI6IFtcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICBcImFjdGlvblwiOiB7XHJcbiAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIlNvdXJjZVwiLFxyXG4gICAgICAgICAgICAgICBcImpvYlwiOiBcIlRoaXMgaXMgYSBqb2JcIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9LFxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUG91cmNlXCIsXHJcbiAgICAgICAgICAgICAgIFwiam9iXCI6IFwiVGhpcyBpcyBhIGpvaW5cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9LFxyXG4gICAgICBdXHJcbiAgIH07XHJcbiAgIFxyXG4gICBcclxuXHJcbiAgIGNsYXNzIE15Q29uc29sZSB7XHJcbiAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgbG9nKHMgOiBzdHJpbmcpIHtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiK3MpO1xyXG4gICAgICAgfVxyXG4gICAgICAgZ2V0KGlkIDogc3RyaW5nKXtcclxuICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICBjbGFzcyBTZXJ2ZXJDb25uZWN0aW9uIHtcclxuICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICBwb3N0KHM6IHN0cmluZykge1xyXG4gICAgICAgICAgIGNzLmxvZyhcIlwiK3MpO1xyXG4gICAgICAgICAgIGpsLmxvZyhcInBvc3Q6IFwiK3MsIFwibnRmXCIpO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICBcclxuICAgY2xhc3MgSnNMb2cge1xyXG4gICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgIGxvZyhzOnN0cmluZyxzdGF0dXNfbmFtZTpzdHJpbmcpIHtcclxuICAgICAgICAgLy8janNvbj8/IEZGOTgzOFxyXG4gICAgICAgICB2YXIgc3RhdHVzID0gW1wiZXJyXCIsIFwibXNnXCIsIFwibnRmXCIgXTtcclxuICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5ID0gW1wiRXJyb3JcIiwgXCJNZXNzYWdlXCIsIFwiTm90aWZpY2F0aW9uXCIgXTtcclxuICAgICAgICAgdmFyIGNvbG9ycyA9IFtcIkZGNjE1OVwiLCBcIkZGOUY1MVwiLFwiMjJCOEVCXCIsXCJcIixcIlwiIF07IFxyXG4gICAgICAgICAvLyAgICAgICAgICAgICBvcmFuZ2UgIFxyXG4gICAgICAgICAgICB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgLy9pbiBjb25zdHJ1Y3RvciByZWluXHJcbiAgICAgICAgICAgIHZhciBjb2xfaWQgPSBzdGF0dXMuaW5kZXhPZihzdGF0dXNfbmFtZSk7XHJcbiAgICAgICAgICAgIC8vIGFsbGVydCByYXNpZSBidWcgLCBlcnJvIHJpZiBjb2xfaWQgPCAwXHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheV9uYW1lID0gc3RhdHVzX2Rpc3BsYXlbY29sX2lkXVxyXG4gICAgICAgICAgICBzID0gcy5yZXBsYWNlKFwiXFxuXCIsXCI8YnI+XCIpO1xyXG4gICAgICAgICAgICBzID0gc3RhdHVzX2Rpc3BsYXlfbmFtZSArIFwiXFxuXFxuXCIgKyBzO1xyXG4gICAgICAgICAgICB2YXIgdHh0ID0gcy5yZXBsYWNlKFwiXFxuXCIsXCI8YnI+PGJyPlwiKTtcclxuICAgICAgICAgICAgamwuaW5uZXJIVE1MID0gdHh0O1xyXG4gICAgICAgICAgICAvL2psLnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI1wiK2NvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgICAgICBqbC5zdHlsZS5ib3JkZXJDb2xvciA9IFwiI1wiK2NvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgfVxyXG4gICAgICAgZ2V0KGlkIDogc3RyaW5nKXtcclxuICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgfVxyXG4gICB9O1xyXG4gICBcclxuXHJcbiAgIC8vdmFyIGdyZWV0ZXIgPSBuZXcgR3JlZXRlcihcIkhlbGxvLCB3b3JsZCFcIik7XHJcbiAgIC8vIEV4Y2F0IG9yZGVyIG9mIHRoZXNlIG5leHQgY29tbWFuZHMgaXMgaW1wb3J0YW50IFxyXG4gICB2YXIgY3MgPSBuZXcgTXlDb25zb2xlKCk7ICAgIFxyXG4gICB2YXIgamwgPSBuZXcgSnNMb2coKTtcclxuICAgdmFyIGNvbm4gPSBuZXcgU2VydmVyQ29ubmVjdGlvbigpO1xyXG4gICAvLyB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgYnVnIHdoeSBub3QgaGVyZSBnbG9iYWxcclxuICAgLypcclxuICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cyAxJyk7XHJcbiAgICB9KTtcclxuICAgIHdpbmRvdy5vbmxvYWRcclxuICAgICovXHJcbiAgICBcclxuICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHsgXHJcbiAgICAgICAgICAgIC8vdmFyIGsgPSBcImtqXCI7XHJcbiAgICAgICAgICAgIG9uX2xvYWQoKTtcclxuICAgICAgICB9KTtcclxuIHZhciBnbG9iYWxfZmlsdGVyT3B0aW9ucyA6IGFueTsgXHJcbiBmdW5jdGlvbiBvbl9sb2FkKCl7XHJcbiAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucyA9IG5ldyBGaWx0ZXJPcHRpb25zKCk7XHJcbiAgICB2YXIgY3NfbG9nX2FqYXhfaGludCA9IFwiX19fYWpheF9fXyBcIjtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvcGljcy5wdXNoKFwiUG9saXRpY3NcIik7XHJcbiAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy5zb3VyY2VzLnB1c2goXCJjbm5cIik7XHJcbiAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b0RhdGUgPSBcIjIwMTYtMTItMjVcIjtcclxuICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBcIjIwMDAtMTItMjVcIjtcclxuICAgIEFqYXguZ2V0QnlRdWVyeShcIlRpZ2VyIFdvb2RzXCIsIGdsb2JhbF9maWx0ZXJPcHRpb25zLCAwLCAxMClcclxuICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IEFydGljbGVSZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQscmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LGFydGljbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuYXV0aG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3ZhciBzYW1wbGUgPSAoPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxCdWlsZGVyLmJ1aWxkQXJ0aWNsZShhcnRpY2xlLGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCxcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY3MubG9nKFwiaGkgLS0tLS0tIFwiKTtcclxuICAgICAgLy9jcy5nZXQoXCJyZXNcIikuaW5uZXJIVE1MID0gZ3JlZXRlci5ncmVldCgpO1xyXG4gICAgICBcclxuICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMDsgaSsrKXsgLy9idWdcclxuICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2psLmxvZyhcIlRoaXMgcG9zdCB3YXNcXG5cIixcImVyclwiKTtcclxuICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgdmFyIHRvcGljX3NldCA6IGFueSA9IFtdO1xyXG4gICAgICB0b3BpY19zZXQgPSBbXCJ0b3BpYyAxXCIsXCJ0b3BpYyAyXCIsXCJ0b3BpYyAzXCJdO1xyXG4gICAgICBcclxuICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fX19uZXdfYWpheF9fX19cIjtcclxuICAgICAgQWpheC5nZXRNZXRhZGF0YSgpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEscmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsXCJOZXcgQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTsvLy5hcnRpY2xlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIFxyXG4gICAgICBmb3IgKHZhciBpPTA7IGk8IHRvcGljX3NldC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIHRvcGljTmFtZSA9IHRvcGljX3NldFtpXTtcclxuICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b3BpY05hbWUpIDtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMTU7IGkrKyl7XHJcbiAgICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGljIFwiK2kpIDtcclxuICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgICAgIC8vIGJ1ZyBlcnJvZiBvZiB0eXBlc2NyaXB0ID8/XHJcbiAgICAgIH1cclxuICAgICAgLy8qL1xyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gZWxlbWVudF9zZXRfZGlzcGxheShpZCA6IHN0cmluZywgdmFsIDogc3RyaW5nKXtcclxuICAgICAgICAgdmFyIGVsID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSAgKTtcclxuICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbDtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBlbGVtZW50X3Nob3coaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcImJsb2NrXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfaGlkZShpZCA6IHN0cmluZyl7XHJcbiAgICAgICAgIC8vY2hlY2sgc3RhdHVzPyByYWlzZSBlcnJvciBpZiBoaWRkZW4/XHJcbiAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY3JlYXRlKGlkIDogc3RyaW5nLHRleHQgOiBzdHJpbmcpe1xyXG4gICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICAgdmFyIGUgPSAoPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIikgICk7XHJcbiAgICAgICAgIGUuaWQgPSBcInNwYW5faGlkZGVuX1wiK2lkO1xyXG4gICAgICAgICBlLmNsYXNzTmFtZSA9IFwic3Bhbl9oaWRkZW5cIjtcclxuICAgICAgICAgZS5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgICAgICBlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZSk7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2RlbGV0ZShpZCA6IHN0cmluZyl7XHJcbiAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZCA6IHN0cmluZyx0ZXh0IDogc3RyaW5nKXtcclxuICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG4gICAgICAgICAvL2VsLmdldEVsZW1lbnRCeUlkKFwic3Bhbl9oaWRkZW5fXCIraWQpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgLy8gV2VubiBrZWluIEhpZGRlbiBTcGFuIGRhLCBkYW5uIHdlcnQgaW1tZXIgZmFsc2NoISFcclxuICAgICAgICAgLy9idWcgYXNzdW1lcyBqdXN0IG9uZSBjbGFzIHJhaXNlIHdhcm5pZ24gaWYgbW9yZSBjbGFzc2VzICEhICwgY2xlYXJlZCwgYnkgY2hlY2sgbGVuZ2h0ID09IDFcclxuICAgICAgICAgaWYgKCBzcGFuX2xpc3QubGVuZ3RoPT0xICl7XHJcbiAgICAgICAgICAgIHZhciBzcGFuID0gc3Bhbl9saXN0WzBdO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFuLmlubmVySFRNTCwgdGV4dCk7XHJcbiAgICAgICAgICAgIGJvb2wgPSAoIFwiXCIrdGV4dCA9PSBcIlwiK3NwYW4uaW5uZXJIVE1MICk7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIGNzLmxvZyhcIlwiK2Jvb2wpO1xyXG4gICAgICAgICByZXR1cm4gYm9vbDtcclxuICAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2tleXdvcmRzKGVsOiBhbnkpeyBcclxuICAgICAgICAgdmFyIGZsZF9zZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIik7XHJcbiAgICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgIGNvbm4ucG9zdChrZXl3b3Jkcyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2ZpbHRlcihlbCA6IGFueSl7IC8vIGJ1ZyBrZXkgbm90IHVzZWRcclxuICAgICAgICAgdmFyIGNoZWNrID0gc3Bhbl9oaWRkZW5fY2hlY2soXCJmaWx0ZXJfc2V0dGluZ3NcIixcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgIGlmIChjaGVjayl7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfaGlkZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgc3Bhbl9oaWRkZW5fZGVsZXRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIGNsb3NpbmcuXCIsXCJudGZcIik7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50X3Nob3coXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgIHNwYW5faGlkZGVuX2NyZWF0ZShcImZpbHRlcl9zZXR0aW5nc1wiLFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBvcGVuaW5nLlwiLFwibnRmXCIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIC8vc2hvdyBoaWRlLCBub3QgdG9nZ2xlICEhXHJcbiAgICAgIH1cclxuICAgICAgdmFyIGRhdGVfc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgIHZhciBkYXRlX3N0YXJ0X3N0ciA9ICAoPEhUTUxJbnB1dEVsZW1lbnQ+IGRhdGVfc3RhcnQpLnZhbHVlLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgICB2YXIgZGF0ZV9zdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZV9zdGFydF9zdHIpO1xyXG4gICAgICBjcy5sb2coXCJcIitkYXRlX3N0YXJ0X2RhdGUpO1xyXG4gICAgICBjcy5sb2coZGF0ZV9zdGFydF9kYXRlLnRvU3RyaW5nKCkpO1xyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gY2hlY2tfdXJsX25hbWUoZXZlbnQgOiBhbnkpe1xyXG4gICAgICAgICAvL3ZhciB1cmxfbmFtZSA9IHdpbmRvdy5sb2NhdGlvbjsvLy5wYXRobmFtZTtcclxuICAgICAgICAgLy9jcy5sb2codXJsX25hbWUpO1xyXG4gICAgICAgICB2YXIgdXJsX2hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDsvLy5wYXRobmFtZTtcclxuICAgICAgICAgY29uc29sZS5sb2codXJsX2hhc2gpOyAvLyBkb2VzIG5vdCB3b3JrIGluIGllPz8gISEhXHJcbiAgICAgICAgIHZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIiA7XHJcbiAgICAgICAgIGlmICh1cmxfaGFzaC5pbmRleE9mKFwiI1wiK2tleSkgPT0gMCl7XHJcbiAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihrZXkpO1xyXG4gICAgICAgICAgICBjcy5sb2coa2V5KTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICAvL2lmICNzZWFyY2hfZmlsdGVyIGluIHVybF9oYXNoXHJcbiAgICAgICAgIC8vbXVsdGlmbGFnX2xhc3RfaGFzaCA9IHNlYXJjaF9maWx0ZXIuLi5cclxuICAgICAgICAgLy9zaG93IGZpbGV0ZXIsIHNlYWNoIGtleXdvcmRzLCBzaG93IGNhY2hlIChncmV5LCBibHVlLCBibGFjayBhbmQgd2hpdGUsIHRoZW1lIGFsbCBuZXcgY2FjaGUsIGRvIHBvc3QgcmVxLilcclxuICAgICAgICAgLy8gaWYga2V5d29yZHMsIHBvc3QgYWN0aW9uID0gc2VyYWNoIHN1YmFjdGlvbiA9IGtleXdvcmRzIGRhdGEgPSBrZXl3b3JkcyBhcnJheSwgb3IgY2FjaGVfaWQgcmVxdWVzdCBpbmZvcy4uLiwgXHJcbiAgICAgICAgIC8vIHRoZW4gc2hvdywgcG9zdCB1cGRhdGUgZ3JleSBhcmUgcHJvZ3Jlc3MgYmFyLCBmaWx0ZXIgaW5mb3MgZ2V0IGxvY2FsIHN0b3JhZ2UgZmlsdGVyc19fLi4sIGdldCBmaWx0ZXJzIGZyb20gcGFnZT8gbWFya2VkIChzcGFuIG1hcmtlLCByZWFsIHZhbHVlLCBkaXNwbGF5Li4uXHJcbiAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBwcm9jZXNzX2NsaWNrX29yX2VudGVyKGV2IDogYW55KXtcclxuICAgICAgICAgY29uc29sZS5sb2coZXYpO1xyXG4gICAgICAgICBlbCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAvLyBiYWQgZ2l2ZXMgZnVsbCBocmVmIHdpdGggbGlua1xyXG4gICAgICAgICAvL3ZhciBocmVmID0gZWwuaHJlZjsgXHJcbiAgICAgICAgIC8vIG5pY2UsIGdpdmVzIHJhdyBocmVmLCBmcm9tIGVsZW1lbnQgb25seSAoIGUuZy4gI3NlYXJjaF9maWx0ZXIsIGluc3RlYWQgb2Ygd3d3Lmdvb2dsZS5jb20vI3NlYWNoX2ZpbHRlcilcclxuICAgICAgICAgdmFyIGhyZWYgPSAoPGFueT5lbCkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcclxuICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSk7XHJcbiAgICAgICAgIC8vdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgICAvL2tleSA9IFwiI1wiICsga2V5O1xyXG4gICAgICAgICAvKlxyXG4gICAgICAgICB2YXIgaXNfc2FtZSA9IChocmVmID09IGtleSkgO1xyXG4gICAgICAgICBpZiAoaXNfc2FtZSl7IC8vdXJsX2hhc2guaW5kZXhPZihcIiNcIitrZXkpID09IDBcclxuICAgICAgICAgfVxyXG4gICAgICAgICAqLyBcclxuICAgICAgICAgY29uc29sZS5sb2coXCJpbmZvIGhyZWYgc3dpdGhjLS1cIitocmVmK1wiLS1cIik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiYm9vbFwiLCBocmVmPT1cInNlYWNoX2ZpbHRlclwiLCBocmVmLCBcInNlYWNoX2ZpbHRlclwiICk7XHJcbiAgICAgICAgIHN3aXRjaChocmVmKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic2VhcmNoX2tleXdvcmRzXCI6XHJcbiAgICAgICAgICAgICAgIGZfc2VhcmNoX2tleXdvcmRzKGVsKTtcclxuICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIC8vZGVmYXVsdCBjb2RlIGJsb2NrXHJcbiAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgfSBcclxuICAgICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICAgICBjcy5sb2coXCIjIHNlbGVjdGlvbiB3YXMgLSBcIitocmVmKTtcclxuICAgICAgICAgY29uc29sZS5sb2coXCJocmVmXCIsaHJlZik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICAgLy9jcy5sb2coZWwuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSk7XHJcbiAgICAgIH1cclxuICAgICAgLy9yZXBlYXQgdGhpcyBlYWNoIDAuMjUgc2Vjb25kICEhIGJ1ZyB0b2RvIHJlZmFjXHJcbiAgICAgIHZhciBjb2xfYSA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkFcIikgICk7XHJcbiAgICAgIC8vdmFyIGxpc3RfYSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBjb2xfYSwgMCApO1xyXG4gICAgICB2YXIgbGlzdF9hOiBhbnkgPSBbXTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSBsaXN0X2EucHVzaChjb2xfYVtpXSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBcImxpXCIsIGxpc3RfYSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBcImxpXCIsIGNvbF9hLmxlbmd0aCk7XHJcbiAgICAgIFxyXG4gICAgICBmb3IodmFyIGk9MDtpPGNvbF9hLmxlbmd0aDtpKyspIHsgLy8gaWYgeW91IGhhdmUgbmFtZWQgcHJvcGVydGllc1xyXG4gICAgICAgICB2YXIgYW5jaCA9IGxpc3RfYVtpXTsgLy8gKDxhbnk+IHgpO1xyXG4gICAgICAgICAvLyB0b2RvIGJ1ZywgcmVmYWMsIGNoZWNrIGlmIGNsYXNzIGlzIG5vcm1hbCBsaW5rLCB0aGVuIGRvbnQgYWRkIGFueSBzcGVjaWFsIG9uY2xpY2sgaGFuZGxpbmdcclxuICAgICAgICAgLy9jb25zb2xlLmxvZyhcImlcIiwgYW5jaCk7XHJcbiAgICAgICAgIC8vdmFyIGFuY2ggPSAoPGFueT4gbGlzdF9hW2ldICApO1xyXG4gICAgICAgICBhbmNoLm9uY2xpY2s9cHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgLypmdW5jdGlvbigpey8qIHNvbWUgY29kZSAqIC9cclxuICAgICAgICAgICAgKCBhbmNoICk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgLy8gTmVlZCB0aGlzIGZvciBJRSwgQ2hyb21lID9cclxuICAgICAgICAgLyogXHJcbiAgICAgICAgIGFuY2gub25rZXlwcmVzcz1mdW5jdGlvbihlKXsgLy9pZSA/P1xyXG4gICAgICAgICAgICBpZihlLndoaWNoID09IDEzKXsvL0VudGVyIGtleSBwcmVzc2VkXHJcbiAgICAgICAgICAgICAgIHByb2Nlc3NfY2xpY2tfb3JfZW50ZXIoIGFuY2ggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvL3ZhciBhbmNoID0gbnVsbDtcclxuICAgICAgLypcclxuICAgICAgZm9yKHZhciB4IGluIHJlc3VsdCkgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgIGFuY2ggPSByZXN1bHRbeF07XHJcbiAgICAgIH1cclxuICAgICAgKi9cclxuICAgICAgXHJcbiAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuY2hvcklEJylcclxuICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5jaG9ySUQnKS5cclxuICAgICAgXHJcbiAgICAgICBcclxuICAgICAgLypcclxuICAgICAgaWYgKHdpbmRvdy5vbnBvcHN0YXRlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGNoZWNrX3VybF9uYW1lO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gY2hlY2tfdXJsX25hbWU7XHJcbiAgICAgIH1cclxuICAgICAgKi9cclxuICAgICAgLypcclxuICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAvL2NvbnNvbGUubG9nKFwibG9jYXRpb246IFwiICsgZG9jdW1lbnQubG9jYXRpb24gKyBcIiwgc3RhdGU6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXZlbnQuc3RhdGUpKTtcclxuICAgICAgICAgY2hlY2tfdXJsX25hbWUoKTtcclxuICAgICAgfTtcclxuICAgICAgKi9cclxuICAgICAgICAgICAgLypcclxuICAgICAgXHJcbiAgICAgICAgICAgIGJ1ZyBhZGQgc2VyYWNoIGJ1dHRvbiBzZWFyY2ggYnV0dG9uXHJcbiAgICAgIFxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHB1c2hVcmwgPSAoaHJlZikgPT4ge1xyXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgaHJlZik7XHJcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdwb3BzdGF0ZScpKTtcclxuICAgICAgfTtcclxuICAgICAgICAgICAgXHJcbiAgICAgIHZhciBkYXRlc3RyaW5nID0gJChcIiNkYXRlXCIpLnZhbCgpLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGVzdHJpbmcpO1xyXG4gICAgICAvL2RhdGUudG9zdHJpbmcoKSk7XHRcclxuICAgICAgdmFyIGVsZW1lbnRzX3NlbD0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI1Rlc3QsICNUZXN0IConKTtcclxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBhbGVydCgnSGVsbG8gd29ybGQgYWdhaW4hISEnKTtcclxuICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAqL1xyXG4gICAgICBcclxuICAgICAgLy8kKCcuc3lzIGlucHV0W3R5cGU9dGV4dF0sIC5zeXMgc2VsZWN0JykuZWFjaChmdW5jdGlvbigpIHt9KVxyXG5cclxuICAgfVxyXG4gICBcclxuICAgLy93aW5kb3cub25sb2FkID0gb25fbG9hZCgpO1xyXG4gICBcclxuICAgLy8jdHNjIC0td2F0Y2ggLXAganNcclxuICAgXHJcbiAgIC8qXHJcbiAgICAgIGNsZWFuIHVwIGpzLCB0c1xyXG4gICAgICAtIG9uIGVudGVyIHNlYXJjaCwgYWR2YW5jZWQgc2VhcmNoXHJcbiAgICAgIC0gb2ZmZXIgZGF0ZSByYW5nZVxyXG4gICAgICAtIG9mZmVyIHRoZW1lcy90b3BpY3NcclxuICAgICAgLSBvZmZlciBsdXBlIHNob3csIHVzZSBiYWNrcm91bmcgaW1hZ2U/PyBiZXR0ZXIsIGJlY2F1c2UgY3NzIGNoYW5nZWJhclxyXG4gICAgICAtIG9uY2xpY2sgYSBocmVmIG9wZW4gY2FjaGUsIHNlYXJjaCBzaW1pbGFyIChpbnRlcnZhbGwgZ2V0IG5ldyB1cmwpLCBldmVudCBuZXcgcGFnZT8gb25wYWdlbG9hZD9cclxuICAgICAgLSBvbiBcclxuICAgICAgLSBzZW5kIHBvc3QgY2xhc3MsIGJpbmQgY2xpY2tzIC4uLlxyXG4gICAgICAtIEZpbHRlciBieSB0b3BpYywgYnkgZGF0ZVxyXG4gICAgICAtIGJ1dHRvbiAsIGJhbm5lciAsIHByb2dyZXNzIGJhciBmb3Igc2VhcmNoLCBzaG93IHBvc3QgaW5mbyAhIVxyXG4gICAgICAtIGZhdm9yaXRlIHRvcGljcyBpbiBzZXBhcnRlL2ZpcnN0IGxpbmUgKHdyaXRlIG15IGZhdm9yaXRlcz0gPyBvciBub3QpXHJcbiAgICAgIFxyXG4gICAgICAtIHRvcGljcyB5YSA8YT4gZm9yIGtleW1vdmVcclxuICAgICAgLSB0ZXN0IGV2ZXJ5dGhpbmcga2V5bW92ZVxyXG4gICAgICAtIGZpbHRlciwgbHVwZSBrZXltb3ZlIGNvbG9yXHJcbiAgICAgIFxyXG4gICAgICAtIGJ1ZyBhZGQgc2VyYWNoIGJ1dHRvbiBzZWFyY2ggYnV0dG9uXHJcbiAgICAgIFxyXG4gICAgICAtIGZpbHRlciBhZGQgPCA8IF5hcnJvdyBkb3duIGRhenUgYXVma2xhcHAgYXJyb3cgISFcclxuICAgICAgLSBqc29uIHRvIGh0bWwgZm9yIHJlc3VsdCAhIVxyXG4gICAgICAtIHBvcHN0YXRlIGlvLCBJRSA/PyBcclxuICAgICAgXHJcbiAgICAgIC0gcGFyc2UgZGF0ZSwgdG9waWMgb24gc2VydmVyIGZvciB2YWxpZGF0aW5nICEhXHJcbiAgICAgIC0gbWFyayB1c2Ugb2Ygb3RoZXIgYXV0aG9yIGxpYnJhcmllcyAhISBmb3IgZGF0ZSAhISwgXHJcbiAgICAgIC0gY2xvc2UgZmlsdGVyIHggKGhpZGUgZmlsZGVyIC8gc3ltYm9sUD8pXHJcbiAgICAgIFxyXG4gICAgICBhcHBseSBmaWx0ZXJcclxuICAgXHJcbiAgICovXHJcbiAgIFxyXG4gICAiLCIiXX0=
