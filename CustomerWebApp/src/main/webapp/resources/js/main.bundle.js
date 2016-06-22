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
        addText(link, article.url.substring(0, 45));
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
    Ajax_1.Ajax.getByQuery("Alibaba", global_filterOptions, 0, 10)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBLElBQWMsSUFBSSxDQWdEakI7QUFoREQsV0FBYyxJQUFJLEVBQUMsQ0FBQztJQUNoQixnREFBZ0Q7SUFDbkQsSUFBTSxPQUFPLEdBQVcsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0lBQzFELElBQU0sZ0JBQWdCLEdBQVcsVUFBVSxHQUFHLGFBQWEsQ0FBQztJQUM1RCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENB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VSxRQUFRLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFFLENBQUM7SUFDdkQsc0RBQXNEO0lBQ3RELElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUNyQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTtRQUNuQyw2RkFBNkY7UUFDN0YseUJBQXlCO1FBQ3pCLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDO0lBYTFDLENBQUM7QUFDTCxDQUFDO0FBRUssa0JBQWtCO0FBQ2xCOzs7O0VBSUU7QUFFRixxQ0FBcUM7QUFDckMsc0NBQXNDO0FBR3RDOzs7Ozs7RUFNRTtBQUNGOzs7OztFQUtFO0FBQ0k7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWtCSjtBQUVGLDZEQUE2RDtBQUdoRSw0QkFBNEI7QUFFNUIsb0JBQW9CO0FBRXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZCRTs7QUNyYUwiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcblxyXG5kZWNsYXJlIHZhciBjb250ZXh0VXJsOiBzdHJpbmc7XHJcblxyXG5leHBvcnQgbW9kdWxlIEFqYXgge1xyXG4gICAgLy92YXIgY29udGV4dFVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL0NXQS9cIjtcclxuXHRjb25zdCB1cmxCYXNlOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRBcnRpY2xlcy9zZWFyY2hcIjtcclxuXHRjb25zdCB1cmxCYXNlX21ldGFkYXRhOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRNZXRhZGF0YVwiO1xyXG5cdGNvbnN0IGhlYWRlcnMgPSB7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uLCovKjtxPTAuOFwiIH07XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVF1ZXJ5KHF1ZXJ5OiBTdHJpbmcsIGZpbHRlcnM6IEZpbHRlck9wdGlvbnMsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJxdWVyeT1cIiArIHF1ZXJ5KTtcclxuXHJcblx0XHRsZXQgZmlsdGVyUGFyYW1zOiBzdHJpbmcgPSBmaWx0ZXJzLnRvVXJsUGFyYW0oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19cIixmaWx0ZXJQYXJhbXMpO1xyXG5cdFx0aWYgKGZpbHRlclBhcmFtcyAhPT0gXCJcIikgcGFyYW1zLnB1c2goZmlsdGVyUGFyYW1zKTtcclxuXHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2UgKyBcIj9cIiArIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEoKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2VfbWV0YWRhdGEgO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlTaW1pbGFyKGFydGljbGVJZDogU3RyaW5nLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0Ly8gVE9ET1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59IiwiZXhwb3J0IGNsYXNzIEZpbHRlck9wdGlvbnMge1xyXG5cclxuXHR0b3BpY3M6IHN0cmluZ1tdID0gW107XHJcblx0c291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgIFxyXG4gICAgZnJvbURhdGU6IHN0cmluZyA9IFwiMTk4MC0wMS0wMVwiO1xyXG5cdHRvRGF0ZTogc3RyaW5nID0gXCIyMDIwLTAxLTAxXCI7IC8vIGJ1ZyAsIGJldHRlciBkZWZhdWx0cyA/IFxyXG4gICAgXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnQgZmlsdGVyIG9wdGlvbnMgdG8gdXJsIHBhcmFtZXRlciBzdHJpbmcgb2YgZm9ybWF0XHJcblx0ICogXCJwYXJhbTE9dmFsdWUxJnBhcmFtMj12YWx1ZTImcGFyYW00PXZhbHVlM1wiIGZvciB1c2UgYXMgdXJsIHBhcmFtZXRlcnMuXHJcblx0ICovXHJcblx0dG9VcmxQYXJhbSgpOiBzdHJpbmcge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50b3BpY3MubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInRvcGljcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnRvcGljcykpO1xyXG5cdFx0aWYgKHRoaXMuc291cmNlcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwic291cmNlcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnNvdXJjZXMpKTtcclxuXHRcdGlmICh0aGlzLmZyb21EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcImZyb209XCIgKyB0aGlzLmZyb21EYXRlKTtcclxuXHRcdGlmICh0aGlzLnRvRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJ0bz1cIiArIHRoaXMudG9EYXRlKTtcclxuXHJcblx0XHRyZXR1cm4gcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjb25jYXRNdWx0aVBhcmFtKGFycmF5OiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYXJyYXkuam9pbihcIjtcIik7XHJcblx0fVxyXG59XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZUVsZW0oZWxOYW1lOiBzdHJpbmcsIGNsc05hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICB2YXIgdG1wID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsTmFtZSkpO1xyXG4gICAgdG1wLmNsYXNzTGlzdC5hZGQoY2xzTmFtZSk7XHJcbiAgICByZXR1cm4gdG1wO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUZXh0KHBhcmVudDogYW55LCB0eHQ6IHN0cmluZykge1xyXG4gICAgdmFyIHRtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHh0KSk7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgIC8vcmV0dXJuIHRtcDtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgbW9kdWxlIEh0bWxCdWlsZGVyIHtcclxuXHJcblxyXG4gICAgXHJcblx0LyoqXHJcblx0ICogQnVpbGQgaHRtbCBsaSBlbGVtZW50IGZyb20gYXJ0aWNsZSBvYmplY3RcclxuXHQgKiBra2tcclxuXHQgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBidWlsZEFydGljbGUoYXJ0aWNsZTogYW55LCBwYXJlbnQ6IGFueSkge1xyXG4gICAgXHJcbiAgICAgICAgLy92YXIgdG1wX2NsZWFyZml4ID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHJvb3QgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwicmVzdWx0XCIpO1xyXG5cclxuICAgICAgICB2YXIgdG9waWMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX3RvcGljXCIpO1xyXG4gICAgICAgIHZhciB0b3BpY19idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgYWRkVGV4dCh0b3BpY19idXR0b24sIGFydGljbGUudG9waWMpO1xyXG4gICAgICAgIHRvcGljLmFwcGVuZENoaWxkKHRvcGljX2J1dHRvbik7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodG9waWMpO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgdGl0bGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwidGl0bGVcIik7XHJcbiAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgYWRkVGV4dChhLCBhcnRpY2xlLnRpdGxlKTtcclxuICAgICAgICB0aXRsZS5hcHBlbmRDaGlsZChhKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcblxyXG4gICAgICAgIHZhciBsaW5rID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImxpbmtcIik7XHJcbiAgICAgICAgYWRkVGV4dChsaW5rLCBhcnRpY2xlLnVybC5zdWJzdHJpbmcoMCwgNDUpKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX2RhdGVcIik7XHJcbiAgICAgICAgdmFyIGRhdGVfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLCBcImRhdGVcIik7XHJcbiAgICAgICAgdmFyIHJhd19kYXRlID0gYXJ0aWNsZS5wdWJEYXRlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgIHZhciBkYXRlX3kgPSByYXdfZGF0ZS5zdWJzdHJpbmcoMCwgNCk7XHJcbiAgICAgICAgLy8gaGVyZSBmaXJlZm94IGpzIGJyb3dzZXIgYnVnIG9uIHN1YnN0cig1LDcpXHJcbiAgICAgICAgdmFyIGRhdGVfbSA9IHJhd19kYXRlLnN1YnN0cmluZyg1LCA3KS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcbiAgICAgICAgdmFyIGRhdGVfZCA9IHJhd19kYXRlLnN1YnN0cmluZyg4LCAxMCkucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG5cclxuICAgICAgICB2YXIgZm9ybWF0dGVkX2RhdGUgPSBkYXRlX2QgKyBcIi5cIiArIGRhdGVfbSArIFwiLlwiICsgZGF0ZV95XHJcbiAgICAgICAgYWRkVGV4dChkYXRlX2RhdGUsIGZvcm1hdHRlZF9kYXRlKTtcclxuICAgICAgICBkYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX2RhdGUpO1xyXG4gICAgICAgIC8vdmFyIGRhdGVfdGltZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsXCJ0aW1lXCIpO1xyXG4gICAgICAgIC8vZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV90aW1lKTtcclxuICAgICAgICBkYXRlLmFwcGVuZENoaWxkKGRhdGVfYnV0dG9uKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGRhdGUpO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRcIik7XHJcbiAgICAgICAgYWRkVGV4dChjb250ZW50LCBhcnRpY2xlLmV4dHJhY3RlZFRleHQuc3Vic3RyaW5nKDAsIDMwMCkpO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgIHZhciBjb250ZW50X2NhY2hlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRfY2FjaGVcIik7XHJcbiAgICAgICAgYWRkVGV4dChjb250ZW50X2NhY2hlLCBhcnRpY2xlLmV4dHJhY3RlZFRleHQpO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnRfY2FjaGUpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJhdXRob3JcIik7XHJcbiAgICAgICAgYWRkVGV4dChhdXRob3IsIGFydGljbGUuYXV0aG9yKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGltZyBzcmM9XCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfYnV0dG9uc1wiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gYnVnIHJlZmFjIHRvZG8sIGhlcmUgYXVma2xhcHBlbiBsYW5nZXIgdGV4dCAhXHJcbiAgICAgICAgdmFyIGNhY2hlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBhLmhyZWYgPSBcIiNjYWNoZV9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjtcclxuICAgICAgICB2YXIgaW1nID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgaW1nLnNyYyA9IFwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjsvL1wiXCI7XHJcbiAgICAgICAgYS5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgIGFkZFRleHQoYSwgXCJDYWNoZVwiKTtcclxuXHJcbiAgICAgICAgY2FjaGVfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKGNhY2hlX2J1dHRvbik7XHJcblxyXG4gICAgICAgIHZhciBzaW1pbGFyX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBhLmhyZWYgPSBcIiNzaW1pbGFyX2lkX1wiICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyOyAvLzExMjMyNDNcclxuICAgICAgICBhZGRUZXh0KGEsIFwiU2ltaWxhclwiKTtcclxuICAgICAgICBzaW1pbGFyX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoc2ltaWxhcl9idXR0b24pO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRhaW5lcl9idXR0b25zKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB2YXIgX3RtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKTsgLy86IGFueTtcclxuICAgICAgICB2YXIgZWwgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGtpYyBra1wiKTtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgIF90bXAuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgX3RtcCk7XHJcbiAgICAgICAgLy9wYXJlbnQuYXBwZW5kQ2hpbGQoX3RtcCk7XHJcbiAgICAgICAgLy9yZXR1cm4gZWw7XHJcbiAgICAgICAgLy8gdW5zYXViZXJlciBjb2RlLCBidWlsZCB1bmQgYXBwZW5kIHRyZW5uZW4gZXZlbnRsP1xyXG4gICAgICAgIHZhciBsaSA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQocm9vdCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixyb290LCB0b3BpYyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLCBsaSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbi8qXHJcblxyXG5cclxuICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMDsgaSsrKXsgLy9idWdcclxuICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2psLmxvZyhcIlRoaXMgcG9zdCB3YXNcXG5cIixcImVyclwiKTtcclxuICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAxNTsgaSsrKXtcclxuICAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgLy8gYnVnIGVycm9mIG9mIHR5cGVzY3JpcHQgPz9cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBcclxuICAqL1xyXG5cclxuIiwiLypcclxuICpAYXVob3IgZGJlY2tzdGVpbiwgamZyYW56XHJcbiAqL1xyXG5cclxuaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5pbXBvcnQge0h0bWxCdWlsZGVyfSBmcm9tIFwiLi9IdG1sQnVpbGRlclwiO1xyXG5cclxuY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcbiAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgIGFydGljbGVzOiBhbnlbXTsgLy8gVE9ETyBkZWZpbmUgQXJ0aWNsZSB3aGVuIEFydGljbGUgc2VydmVyIGNsYXNzIGlzIHN0YWJsZVxyXG59XHJcblxyXG4vL2RlY2xhcmUgdmFyICQ7IGJ1ZywgcGxhY2UgdGhpcyBpbiBkZWZpbml0b24gZmlsZT8sIGhvdyB0byBlbWJlZCBvdGhlciBqcyBkb2NzPT9cclxuXHJcbnZhciByZXN1bHQgPSB7XHJcbiAgICBcImNhcmRzXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIlNvdXJjZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJqb2JcIjogXCJUaGlzIGlzIGEgam9iXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJhY3Rpb25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUG91cmNlXCIsXHJcbiAgICAgICAgICAgICAgICBcImpvYlwiOiBcIlRoaXMgaXMgYSBqb2luXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgXVxyXG59O1xyXG5cclxuXHJcblxyXG5jbGFzcyBNeUNvbnNvbGUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIGxvZyhzOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlwiICsgcyk7XHJcbiAgICB9XHJcbiAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICB9XHJcbn07XHJcbmNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgY3MubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICBqbC5sb2coXCJwb3N0OiBcIiArIHMsIFwibnRmXCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY2xhc3MgSnNMb2cge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIGxvZyhzOiBzdHJpbmcsIHN0YXR1c19uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgdmFyIHN0YXR1cyA9IFtcImVyclwiLCBcIm1zZ1wiLCBcIm50ZlwiXTtcclxuICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIl07XHJcbiAgICAgICAgdmFyIGNvbG9ycyA9IFtcIkZGNjE1OVwiLCBcIkZGOUY1MVwiLCBcIjIyQjhFQlwiLCBcIlwiLCBcIlwiXTsgXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgb3JhbmdlICBcclxuICAgICAgICB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgLy9pbiBjb25zdHJ1Y3RvciByZWluXHJcbiAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAvLyBhbGxlcnQgcmFzaWUgYnVnICwgZXJybyByaWYgY29sX2lkIDwgMFxyXG4gICAgICAgIHZhciBzdGF0dXNfZGlzcGxheV9uYW1lID0gc3RhdHVzX2Rpc3BsYXlbY29sX2lkXVxyXG4gICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIiwgXCI8YnI+XCIpO1xyXG4gICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgdmFyIHR4dCA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj48YnI+XCIpO1xyXG4gICAgICAgIGpsLmlubmVySFRNTCA9IHR4dDtcclxuICAgICAgICAvL2psLnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI1wiK2NvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIgKyBjb2xvcnNbY29sX2lkXTtcclxuICAgIH1cclxuICAgIGdldChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIH1cclxufTtcclxuICAgXHJcblxyXG4vL3ZhciBncmVldGVyID0gbmV3IEdyZWV0ZXIoXCJIZWxsbywgd29ybGQhXCIpO1xyXG4vLyBFeGNhdCBvcmRlciBvZiB0aGVzZSBuZXh0IGNvbW1hbmRzIGlzIGltcG9ydGFudCBcclxudmFyIGNzID0gbmV3IE15Q29uc29sZSgpO1xyXG52YXIgamwgPSBuZXcgSnNMb2coKTtcclxudmFyIGNvbm4gPSBuZXcgU2VydmVyQ29ubmVjdGlvbigpO1xyXG4vLyB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgYnVnIHdoeSBub3QgaGVyZSBnbG9iYWxcclxuLypcclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0cyAxJyk7XHJcbiB9KTtcclxuIHdpbmRvdy5vbmxvYWRcclxuICovXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgIC8vdmFyIGsgPSBcImtqXCI7XHJcbiAgICBvbl9sb2FkKCk7XHJcbn0pO1xyXG52YXIgZ2xvYmFsX2ZpbHRlck9wdGlvbnM6IGFueTtcclxuZnVuY3Rpb24gb25fbG9hZCgpIHtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzLnB1c2goXCJQb2xpdGljc1wiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXMucHVzaChcImNublwiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IFwiMjAxNi0xMi0yNVwiO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgQWpheC5nZXRCeVF1ZXJ5KFwiQWxpYmFiYVwiLCBnbG9iYWxfZmlsdGVyT3B0aW9ucywgMCwgMTApXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBjcy5sb2coXCJoaSAtLS0tLS0gXCIpO1xyXG4gICAgLy9jcy5nZXQoXCJyZXNcIikuaW5uZXJIVE1MID0gZ3JlZXRlci5ncmVldCgpO1xyXG4gICAgICBcclxuICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG5cclxuICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDA7IGkrKykgeyAvL2J1Z1xyXG4gICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgIC8vamwubG9nKFwiVGhpcyBwb3N0IHdhc1xcblwiLFwiZXJyXCIpO1xyXG4gICAgICAgIC8vamwubG9nKGksXCJtc2dcIik7XHJcbiAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICB9XHJcbiAgICAvLyBidWcgZ2V0IHNvdXJjZXMgdG9kbyAhIVxyXG4gICAgdmFyIHRvcGljX3NldDogYW55ID0gW107XHJcbiAgICB0b3BpY19zZXQgPSBbXCJ0b3BpYyAxXCIsIFwidG9waWMgMlwiLCBcInRvcGljIDNcIl07XHJcblxyXG4gICAgdmFyIGNzX2xvZ19hamF4X2hpbnRfMSA9IFwiX19fX25ld19hamF4X19fX1wiO1xyXG4gICAgQWpheC5nZXRNZXRhZGF0YSgpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyBBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpOy8vLmFydGljbGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BpY19zZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgdG9waWNOYW1lID0gdG9waWNfc2V0W2ldO1xyXG4gICAgICAgIHZhciBlbCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRvcGljTmFtZSk7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE1OyBpKyspIHtcclxuICAgICAgICB2YXIgZWwgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGljIFwiICsgaSk7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAvLyBidWcgZXJyb2Ygb2YgdHlwZXNjcmlwdCA/P1xyXG4gICAgfVxyXG4gICAgLy8qL1xyXG4gICAgICBcclxuICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWwgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcclxuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZWxlbWVudF9zaG93KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcImJsb2NrXCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZWxlbWVudF9oaWRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAvL2NoZWNrIHN0YXR1cz8gcmFpc2UgZXJyb3IgaWYgaGlkZGVuP1xyXG4gICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jcmVhdGUoaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSk7XHJcbiAgICAgICAgZS5pZCA9IFwic3Bhbl9oaWRkZW5fXCIgKyBpZDtcclxuICAgICAgICBlLmNsYXNzTmFtZSA9IFwic3Bhbl9oaWRkZW5cIjtcclxuICAgICAgICBlLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9kZWxldGUoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHJcbiAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY2hlY2soaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHZhciBib29sID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHNwYW5fbGlzdCA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuICAgICAgICAvL2VsLmdldEVsZW1lbnRCeUlkKFwic3Bhbl9oaWRkZW5fXCIraWQpO1xyXG4gICAgICAgICBcclxuICAgICAgICAvLyBXZW5uIGtlaW4gSGlkZGVuIFNwYW4gZGEsIGRhbm4gd2VydCBpbW1lciBmYWxzY2ghIVxyXG4gICAgICAgIC8vYnVnIGFzc3VtZXMganVzdCBvbmUgY2xhcyByYWlzZSB3YXJuaWduIGlmIG1vcmUgY2xhc3NlcyAhISAsIGNsZWFyZWQsIGJ5IGNoZWNrIGxlbmdodCA9PSAxXHJcbiAgICAgICAgaWYgKHNwYW5fbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICB2YXIgc3BhbiA9IHNwYW5fbGlzdFswXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3Bhbi5pbm5lckhUTUwsIHRleHQpO1xyXG4gICAgICAgICAgICBib29sID0gKFwiXCIgKyB0ZXh0ID09IFwiXCIgKyBzcGFuLmlubmVySFRNTCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3MubG9nKFwiXCIgKyBib29sKTtcclxuICAgICAgICByZXR1cm4gYm9vbDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHMoZWw6IGFueSkge1xyXG4gICAgICAgIHZhciBmbGRfc2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpO1xyXG4gICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgIHZhciBrZXl3b3JkcyA9IGZsZDtcclxuICAgICAgICBjb25uLnBvc3Qoa2V5d29yZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2ZpbHRlcihlbDogYW55KSB7IC8vIGJ1ZyBrZXkgbm90IHVzZWRcclxuICAgICAgICB2YXIgY2hlY2sgPSBzcGFuX2hpZGRlbl9jaGVjayhcImZpbHRlcl9zZXR0aW5nc1wiLCBcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgaWYgKGNoZWNrKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfaGlkZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgc3Bhbl9oaWRkZW5fZGVsZXRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIGNsb3NpbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2hvdyhcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgc3Bhbl9oaWRkZW5fY3JlYXRlKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBvcGVuaW5nLlwiLCBcIm50ZlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9zaG93IGhpZGUsIG5vdCB0b2dnbGUgISFcclxuICAgIH1cclxuICAgIHZhciBkYXRlX3N0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgdmFyIGRhdGVfc3RhcnRfc3RyID0gKDxIVE1MSW5wdXRFbGVtZW50PiBkYXRlX3N0YXJ0KS52YWx1ZS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgIHZhciBkYXRlX3N0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlX3N0YXJ0X3N0cik7XHJcbiAgICBjcy5sb2coXCJcIiArIGRhdGVfc3RhcnRfZGF0ZSk7XHJcbiAgICBjcy5sb2coZGF0ZV9zdGFydF9kYXRlLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNoZWNrX3VybF9uYW1lKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICAvL3ZhciB1cmxfbmFtZSA9IHdpbmRvdy5sb2NhdGlvbjsvLy5wYXRobmFtZTtcclxuICAgICAgICAvL2NzLmxvZyh1cmxfbmFtZSk7XHJcbiAgICAgICAgdmFyIHVybF9oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgY29uc29sZS5sb2codXJsX2hhc2gpOyAvLyBkb2VzIG5vdCB3b3JrIGluIGllPz8gISEhXHJcbiAgICAgICAgdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgIGlmICh1cmxfaGFzaC5pbmRleE9mKFwiI1wiICsga2V5KSA9PSAwKSB7XHJcbiAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihrZXkpO1xyXG4gICAgICAgICAgICBjcy5sb2coa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9pZiAjc2VhcmNoX2ZpbHRlciBpbiB1cmxfaGFzaFxyXG4gICAgICAgIC8vbXVsdGlmbGFnX2xhc3RfaGFzaCA9IHNlYXJjaF9maWx0ZXIuLi5cclxuICAgICAgICAvL3Nob3cgZmlsZXRlciwgc2VhY2gga2V5d29yZHMsIHNob3cgY2FjaGUgKGdyZXksIGJsdWUsIGJsYWNrIGFuZCB3aGl0ZSwgdGhlbWUgYWxsIG5ldyBjYWNoZSwgZG8gcG9zdCByZXEuKVxyXG4gICAgICAgIC8vIGlmIGtleXdvcmRzLCBwb3N0IGFjdGlvbiA9IHNlcmFjaCBzdWJhY3Rpb24gPSBrZXl3b3JkcyBkYXRhID0ga2V5d29yZHMgYXJyYXksIG9yIGNhY2hlX2lkIHJlcXVlc3QgaW5mb3MuLi4sIFxyXG4gICAgICAgIC8vIHRoZW4gc2hvdywgcG9zdCB1cGRhdGUgZ3JleSBhcmUgcHJvZ3Jlc3MgYmFyLCBmaWx0ZXIgaW5mb3MgZ2V0IGxvY2FsIHN0b3JhZ2UgZmlsdGVyc19fLi4sIGdldCBmaWx0ZXJzIGZyb20gcGFnZT8gbWFya2VkIChzcGFuIG1hcmtlLCByZWFsIHZhbHVlLCBkaXNwbGF5Li4uXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJvY2Vzc19jbGlja19vcl9lbnRlcihldjogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXYpO1xyXG4gICAgICAgIGVsID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gYmFkIGdpdmVzIGZ1bGwgaHJlZiB3aXRoIGxpbmtcclxuICAgICAgICAvL3ZhciBocmVmID0gZWwuaHJlZjsgXHJcbiAgICAgICAgLy8gbmljZSwgZ2l2ZXMgcmF3IGhyZWYsIGZyb20gZWxlbWVudCBvbmx5ICggZS5nLiAjc2VhcmNoX2ZpbHRlciwgaW5zdGVhZCBvZiB3d3cuZ29vZ2xlLmNvbS8jc2VhY2hfZmlsdGVyKVxyXG4gICAgICAgIHZhciBocmVmID0gKDxhbnk+ZWwpLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XHJcbiAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSk7XHJcbiAgICAgICAgLy92YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCI7XHJcbiAgICAgICAgLy9rZXkgPSBcIiNcIiArIGtleTtcclxuICAgICAgICAvKlxyXG4gICAgICAgIHZhciBpc19zYW1lID0gKGhyZWYgPT0ga2V5KSA7XHJcbiAgICAgICAgaWYgKGlzX3NhbWUpeyAvL3VybF9oYXNoLmluZGV4T2YoXCIjXCIra2V5KSA9PSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbmZvIGhyZWYgc3dpdGhjLS1cIiArIGhyZWYgKyBcIi0tXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYm9vbFwiLCBocmVmID09IFwic2VhY2hfZmlsdGVyXCIsIGhyZWYsIFwic2VhY2hfZmlsdGVyXCIpO1xyXG4gICAgICAgIHN3aXRjaCAoaHJlZikge1xyXG4gICAgICAgICAgICBjYXNlIFwic2VhcmNoX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGVsKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic2VhcmNoX2tleXdvcmRzXCI6XHJcbiAgICAgICAgICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcyhlbCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy9kZWZhdWx0IGNvZGUgYmxvY2tcclxuICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGNzLmxvZyhcIiMgc2VsZWN0aW9uIHdhcyAtIFwiICsgaHJlZik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJocmVmXCIsIGhyZWYpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICAvL2NzLmxvZyhlbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKTtcclxuICAgIH1cclxuICAgIC8vcmVwZWF0IHRoaXMgZWFjaCAwLjI1IHNlY29uZCAhISBidWcgdG9kbyByZWZhY1xyXG4gICAgdmFyIGNvbF9hID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiQVwiKSk7XHJcbiAgICAvL3ZhciBsaXN0X2EgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggY29sX2EsIDAgKTtcclxuICAgIHZhciBsaXN0X2E6IGFueSA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgbGlzdF9hLnB1c2goY29sX2FbaV0pO1xyXG4gICAgY29uc29sZS5sb2coXCJsaVwiLCBsaXN0X2EpO1xyXG4gICAgY29uc29sZS5sb2coXCJsaVwiLCBjb2xfYS5sZW5ndGgpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIHsgLy8gaWYgeW91IGhhdmUgbmFtZWQgcHJvcGVydGllc1xyXG4gICAgICAgIHZhciBhbmNoID0gbGlzdF9hW2ldOyAvLyAoPGFueT4geCk7XHJcbiAgICAgICAgLy8gdG9kbyBidWcsIHJlZmFjLCBjaGVjayBpZiBjbGFzcyBpcyBub3JtYWwgbGluaywgdGhlbiBkb250IGFkZCBhbnkgc3BlY2lhbCBvbmNsaWNrIGhhbmRsaW5nXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImlcIiwgYW5jaCk7XHJcbiAgICAgICAgLy92YXIgYW5jaCA9ICg8YW55PiBsaXN0X2FbaV0gICk7XHJcbiAgICAgICAgYW5jaC5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAvKmZ1bmN0aW9uKCl7Lyogc29tZSBjb2RlICogL1xyXG4gICAgICAgICAgICggYW5jaCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBOZWVkIHRoaXMgZm9yIElFLCBDaHJvbWUgP1xyXG4gICAgICAgIC8qIFxyXG4gICAgICAgIGFuY2gub25rZXlwcmVzcz1mdW5jdGlvbihlKXsgLy9pZSA/P1xyXG4gICAgICAgICAgIGlmKGUud2hpY2ggPT0gMTMpey8vRW50ZXIga2V5IHByZXNzZWRcclxuICAgICAgICAgICAgICBwcm9jZXNzX2NsaWNrX29yX2VudGVyKCBhbmNoICk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgIH1cclxufVxyXG4gICAgICBcclxuICAgICAgLy92YXIgYW5jaCA9IG51bGw7XHJcbiAgICAgIC8qXHJcbiAgICAgIGZvcih2YXIgeCBpbiByZXN1bHQpIHsgLy8gaWYgeW91IGhhdmUgbmFtZWQgcHJvcGVydGllc1xyXG4gICAgICAgICBhbmNoID0gcmVzdWx0W3hdO1xyXG4gICAgICB9XHJcbiAgICAgICovXHJcbiAgICAgIFxyXG4gICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbmNob3JJRCcpXHJcbiAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuY2hvcklEJykuXHJcbiAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgIC8qXHJcbiAgICAgIGlmICh3aW5kb3cub25wb3BzdGF0ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBjaGVja191cmxfbmFtZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9IGNoZWNrX3VybF9uYW1lO1xyXG4gICAgICB9XHJcbiAgICAgICovXHJcbiAgICAgIC8qXHJcbiAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgLy9jb25zb2xlLmxvZyhcImxvY2F0aW9uOiBcIiArIGRvY3VtZW50LmxvY2F0aW9uICsgXCIsIHN0YXRlOiBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50LnN0YXRlKSk7XHJcbiAgICAgICAgIGNoZWNrX3VybF9uYW1lKCk7XHJcbiAgICAgIH07XHJcbiAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgIFxyXG4gICAgICAgICAgICBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICBcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBwdXNoVXJsID0gKGhyZWYpID0+IHtcclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIGhyZWYpO1xyXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncG9wc3RhdGUnKSk7XHJcbiAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICB2YXIgZGF0ZXN0cmluZyA9ICQoXCIjZGF0ZVwiKS52YWwoKS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlc3RyaW5nKTtcclxuICAgICAgLy9kYXRlLnRvc3RyaW5nKCkpO1x0XHJcbiAgICAgIHZhciBlbGVtZW50c19zZWw9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNUZXN0LCAjVGVzdCAqJyk7XHJcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYWxlcnQoJ0hlbGxvIHdvcmxkIGFnYWluISEhJyk7XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgKi9cclxuICAgICAgXHJcbiAgICAgIC8vJCgnLnN5cyBpbnB1dFt0eXBlPXRleHRdLCAuc3lzIHNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7fSlcclxuXHJcbiAgIFxyXG4gICAvL3dpbmRvdy5vbmxvYWQgPSBvbl9sb2FkKCk7XHJcbiAgIFxyXG4gICAvLyN0c2MgLS13YXRjaCAtcCBqc1xyXG4gICBcclxuICAgLypcclxuICAgICAgY2xlYW4gdXAganMsIHRzXHJcbiAgICAgIC0gb24gZW50ZXIgc2VhcmNoLCBhZHZhbmNlZCBzZWFyY2hcclxuICAgICAgLSBvZmZlciBkYXRlIHJhbmdlXHJcbiAgICAgIC0gb2ZmZXIgdGhlbWVzL3RvcGljc1xyXG4gICAgICAtIG9mZmVyIGx1cGUgc2hvdywgdXNlIGJhY2tyb3VuZyBpbWFnZT8/IGJldHRlciwgYmVjYXVzZSBjc3MgY2hhbmdlYmFyXHJcbiAgICAgIC0gb25jbGljayBhIGhyZWYgb3BlbiBjYWNoZSwgc2VhcmNoIHNpbWlsYXIgKGludGVydmFsbCBnZXQgbmV3IHVybCksIGV2ZW50IG5ldyBwYWdlPyBvbnBhZ2Vsb2FkP1xyXG4gICAgICAtIG9uIFxyXG4gICAgICAtIHNlbmQgcG9zdCBjbGFzcywgYmluZCBjbGlja3MgLi4uXHJcbiAgICAgIC0gRmlsdGVyIGJ5IHRvcGljLCBieSBkYXRlXHJcbiAgICAgIC0gYnV0dG9uICwgYmFubmVyICwgcHJvZ3Jlc3MgYmFyIGZvciBzZWFyY2gsIHNob3cgcG9zdCBpbmZvICEhXHJcbiAgICAgIC0gZmF2b3JpdGUgdG9waWNzIGluIHNlcGFydGUvZmlyc3QgbGluZSAod3JpdGUgbXkgZmF2b3JpdGVzPSA/IG9yIG5vdClcclxuICAgICAgXHJcbiAgICAgIC0gdG9waWNzIHlhIDxhPiBmb3Iga2V5bW92ZVxyXG4gICAgICAtIHRlc3QgZXZlcnl0aGluZyBrZXltb3ZlXHJcbiAgICAgIC0gZmlsdGVyLCBsdXBlIGtleW1vdmUgY29sb3JcclxuICAgICAgXHJcbiAgICAgIC0gYnVnIGFkZCBzZXJhY2ggYnV0dG9uIHNlYXJjaCBidXR0b25cclxuICAgICAgXHJcbiAgICAgIC0gZmlsdGVyIGFkZCA8IDwgXmFycm93IGRvd24gZGF6dSBhdWZrbGFwcCBhcnJvdyAhIVxyXG4gICAgICAtIGpzb24gdG8gaHRtbCBmb3IgcmVzdWx0ICEhXHJcbiAgICAgIC0gcG9wc3RhdGUgaW8sIElFID8/IFxyXG4gICAgICBcclxuICAgICAgLSBwYXJzZSBkYXRlLCB0b3BpYyBvbiBzZXJ2ZXIgZm9yIHZhbGlkYXRpbmcgISFcclxuICAgICAgLSBtYXJrIHVzZSBvZiBvdGhlciBhdXRob3IgbGlicmFyaWVzICEhIGZvciBkYXRlICEhLCBcclxuICAgICAgLSBjbG9zZSBmaWx0ZXIgeCAoaGlkZSBmaWxkZXIgLyBzeW1ib2xQPylcclxuICAgICAgXHJcbiAgICAgIGFwcGx5IGZpbHRlclxyXG4gICBcclxuICAgKi9cclxuICAgXHJcbiAgICIsIiJdfQ==
