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
        var content_cache = createElem("div", "content_cache");
        addText(content_cache, article.extractedText);
        root.appendChild(content_cache);
        var author = createElem("div", "author");
        addText(author, article.author);
        root.appendChild(author);
        // img src="/CWA/resources/img/cache_arrow_down_small_grey.png";
        var container_buttons = createElem("div", "container_buttons");
        // bug refac todo, here aufklappen langer text !
        var cache_button = createElem("div", "myButton");
        var a = document.createElement('a');
        a.href = "#cache_id_" + article.articleId_str;
        var img = document.createElement('img');
        img.src = "/CWA/resources/img/cache_arrow_down_small_grey.png"; //"";
        a.appendChild(img);
        addText(a, "Cache");
        cache_button.appendChild(a);
        container_buttons.appendChild(cache_button);
        var similar_button = createElem("div", "myButton");
        var a = document.createElement('a');
        a.href = "#similar_id_" + article.articleId_str; //1123243
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
/*
 *@auhor dbeckstein, jfranz
 */
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
    var cs_log_ajax_hint_1 = "____new_ajax____";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBLElBQWMsSUFBSSxDQWdEakI7QUFoREQsV0FBYyxJQUFJLEVBQUMsQ0FBQztJQUNoQixnREFBZ0Q7SUFDbkQsSUFBTSxPQUFPLEdBQVcsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0lBQzFELElBQU0sZ0JBQWdCLEdBQVcsVUFBVSxHQUFHLGFBQWEsQ0FBQztJQUM1RCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FB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QUFvQixDQUFDLEdBQUcsQ0FBSSxDQUFDO0lBQ3pELHNEQUFzRDtJQUN0RCxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUM7SUFDckIsR0FBRyxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWpDLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWE7UUFDbkMsNkZBQTZGO1FBQzdGLHlCQUF5QjtRQUN6QixpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBQyxzQkFBc0IsQ0FBQztJQWF2QyxDQUFDO0FBQ0osQ0FBQztBQUVFLGtCQUFrQjtBQUNsQjs7OztFQUlFO0FBRUYscUNBQXFDO0FBQ3JDLHNDQUFzQztBQUd0Qzs7Ozs7O0VBTUU7QUFDRjs7Ozs7RUFLRTtBQUNJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQko7QUFFRiw2REFBNkQ7QUFHaEUsNEJBQTRCO0FBRTVCLG9CQUFvQjtBQUVwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE2QkU7O0FDcmFMIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuICAgIC8vdmFyIGNvbnRleHRVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9DV0EvXCI7XHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9tZXRhZGF0YTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0TWV0YWRhdGFcIjtcclxuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlRdWVyeShxdWVyeTogU3RyaW5nLCBmaWx0ZXJzOiBGaWx0ZXJPcHRpb25zLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicXVlcnk9XCIgKyBxdWVyeSk7XHJcblxyXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fXCIsZmlsdGVyUGFyYW1zKTtcclxuXHRcdGlmIChmaWx0ZXJQYXJhbXMgIT09IFwiXCIpIHBhcmFtcy5wdXNoKGZpbHRlclBhcmFtcyk7XHJcblxyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUlxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKCk6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlX21ldGFkYXRhIDtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5U2ltaWxhcihhcnRpY2xlSWQ6IFN0cmluZywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdC8vIFRPRE9cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBGaWx0ZXJPcHRpb25zIHtcclxuXHJcblx0dG9waWNzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdHNvdXJjZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGZyb21EYXRlOiBzdHJpbmcgPSBcIjE5ODAtMDEtMDFcIjtcclxuXHR0b0RhdGU6IHN0cmluZyA9IFwiMjAyMC0wMS0wMVwiOyAvLyBidWcgLCBiZXR0ZXIgZGVmYXVsdHMgPyBcclxuICAgIFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0IGZpbHRlciBvcHRpb25zIHRvIHVybCBwYXJhbWV0ZXIgc3RyaW5nIG9mIGZvcm1hdFxyXG5cdCAqIFwicGFyYW0xPXZhbHVlMSZwYXJhbTI9dmFsdWUyJnBhcmFtND12YWx1ZTNcIiBmb3IgdXNlIGFzIHVybCBwYXJhbWV0ZXJzLlxyXG5cdCAqL1xyXG5cdHRvVXJsUGFyYW0oKTogc3RyaW5nIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMudG9waWNzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJ0b3BpY3M9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy50b3BpY3MpKTtcclxuXHRcdGlmICh0aGlzLnNvdXJjZXMubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInNvdXJjZXM9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy5zb3VyY2VzKSk7XHJcblx0XHRpZiAodGhpcy5mcm9tRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJmcm9tPVwiICsgdGhpcy5mcm9tRGF0ZSk7XHJcblx0XHRpZiAodGhpcy50b0RhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY29uY2F0TXVsdGlQYXJhbShhcnJheTogc3RyaW5nW10pOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGFycmF5LmpvaW4oXCI7XCIpO1xyXG5cdH1cclxufVxyXG4iLCJmdW5jdGlvbiBjcmVhdGVFbGVtKGVsTmFtZTpzdHJpbmcsIGNsc05hbWU6c3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgdG1wID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsTmFtZSkgICk7XHJcbiAgICAgICAgdG1wLmNsYXNzTGlzdC5hZGQoY2xzTmFtZSk7XHJcblx0XHRyZXR1cm4gdG1wO1xyXG5cdH1cclxuXHJcbmZ1bmN0aW9uIGFkZFRleHQocGFyZW50IDogYW55LHR4dCA6IHN0cmluZyl7XHJcbiAgICAgICAgdmFyIHRtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHh0KSAgKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoIHRtcCApO1xyXG5cdFx0Ly9yZXR1cm4gdG1wO1xyXG5cdH1cclxuICAgIFxyXG4gICAgXHJcblxyXG5leHBvcnQgbW9kdWxlIEh0bWxCdWlsZGVye1xyXG5cclxuXHJcbiAgICBcclxuXHQvKipcclxuXHQgKiBCdWlsZCBodG1sIGxpIGVsZW1lbnQgZnJvbSBhcnRpY2xlIG9iamVjdFxyXG5cdCAqIGtra1xyXG5cdCAqL1xyXG5cdGV4cG9ydCBmdW5jdGlvbiBidWlsZEFydGljbGUoYXJ0aWNsZSA6IGFueSwgcGFyZW50IDogYW55KXtcclxuICAgIFxyXG4gICAgICAgIC8vdmFyIHRtcF9jbGVhcmZpeCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByb290ID0gY3JlYXRlRWxlbShcImRpdlwiLFwicmVzdWx0XCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdG9waWMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjb250YWluZXJfdG9waWNcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9waWNfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCB0b3BpY19idXR0b24sIGFydGljbGUudG9waWMgKTtcclxuICAgICAgICAgICAgdG9waWMuYXBwZW5kQ2hpbGQodG9waWNfYnV0dG9uKTtcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCB0b3BpYyApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcInRpdGxlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSBhcnRpY2xlLnVybDtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGEsIGFydGljbGUudGl0bGUgKTtcclxuICAgICAgICAgICAgdGl0bGUuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggdGl0bGUgKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGxpbmsgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJsaW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggbGluaywgYXJ0aWNsZS51cmwgKTsgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGxpbmsgKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjb250YWluZXJfZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVfZGF0ZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsXCJkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJhd19kYXRlID0gYXJ0aWNsZS5wdWJEYXRlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL2J1ZyBzdWJzdHIgb3RoZXIgYmVoYXZpb3VyIHRoYW4gc3Vic3RyaW5nXHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZV95ID0gcmF3X2RhdGUuc3Vic3RyaW5nKDAsNCk7XHJcbiAgICAgICAgICAgICAgICAvLyBoZXJlIGZpcmVmb3gganMgYnJvd3NlciBidWcgb24gc3Vic3RyKDUsNylcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlX20gPSByYXdfZGF0ZS5zdWJzdHJpbmcoNSw3KS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZV9kID0gcmF3X2RhdGUuc3Vic3RyaW5nKDgsMTApLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWF0dGVkX2RhdGUgPSBkYXRlX2QgKyBcIi5cIiArIGRhdGVfbSArIFwiLlwiICsgZGF0ZV95XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBkYXRlX2RhdGUsIGZvcm1hdHRlZF9kYXRlICk7XHJcbiAgICAgICAgICAgICAgICBkYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgLy92YXIgZGF0ZV90aW1lID0gY3JlYXRlRWxlbShcInNwYW5cIixcInRpbWVcIik7XHJcbiAgICAgICAgICAgICAgICAvL2RhdGVfYnV0dG9uLmFwcGVuZENoaWxkKGRhdGVfdGltZSk7XHJcbiAgICAgICAgICAgIGRhdGUuYXBwZW5kQ2hpbGQoZGF0ZV9idXR0b24pO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIikgKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjb250ZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggY29udGVudCwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0LnN1YnN0cmluZygwLDMwMCkpOyAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggY29udGVudCApO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudF9jYWNoZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNvbnRlbnRfY2FjaGVcIik7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBjb250ZW50X2NhY2hlLCBhcnRpY2xlLmV4dHJhY3RlZFRleHQpOyAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggY29udGVudF9jYWNoZSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgYXV0aG9yID0gY3JlYXRlRWxlbShcImRpdlwiLFwiYXV0aG9yXCIpO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggYXV0aG9yLCBhcnRpY2xlLmF1dGhvciApOyAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggYXV0aG9yICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaW1nIHNyYz1cIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lcl9idXR0b25zID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY29udGFpbmVyX2J1dHRvbnNcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBidWcgcmVmYWMgdG9kbywgaGVyZSBhdWZrbGFwcGVuIGxhbmdlciB0ZXh0ICFcclxuICAgICAgICAgICAgdmFyIGNhY2hlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBhLmhyZWYgPSBcIiNjYWNoZV9pZF9cIithcnRpY2xlLmFydGljbGVJZF9zdHI7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1nID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gXCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiOy8vXCJcIjtcclxuICAgICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGEsIFwiQ2FjaGVcIiApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhY2hlX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoY2FjaGVfYnV0dG9uKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgc2ltaWxhcl9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIithcnRpY2xlLmFydGljbGVJZF9zdHI7IC8vMTEyMzI0M1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggYSwgXCJTaW1pbGFyXCIgKTtcclxuICAgICAgICAgICAgc2ltaWxhcl9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoc2ltaWxhcl9idXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lcl9idXR0b25zICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIikgKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB2YXIgX3RtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpICApOyAvLzogYW55O1xyXG4gICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9wa2ljIGtrXCIpIDtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgX3RtcC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLF90bXApO1xyXG5cdFx0Ly9wYXJlbnQuYXBwZW5kQ2hpbGQoX3RtcCk7XHJcbiAgICAgICAgLy9yZXR1cm4gZWw7XHJcbiAgICAgICAgLy8gdW5zYXViZXJlciBjb2RlLCBidWlsZCB1bmQgYXBwZW5kIHRyZW5uZW4gZXZlbnRsP1xyXG4gICAgICAgIHZhciBsaSA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZChyb290KTtcclxuXHRcdHBhcmVudC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixsaSk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBcclxuXHJcbn1cclxuXHJcbi8qXHJcblxyXG5cclxuICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMDsgaSsrKXsgLy9idWdcclxuICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2psLmxvZyhcIlRoaXMgcG9zdCB3YXNcXG5cIixcImVyclwiKTtcclxuICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAxNTsgaSsrKXtcclxuICAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgLy8gYnVnIGVycm9mIG9mIHR5cGVzY3JpcHQgPz9cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBcclxuICAqL1xyXG5cclxuIiwiLypcclxuICpAYXVob3IgZGJlY2tzdGVpbiwgamZyYW56XHJcbiAqL1xyXG5cclxuaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5pbXBvcnQge0h0bWxCdWlsZGVyfSBmcm9tIFwiLi9IdG1sQnVpbGRlclwiO1xyXG5cclxuY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcblx0ZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcblx0YXJ0aWNsZXM6IGFueVtdOyAvLyBUT0RPIGRlZmluZSBBcnRpY2xlIHdoZW4gQXJ0aWNsZSBzZXJ2ZXIgY2xhc3MgaXMgc3RhYmxlXHJcbn1cclxuXHJcbiAgIC8vZGVjbGFyZSB2YXIgJDsgYnVnLCBwbGFjZSB0aGlzIGluIGRlZmluaXRvbiBmaWxlPywgaG93IHRvIGVtYmVkIG90aGVyIGpzIGRvY3M9P1xyXG5cclxuICAgdmFyIHJlc3VsdCA9IHsgXHJcbiAgICAgIFwiY2FyZHNcIjogW1xyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiU291cmNlXCIsXHJcbiAgICAgICAgICAgICAgIFwiam9iXCI6IFwiVGhpcyBpcyBhIGpvYlwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJhY3Rpb25cIjoge1xyXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJQb3VyY2VcIixcclxuICAgICAgICAgICAgICAgXCJqb2JcIjogXCJUaGlzIGlzIGEgam9pblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgIF1cclxuICAgfTtcclxuICAgXHJcbiAgIFxyXG5cclxuICAgY2xhc3MgTXlDb25zb2xlIHtcclxuICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICBsb2cocyA6IHN0cmluZykge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIrcyk7XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgY3MubG9nKFwiXCIrcyk7XHJcbiAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIrcywgXCJudGZcIik7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG4gICBjbGFzcyBKc0xvZyB7XHJcbiAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgbG9nKHM6c3RyaW5nLHN0YXR1c19uYW1lOnN0cmluZykge1xyXG4gICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgIHZhciBzdGF0dXMgPSBbXCJlcnJcIiwgXCJtc2dcIiwgXCJudGZcIiBdO1xyXG4gICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIiBdO1xyXG4gICAgICAgICB2YXIgY29sb3JzID0gW1wiRkY2MTU5XCIsIFwiRkY5RjUxXCIsXCIyMkI4RUJcIixcIlwiLFwiXCIgXTsgXHJcbiAgICAgICAgIC8vICAgICAgICAgICAgIG9yYW5nZSAgXHJcbiAgICAgICAgICAgIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyAvL2luIGNvbnN0cnVjdG9yIHJlaW5cclxuICAgICAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAgICAgLy8gYWxsZXJ0IHJhc2llIGJ1ZyAsIGVycm8gcmlmIGNvbF9pZCA8IDBcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5X25hbWUgPSBzdGF0dXNfZGlzcGxheVtjb2xfaWRdXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj5cIik7XHJcbiAgICAgICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIC8vamwucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG5cclxuICAgLy92YXIgZ3JlZXRlciA9IG5ldyBHcmVldGVyKFwiSGVsbG8sIHdvcmxkIVwiKTtcclxuICAgLy8gRXhjYXQgb3JkZXIgb2YgdGhlc2UgbmV4dCBjb21tYW5kcyBpcyBpbXBvcnRhbnQgXHJcbiAgIHZhciBjcyA9IG5ldyBNeUNvbnNvbGUoKTsgICAgXHJcbiAgIHZhciBqbCA9IG5ldyBKc0xvZygpO1xyXG4gICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcbiAgIC8vIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyBidWcgd2h5IG5vdCBoZXJlIGdsb2JhbFxyXG4gICAvKlxyXG4gICAgICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coJ3RzIDEnKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93Lm9ubG9hZFxyXG4gICAgKi9cclxuICAgIFxyXG4gICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICAgICAgLy92YXIgayA9IFwia2pcIjtcclxuICAgICAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gdmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zIDogYW55OyBcclxuIGZ1bmN0aW9uIG9uX2xvYWQoKXtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzLnB1c2goXCJQb2xpdGljc1wiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXMucHVzaChcImNublwiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IFwiMjAxNi0xMi0yNVwiO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgQWpheC5nZXRCeVF1ZXJ5KFwiVGlnZXIgV29vZHNcIiwgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCxyZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsbGlzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjcy5sb2coXCJoaSAtLS0tLS0gXCIpO1xyXG4gICAgICAvL2NzLmdldChcInJlc1wiKS5pbm5lckhUTUwgPSBncmVldGVyLmdyZWV0KCk7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG4gICAgICBcclxuICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICBcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAwOyBpKyspeyAvL2J1Z1xyXG4gICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgIC8vamwubG9nKFwiVGhpcyBwb3N0IHdhc1xcblwiLFwiZXJyXCIpO1xyXG4gICAgICAgICAvL2psLmxvZyhpLFwibXNnXCIpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBidWcgZ2V0IHNvdXJjZXMgdG9kbyAhIVxyXG4gICAgICB2YXIgdG9waWNfc2V0IDogYW55ID0gW107XHJcbiAgICAgIHRvcGljX3NldCA9IFtcInRvcGljIDFcIixcInRvcGljIDJcIixcInRvcGljIDNcIl07XHJcbiAgICAgIFxyXG4gICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICAgIEFqYXguZ2V0TWV0YWRhdGEoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLFwiTmV3IEFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCB0b3BpY19zZXQubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciB0b3BpY05hbWUgPSB0b3BpY19zZXRbaV07XHJcbiAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9waWNOYW1lKSA7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmb3IgKHZhciBpPTA7IGk8IDE1OyBpKyspe1xyXG4gICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUb3BpYyBcIitpKSA7XHJcbiAgICAgICAgIGVsLmFwcGVuZENoaWxkKCB0ZXh0X25vZGUgKTtcclxuICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICAgICAvLyBidWcgZXJyb2Ygb2YgdHlwZXNjcmlwdCA/P1xyXG4gICAgICB9XHJcbiAgICAgIC8vKi9cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQgOiBzdHJpbmcsIHZhbCA6IHN0cmluZyl7XHJcbiAgICAgICAgIHZhciBlbCA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgICk7XHJcbiAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gZWxlbWVudF9zaG93KGlkIDogc3RyaW5nKXtcclxuICAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJibG9ja1wiKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBlbGVtZW50X2hpZGUoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAvL2NoZWNrIHN0YXR1cz8gcmFpc2UgZXJyb3IgaWYgaGlkZGVuP1xyXG4gICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcIm5vbmVcIik7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZCA6IHN0cmluZyx0ZXh0IDogc3RyaW5nKXtcclxuICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpICApO1xyXG4gICAgICAgICBlLmlkID0gXCJzcGFuX2hpZGRlbl9cIitpZDtcclxuICAgICAgICAgZS5jbGFzc05hbWUgPSBcInNwYW5faGlkZGVuXCI7XHJcbiAgICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgIGVsLmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9kZWxldGUoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY2hlY2soaWQgOiBzdHJpbmcsdGV4dCA6IHN0cmluZyl7XHJcbiAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgdmFyIGJvb2wgPSBmYWxzZTtcclxuICAgICAgICAgdmFyIHNwYW5fbGlzdCA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuICAgICAgICAgLy9lbC5nZXRFbGVtZW50QnlJZChcInNwYW5faGlkZGVuX1wiK2lkKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIFdlbm4ga2VpbiBIaWRkZW4gU3BhbiBkYSwgZGFubiB3ZXJ0IGltbWVyIGZhbHNjaCEhXHJcbiAgICAgICAgIC8vYnVnIGFzc3VtZXMganVzdCBvbmUgY2xhcyByYWlzZSB3YXJuaWduIGlmIG1vcmUgY2xhc3NlcyAhISAsIGNsZWFyZWQsIGJ5IGNoZWNrIGxlbmdodCA9PSAxXHJcbiAgICAgICAgIGlmICggc3Bhbl9saXN0Lmxlbmd0aD09MSApe1xyXG4gICAgICAgICAgICB2YXIgc3BhbiA9IHNwYW5fbGlzdFswXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3Bhbi5pbm5lckhUTUwsIHRleHQpO1xyXG4gICAgICAgICAgICBib29sID0gKCBcIlwiK3RleHQgPT0gXCJcIitzcGFuLmlubmVySFRNTCApO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBjcy5sb2coXCJcIitib29sKTtcclxuICAgICAgICAgcmV0dXJuIGJvb2w7XHJcbiAgICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcyhlbDogYW55KXsgXHJcbiAgICAgICAgIHZhciBmbGRfc2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpO1xyXG4gICAgICAgICB2YXIgZmxkID0gKDxIVE1MSW5wdXRFbGVtZW50PiBmbGRfc2VhcmNoKS52YWx1ZTtcclxuICAgICAgICAgdmFyIGtleXdvcmRzID0gZmxkO1xyXG4gICAgICAgICBjb25uLnBvc3Qoa2V5d29yZHMpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBmX3NlYXJjaF9maWx0ZXIoZWwgOiBhbnkpeyAvLyBidWcga2V5IG5vdCB1c2VkXHJcbiAgICAgICAgIHZhciBjaGVjayA9IHNwYW5faGlkZGVuX2NoZWNrKFwiZmlsdGVyX3NldHRpbmdzXCIsXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICBpZiAoY2hlY2spe1xyXG4gICAgICAgICAgICBlbGVtZW50X2hpZGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgIHNwYW5faGlkZGVuX2RlbGV0ZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBjbG9zaW5nLlwiLFwibnRmXCIpO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZWxlbWVudF9zaG93KFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBzcGFuX2hpZGRlbl9jcmVhdGUoXCJmaWx0ZXJfc2V0dGluZ3NcIixcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgb3BlbmluZy5cIixcIm50ZlwiKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICAvL3Nob3cgaGlkZSwgbm90IHRvZ2dsZSAhIVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBkYXRlX3N0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgICB2YXIgZGF0ZV9zdGFydF9zdHIgPSAgKDxIVE1MSW5wdXRFbGVtZW50PiBkYXRlX3N0YXJ0KS52YWx1ZS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgICAgdmFyIGRhdGVfc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGVfc3RhcnRfc3RyKTtcclxuICAgICAgY3MubG9nKFwiXCIrZGF0ZV9zdGFydF9kYXRlKTtcclxuICAgICAgY3MubG9nKGRhdGVfc3RhcnRfZGF0ZS50b1N0cmluZygpKTtcclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGNoZWNrX3VybF9uYW1lKGV2ZW50IDogYW55KXtcclxuICAgICAgICAgLy92YXIgdXJsX25hbWUgPSB3aW5kb3cubG9jYXRpb247Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgIC8vY3MubG9nKHVybF9uYW1lKTtcclxuICAgICAgICAgdmFyIHVybF9oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKHVybF9oYXNoKTsgLy8gZG9lcyBub3Qgd29yayBpbiBpZT8/ICEhIVxyXG4gICAgICAgICB2YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCIgO1xyXG4gICAgICAgICBpZiAodXJsX2hhc2guaW5kZXhPZihcIiNcIitrZXkpID09IDApe1xyXG4gICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoa2V5KTtcclxuICAgICAgICAgICAgY3MubG9nKGtleSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgLy9pZiAjc2VhcmNoX2ZpbHRlciBpbiB1cmxfaGFzaFxyXG4gICAgICAgICAvL211bHRpZmxhZ19sYXN0X2hhc2ggPSBzZWFyY2hfZmlsdGVyLi4uXHJcbiAgICAgICAgIC8vc2hvdyBmaWxldGVyLCBzZWFjaCBrZXl3b3Jkcywgc2hvdyBjYWNoZSAoZ3JleSwgYmx1ZSwgYmxhY2sgYW5kIHdoaXRlLCB0aGVtZSBhbGwgbmV3IGNhY2hlLCBkbyBwb3N0IHJlcS4pXHJcbiAgICAgICAgIC8vIGlmIGtleXdvcmRzLCBwb3N0IGFjdGlvbiA9IHNlcmFjaCBzdWJhY3Rpb24gPSBrZXl3b3JkcyBkYXRhID0ga2V5d29yZHMgYXJyYXksIG9yIGNhY2hlX2lkIHJlcXVlc3QgaW5mb3MuLi4sIFxyXG4gICAgICAgICAvLyB0aGVuIHNob3csIHBvc3QgdXBkYXRlIGdyZXkgYXJlIHByb2dyZXNzIGJhciwgZmlsdGVyIGluZm9zIGdldCBsb2NhbCBzdG9yYWdlIGZpbHRlcnNfXy4uLCBnZXQgZmlsdGVycyBmcm9tIHBhZ2U/IG1hcmtlZCAoc3BhbiBtYXJrZSwgcmVhbCB2YWx1ZSwgZGlzcGxheS4uLlxyXG4gICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc19jbGlja19vcl9lbnRlcihldiA6IGFueSl7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcclxuICAgICAgICAgZWwgPSB0aGlzO1xyXG5cclxuICAgICAgICAgLy8gYmFkIGdpdmVzIGZ1bGwgaHJlZiB3aXRoIGxpbmtcclxuICAgICAgICAgLy92YXIgaHJlZiA9IGVsLmhyZWY7IFxyXG4gICAgICAgICAvLyBuaWNlLCBnaXZlcyByYXcgaHJlZiwgZnJvbSBlbGVtZW50IG9ubHkgKCBlLmcuICNzZWFyY2hfZmlsdGVyLCBpbnN0ZWFkIG9mIHd3dy5nb29nbGUuY29tLyNzZWFjaF9maWx0ZXIpXHJcbiAgICAgICAgIHZhciBocmVmID0gKDxhbnk+ZWwpLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XHJcbiAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xyXG4gICAgICAgICAvL3ZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgLy9rZXkgPSBcIiNcIiArIGtleTtcclxuICAgICAgICAgLypcclxuICAgICAgICAgdmFyIGlzX3NhbWUgPSAoaHJlZiA9PSBrZXkpIDtcclxuICAgICAgICAgaWYgKGlzX3NhbWUpeyAvL3VybF9oYXNoLmluZGV4T2YoXCIjXCIra2V5KSA9PSAwXHJcbiAgICAgICAgIH1cclxuICAgICAgICAgKi8gXHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5mbyBocmVmIHN3aXRoYy0tXCIraHJlZitcIi0tXCIpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcImJvb2xcIiwgaHJlZj09XCJzZWFjaF9maWx0ZXJcIiwgaHJlZiwgXCJzZWFjaF9maWx0ZXJcIiApO1xyXG4gICAgICAgICBzd2l0Y2goaHJlZikge1xyXG4gICAgICAgICAgICBjYXNlIFwic2VhcmNoX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9rZXl3b3Jkc1wiOlxyXG4gICAgICAgICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcyhlbCk7XHJcbiAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAvL2RlZmF1bHQgY29kZSBibG9ja1xyXG4gICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICAgIH0gXHJcbiAgICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICAgY3MubG9nKFwiIyBzZWxlY3Rpb24gd2FzIC0gXCIraHJlZik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiaHJlZlwiLGhyZWYpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbiAgICAgICAgIC8vY3MubG9nKGVsLmdldEF0dHJpYnV0ZShcImhyZWZcIikpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vcmVwZWF0IHRoaXMgZWFjaCAwLjI1IHNlY29uZCAhISBidWcgdG9kbyByZWZhY1xyXG4gICAgICB2YXIgY29sX2EgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJBXCIpICApO1xyXG4gICAgICAvL3ZhciBsaXN0X2EgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggY29sX2EsIDAgKTtcclxuICAgICAgdmFyIGxpc3RfYTogYW55ID0gW107XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgbGlzdF9hLnB1c2goY29sX2FbaV0pO1xyXG4gICAgICBjb25zb2xlLmxvZyggXCJsaVwiLCBsaXN0X2EpO1xyXG4gICAgICBjb25zb2xlLmxvZyggXCJsaVwiLCBjb2xfYS5sZW5ndGgpO1xyXG4gICAgICBcclxuICAgICAgZm9yKHZhciBpPTA7aTxjb2xfYS5sZW5ndGg7aSsrKSB7IC8vIGlmIHlvdSBoYXZlIG5hbWVkIHByb3BlcnRpZXNcclxuICAgICAgICAgdmFyIGFuY2ggPSBsaXN0X2FbaV07IC8vICg8YW55PiB4KTtcclxuICAgICAgICAgLy8gdG9kbyBidWcsIHJlZmFjLCBjaGVjayBpZiBjbGFzcyBpcyBub3JtYWwgbGluaywgdGhlbiBkb250IGFkZCBhbnkgc3BlY2lhbCBvbmNsaWNrIGhhbmRsaW5nXHJcbiAgICAgICAgIC8vY29uc29sZS5sb2coXCJpXCIsIGFuY2gpO1xyXG4gICAgICAgICAvL3ZhciBhbmNoID0gKDxhbnk+IGxpc3RfYVtpXSAgKTtcclxuICAgICAgICAgYW5jaC5vbmNsaWNrPXByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgIC8qZnVuY3Rpb24oKXsvKiBzb21lIGNvZGUgKiAvXHJcbiAgICAgICAgICAgICggYW5jaCApO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIC8vIE5lZWQgdGhpcyBmb3IgSUUsIENocm9tZSA/XHJcbiAgICAgICAgIC8qIFxyXG4gICAgICAgICBhbmNoLm9ua2V5cHJlc3M9ZnVuY3Rpb24oZSl7IC8vaWUgPz9cclxuICAgICAgICAgICAgaWYoZS53aGljaCA9PSAxMyl7Ly9FbnRlciBrZXkgcHJlc3NlZFxyXG4gICAgICAgICAgICAgICBwcm9jZXNzX2NsaWNrX29yX2VudGVyKCBhbmNoICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICBcclxuICAgICAgfVxyXG4gICB9XHJcbiAgICAgIFxyXG4gICAgICAvL3ZhciBhbmNoID0gbnVsbDtcclxuICAgICAgLypcclxuICAgICAgZm9yKHZhciB4IGluIHJlc3VsdCkgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgIGFuY2ggPSByZXN1bHRbeF07XHJcbiAgICAgIH1cclxuICAgICAgKi9cclxuICAgICAgXHJcbiAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuY2hvcklEJylcclxuICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5jaG9ySUQnKS5cclxuICAgICAgXHJcbiAgICAgICBcclxuICAgICAgLypcclxuICAgICAgaWYgKHdpbmRvdy5vbnBvcHN0YXRlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGNoZWNrX3VybF9uYW1lO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gY2hlY2tfdXJsX25hbWU7XHJcbiAgICAgIH1cclxuICAgICAgKi9cclxuICAgICAgLypcclxuICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAvL2NvbnNvbGUubG9nKFwibG9jYXRpb246IFwiICsgZG9jdW1lbnQubG9jYXRpb24gKyBcIiwgc3RhdGU6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXZlbnQuc3RhdGUpKTtcclxuICAgICAgICAgY2hlY2tfdXJsX25hbWUoKTtcclxuICAgICAgfTtcclxuICAgICAgKi9cclxuICAgICAgICAgICAgLypcclxuICAgICAgXHJcbiAgICAgICAgICAgIGJ1ZyBhZGQgc2VyYWNoIGJ1dHRvbiBzZWFyY2ggYnV0dG9uXHJcbiAgICAgIFxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHB1c2hVcmwgPSAoaHJlZikgPT4ge1xyXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgaHJlZik7XHJcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdwb3BzdGF0ZScpKTtcclxuICAgICAgfTtcclxuICAgICAgICAgICAgXHJcbiAgICAgIHZhciBkYXRlc3RyaW5nID0gJChcIiNkYXRlXCIpLnZhbCgpLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGVzdHJpbmcpO1xyXG4gICAgICAvL2RhdGUudG9zdHJpbmcoKSk7XHRcclxuICAgICAgdmFyIGVsZW1lbnRzX3NlbD0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI1Rlc3QsICNUZXN0IConKTtcclxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBhbGVydCgnSGVsbG8gd29ybGQgYWdhaW4hISEnKTtcclxuICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAqL1xyXG4gICAgICBcclxuICAgICAgLy8kKCcuc3lzIGlucHV0W3R5cGU9dGV4dF0sIC5zeXMgc2VsZWN0JykuZWFjaChmdW5jdGlvbigpIHt9KVxyXG5cclxuICAgXHJcbiAgIC8vd2luZG93Lm9ubG9hZCA9IG9uX2xvYWQoKTtcclxuICAgXHJcbiAgIC8vI3RzYyAtLXdhdGNoIC1wIGpzXHJcbiAgIFxyXG4gICAvKlxyXG4gICAgICBjbGVhbiB1cCBqcywgdHNcclxuICAgICAgLSBvbiBlbnRlciBzZWFyY2gsIGFkdmFuY2VkIHNlYXJjaFxyXG4gICAgICAtIG9mZmVyIGRhdGUgcmFuZ2VcclxuICAgICAgLSBvZmZlciB0aGVtZXMvdG9waWNzXHJcbiAgICAgIC0gb2ZmZXIgbHVwZSBzaG93LCB1c2UgYmFja3JvdW5nIGltYWdlPz8gYmV0dGVyLCBiZWNhdXNlIGNzcyBjaGFuZ2ViYXJcclxuICAgICAgLSBvbmNsaWNrIGEgaHJlZiBvcGVuIGNhY2hlLCBzZWFyY2ggc2ltaWxhciAoaW50ZXJ2YWxsIGdldCBuZXcgdXJsKSwgZXZlbnQgbmV3IHBhZ2U/IG9ucGFnZWxvYWQ/XHJcbiAgICAgIC0gb24gXHJcbiAgICAgIC0gc2VuZCBwb3N0IGNsYXNzLCBiaW5kIGNsaWNrcyAuLi5cclxuICAgICAgLSBGaWx0ZXIgYnkgdG9waWMsIGJ5IGRhdGVcclxuICAgICAgLSBidXR0b24gLCBiYW5uZXIgLCBwcm9ncmVzcyBiYXIgZm9yIHNlYXJjaCwgc2hvdyBwb3N0IGluZm8gISFcclxuICAgICAgLSBmYXZvcml0ZSB0b3BpY3MgaW4gc2VwYXJ0ZS9maXJzdCBsaW5lICh3cml0ZSBteSBmYXZvcml0ZXM9ID8gb3Igbm90KVxyXG4gICAgICBcclxuICAgICAgLSB0b3BpY3MgeWEgPGE+IGZvciBrZXltb3ZlXHJcbiAgICAgIC0gdGVzdCBldmVyeXRoaW5nIGtleW1vdmVcclxuICAgICAgLSBmaWx0ZXIsIGx1cGUga2V5bW92ZSBjb2xvclxyXG4gICAgICBcclxuICAgICAgLSBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICBcclxuICAgICAgLSBmaWx0ZXIgYWRkIDwgPCBeYXJyb3cgZG93biBkYXp1IGF1ZmtsYXBwIGFycm93ICEhXHJcbiAgICAgIC0ganNvbiB0byBodG1sIGZvciByZXN1bHQgISFcclxuICAgICAgLSBwb3BzdGF0ZSBpbywgSUUgPz8gXHJcbiAgICAgIFxyXG4gICAgICAtIHBhcnNlIGRhdGUsIHRvcGljIG9uIHNlcnZlciBmb3IgdmFsaWRhdGluZyAhIVxyXG4gICAgICAtIG1hcmsgdXNlIG9mIG90aGVyIGF1dGhvciBsaWJyYXJpZXMgISEgZm9yIGRhdGUgISEsIFxyXG4gICAgICAtIGNsb3NlIGZpbHRlciB4IChoaWRlIGZpbGRlciAvIHN5bWJvbFA/KVxyXG4gICAgICBcclxuICAgICAgYXBwbHkgZmlsdGVyXHJcbiAgIFxyXG4gICAqL1xyXG4gICBcclxuICAgIiwiIl19
