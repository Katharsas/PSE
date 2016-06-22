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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBLElBQWMsSUFBSSxDQWdEakI7QUFoREQsV0FBYyxJQUFJLEVBQUMsQ0FBQztJQUNoQixnREFBZ0Q7SUFDbkQsSUFBTSxPQUFPLEdBQVcsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0lBQzFELElBQU0sZ0JBQWdCLEdBQVcsVUFBVSxHQUFHLGFBQWEsQ0FBQztJQUM1RCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FB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LENBQUMsQ0FBQyxDQUFDO0lBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVqQyxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQ25DLDZGQUE2RjtRQUM3Rix5QkFBeUI7UUFDekIsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUMsc0JBQXNCLENBQUM7SUFhdkMsQ0FBQztJQUVELGtCQUFrQjtJQUNsQjs7OztNQUlFO0lBRUYscUNBQXFDO0lBQ3JDLHNDQUFzQztJQUd0Qzs7Ozs7O01BTUU7SUFDRjs7Ozs7TUFLRTtJQUNJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQko7SUFFRiw2REFBNkQ7QUFFaEUsQ0FBQztBQUVELDRCQUE0QjtBQUU1QixvQkFBb0I7QUFFcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNkJFOztBQ3JhTCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuXHJcbmRlY2xhcmUgdmFyIGNvbnRleHRVcmw6IHN0cmluZztcclxuXHJcbmV4cG9ydCBtb2R1bGUgQWpheCB7XHJcbiAgICAvL3ZhciBjb250ZXh0VXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvQ1dBL1wiO1xyXG5cdGNvbnN0IHVybEJhc2U6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NlYXJjaFwiO1xyXG5cdGNvbnN0IHVybEJhc2VfbWV0YWRhdGE6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldE1ldGFkYXRhXCI7XHJcblx0Y29uc3QgaGVhZGVycyA9IHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb24sKi8qO3E9MC44XCIgfTtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5UXVlcnkocXVlcnk6IFN0cmluZywgZmlsdGVyczogRmlsdGVyT3B0aW9ucywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcInF1ZXJ5PVwiICsgcXVlcnkpO1xyXG5cclxuXHRcdGxldCBmaWx0ZXJQYXJhbXM6IHN0cmluZyA9IGZpbHRlcnMudG9VcmxQYXJhbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX1wiLGZpbHRlclBhcmFtcyk7XHJcblx0XHRpZiAoZmlsdGVyUGFyYW1zICE9PSBcIlwiKSBwYXJhbXMucHVzaChmaWx0ZXJQYXJhbXMpO1xyXG5cclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZSArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNZXRhZGF0YSgpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZV9tZXRhZGF0YSA7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUlxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVNpbWlsYXIoYXJ0aWNsZUlkOiBTdHJpbmcsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHQvLyBUT0RPXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgRmlsdGVyT3B0aW9ucyB7XHJcblxyXG5cdHRvcGljczogc3RyaW5nW10gPSBbXTtcclxuXHRzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBmcm9tRGF0ZTogc3RyaW5nID0gXCIxOTgwLTAxLTAxXCI7XHJcblx0dG9EYXRlOiBzdHJpbmcgPSBcIjIwMjAtMDEtMDFcIjsgLy8gYnVnICwgYmV0dGVyIGRlZmF1bHRzID8gXHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwiZnJvbT1cIiArIHRoaXMuZnJvbURhdGUpO1xyXG5cdFx0aWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcInRvPVwiICsgdGhpcy50b0RhdGUpO1xyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiZnVuY3Rpb24gY3JlYXRlRWxlbShlbE5hbWU6c3RyaW5nLCBjbHNOYW1lOnN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIHRtcCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbE5hbWUpICApO1xyXG4gICAgICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG5cdFx0cmV0dXJuIHRtcDtcclxuXHR9XHJcblxyXG5mdW5jdGlvbiBhZGRUZXh0KHBhcmVudCA6IGFueSx0eHQgOiBzdHJpbmcpe1xyXG4gICAgICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkgICk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKCB0bXAgKTtcclxuXHRcdC8vcmV0dXJuIHRtcDtcclxuXHR9XHJcbiAgICBcclxuICAgIFxyXG5cclxuZXhwb3J0IG1vZHVsZSBIdG1sQnVpbGRlcntcclxuXHJcblxyXG4gICAgXHJcblx0LyoqXHJcblx0ICogQnVpbGQgaHRtbCBsaSBlbGVtZW50IGZyb20gYXJ0aWNsZSBvYmplY3RcclxuXHQgKiBra2tcclxuXHQgKi9cclxuXHRleHBvcnQgZnVuY3Rpb24gYnVpbGRBcnRpY2xlKGFydGljbGUgOiBhbnksIHBhcmVudCA6IGFueSl7XHJcbiAgICBcclxuICAgICAgICAvL3ZhciB0bXBfY2xlYXJmaXggPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjbGVhcmZpeFwiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcm9vdCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcInJlc3VsdFwiKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY29udGFpbmVyX3RvcGljXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcGljX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggdG9waWNfYnV0dG9uLCBhcnRpY2xlLnRvcGljICk7XHJcbiAgICAgICAgICAgIHRvcGljLmFwcGVuZENoaWxkKHRvcGljX2J1dHRvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggdG9waWMgKTtcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjbGVhcmZpeFwiKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJ0aXRsZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBhLCBhcnRpY2xlLnRpdGxlICk7XHJcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIHRpdGxlICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsaW5rID0gY3JlYXRlRWxlbShcImRpdlwiLFwibGlua1wiKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGxpbmssIGFydGljbGUudXJsICk7ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBsaW5rICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY29udGFpbmVyX2RhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLFwiZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVfeSA9IHJhd19kYXRlLnN1YnN0cmluZygwLDQpO1xyXG4gICAgICAgICAgICAgICAgLy8gaGVyZSBmaXJlZm94IGpzIGJyb3dzZXIgYnVnIG9uIHN1YnN0cig1LDcpXHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZV9tID0gcmF3X2RhdGUuc3Vic3RyaW5nKDUsNykucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVfZCA9IHJhd19kYXRlLnN1YnN0cmluZyg4LDEwKS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdHRlZF9kYXRlID0gZGF0ZV9kICsgXCIuXCIgKyBkYXRlX20gKyBcIi5cIiArIGRhdGVfeVxyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggZGF0ZV9kYXRlLCBmb3JtYXR0ZWRfZGF0ZSApO1xyXG4gICAgICAgICAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAgICAgICAgIC8vdmFyIGRhdGVfdGltZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsXCJ0aW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9kYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX3RpbWUpO1xyXG4gICAgICAgICAgICBkYXRlLmFwcGVuZENoaWxkKGRhdGVfYnV0dG9uKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGRhdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY29udGVudFwiKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGNvbnRlbnQsIGFydGljbGUuZXh0cmFjdGVkVGV4dC5zdWJzdHJpbmcoMCwzMDApKTsgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNvbnRlbnQgKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImF1dGhvclwiKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGF1dGhvciwgYXJ0aWNsZS5hdXRob3IgKTsgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGF1dGhvciApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGltZyBzcmM9XCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNvbnRhaW5lcl9idXR0b25zXCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gYnVnIHJlZmFjIHRvZG8sIGhlcmUgYXVma2xhcHBlbiBsYW5nZXIgdGV4dCAhXHJcbiAgICAgICAgICAgIHZhciBjYWNoZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gXCIjY2FjaGVfaWRfMTEyMzI0M1wiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGltZyA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjsvL1wiXCI7XHJcbiAgICAgICAgICAgICAgICBhLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBhLCBcIkNhY2hlXCIgKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYWNoZV9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKGNhY2hlX2J1dHRvbik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHNpbWlsYXJfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NpbWlsYXJfaWRfMTEyMzI0M1wiO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggYSwgXCJTaW1pbGFyXCIgKTtcclxuICAgICAgICAgICAgc2ltaWxhcl9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoc2ltaWxhcl9idXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lcl9idXR0b25zICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIikgKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB2YXIgX3RtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpICApOyAvLzogYW55O1xyXG4gICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9wa2ljIGtrXCIpIDtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgX3RtcC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLF90bXApO1xyXG5cdFx0Ly9wYXJlbnQuYXBwZW5kQ2hpbGQoX3RtcCk7XHJcbiAgICAgICAgLy9yZXR1cm4gZWw7XHJcbiAgICAgICAgLy8gdW5zYXViZXJlciBjb2RlLCBidWlsZCB1bmQgYXBwZW5kIHRyZW5uZW4gZXZlbnRsP1xyXG4gICAgICAgIHZhciBsaSA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZChyb290KTtcclxuXHRcdHBhcmVudC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixsaSk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBcclxuXHJcbn1cclxuXHJcbi8qXHJcblxyXG5cclxuICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMDsgaSsrKXsgLy9idWdcclxuICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2psLmxvZyhcIlRoaXMgcG9zdCB3YXNcXG5cIixcImVyclwiKTtcclxuICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAxNTsgaSsrKXtcclxuICAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgLy8gYnVnIGVycm9mIG9mIHR5cGVzY3JpcHQgPz9cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBcclxuICAqL1xyXG5cclxuIiwiLypcclxuICpAYXVob3IgZGJlY2tzdGVpbiwgamZyYW56XHJcbiAqL1xyXG5cclxuaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5pbXBvcnQge0h0bWxCdWlsZGVyfSBmcm9tIFwiLi9IdG1sQnVpbGRlclwiO1xyXG5cclxuY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcblx0ZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcblx0YXJ0aWNsZXM6IGFueVtdOyAvLyBUT0RPIGRlZmluZSBBcnRpY2xlIHdoZW4gQXJ0aWNsZSBzZXJ2ZXIgY2xhc3MgaXMgc3RhYmxlXHJcbn1cclxuXHJcbiAgIC8vZGVjbGFyZSB2YXIgJDsgYnVnLCBwbGFjZSB0aGlzIGluIGRlZmluaXRvbiBmaWxlPywgaG93IHRvIGVtYmVkIG90aGVyIGpzIGRvY3M9P1xyXG5cclxuICAgdmFyIHJlc3VsdCA9IHsgXHJcbiAgICAgIFwiY2FyZHNcIjogW1xyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiU291cmNlXCIsXHJcbiAgICAgICAgICAgICAgIFwiam9iXCI6IFwiVGhpcyBpcyBhIGpvYlwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJhY3Rpb25cIjoge1xyXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJQb3VyY2VcIixcclxuICAgICAgICAgICAgICAgXCJqb2JcIjogXCJUaGlzIGlzIGEgam9pblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgIF1cclxuICAgfTtcclxuICAgXHJcbiAgIFxyXG5cclxuICAgY2xhc3MgTXlDb25zb2xlIHtcclxuICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICBsb2cocyA6IHN0cmluZykge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIrcyk7XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgY3MubG9nKFwiXCIrcyk7XHJcbiAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIrcywgXCJudGZcIik7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG4gICBjbGFzcyBKc0xvZyB7XHJcbiAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgbG9nKHM6c3RyaW5nLHN0YXR1c19uYW1lOnN0cmluZykge1xyXG4gICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgIHZhciBzdGF0dXMgPSBbXCJlcnJcIiwgXCJtc2dcIiwgXCJudGZcIiBdO1xyXG4gICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIiBdO1xyXG4gICAgICAgICB2YXIgY29sb3JzID0gW1wiRkY2MTU5XCIsIFwiRkY5RjUxXCIsXCIyMkI4RUJcIixcIlwiLFwiXCIgXTsgXHJcbiAgICAgICAgIC8vICAgICAgICAgICAgIG9yYW5nZSAgXHJcbiAgICAgICAgICAgIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyAvL2luIGNvbnN0cnVjdG9yIHJlaW5cclxuICAgICAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAgICAgLy8gYWxsZXJ0IHJhc2llIGJ1ZyAsIGVycm8gcmlmIGNvbF9pZCA8IDBcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5X25hbWUgPSBzdGF0dXNfZGlzcGxheVtjb2xfaWRdXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj5cIik7XHJcbiAgICAgICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIC8vamwucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG5cclxuICAgLy92YXIgZ3JlZXRlciA9IG5ldyBHcmVldGVyKFwiSGVsbG8sIHdvcmxkIVwiKTtcclxuICAgLy8gRXhjYXQgb3JkZXIgb2YgdGhlc2UgbmV4dCBjb21tYW5kcyBpcyBpbXBvcnRhbnQgXHJcbiAgIHZhciBjcyA9IG5ldyBNeUNvbnNvbGUoKTsgICAgXHJcbiAgIHZhciBqbCA9IG5ldyBKc0xvZygpO1xyXG4gICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcbiAgIC8vIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyBidWcgd2h5IG5vdCBoZXJlIGdsb2JhbFxyXG4gICAvKlxyXG4gICAgICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coJ3RzIDEnKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93Lm9ubG9hZFxyXG4gICAgKi9cclxuICAgIFxyXG4gICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICAgICAgLy92YXIgayA9IFwia2pcIjtcclxuICAgICAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gdmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zIDogYW55OyBcclxuIGZ1bmN0aW9uIG9uX2xvYWQoKXtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzLnB1c2goXCJQb2xpdGljc1wiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXMucHVzaChcImNublwiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IFwiMjAxNi0xMi0yNVwiO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgQWpheC5nZXRCeVF1ZXJ5KFwiVGlnZXIgV29vZHNcIiwgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCxyZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsbGlzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjcy5sb2coXCJoaSAtLS0tLS0gXCIpO1xyXG4gICAgICAvL2NzLmdldChcInJlc1wiKS5pbm5lckhUTUwgPSBncmVldGVyLmdyZWV0KCk7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG4gICAgICBcclxuICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICBcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAwOyBpKyspeyAvL2J1Z1xyXG4gICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgIC8vamwubG9nKFwiVGhpcyBwb3N0IHdhc1xcblwiLFwiZXJyXCIpO1xyXG4gICAgICAgICAvL2psLmxvZyhpLFwibXNnXCIpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBidWcgZ2V0IHNvdXJjZXMgdG9kbyAhIVxyXG4gICAgICB2YXIgdG9waWNfc2V0IDogYW55ID0gW107XHJcbiAgICAgIHRvcGljX3NldCA9IFtcInRvcGljIDFcIixcInRvcGljIDJcIixcInRvcGljIDNcIl07XHJcbiAgICAgIFxyXG4gICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICAgIEFqYXguZ2V0TWV0YWRhdGEoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLFwiTmV3IEFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCB0b3BpY19zZXQubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciB0b3BpY05hbWUgPSB0b3BpY19zZXRbaV07XHJcbiAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9waWNOYW1lKSA7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmb3IgKHZhciBpPTA7IGk8IDE1OyBpKyspe1xyXG4gICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUb3BpYyBcIitpKSA7XHJcbiAgICAgICAgIGVsLmFwcGVuZENoaWxkKCB0ZXh0X25vZGUgKTtcclxuICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICAgICAvLyBidWcgZXJyb2Ygb2YgdHlwZXNjcmlwdCA/P1xyXG4gICAgICB9XHJcbiAgICAgIC8vKi9cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQgOiBzdHJpbmcsIHZhbCA6IHN0cmluZyl7XHJcbiAgICAgICAgIHZhciBlbCA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgICk7XHJcbiAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gZWxlbWVudF9zaG93KGlkIDogc3RyaW5nKXtcclxuICAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJibG9ja1wiKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBlbGVtZW50X2hpZGUoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAvL2NoZWNrIHN0YXR1cz8gcmFpc2UgZXJyb3IgaWYgaGlkZGVuP1xyXG4gICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcIm5vbmVcIik7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZCA6IHN0cmluZyx0ZXh0IDogc3RyaW5nKXtcclxuICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpICApO1xyXG4gICAgICAgICBlLmlkID0gXCJzcGFuX2hpZGRlbl9cIitpZDtcclxuICAgICAgICAgZS5jbGFzc05hbWUgPSBcInNwYW5faGlkZGVuXCI7XHJcbiAgICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgIGVsLmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9kZWxldGUoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY2hlY2soaWQgOiBzdHJpbmcsdGV4dCA6IHN0cmluZyl7XHJcbiAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgdmFyIGJvb2wgPSBmYWxzZTtcclxuICAgICAgICAgdmFyIHNwYW5fbGlzdCA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuICAgICAgICAgLy9lbC5nZXRFbGVtZW50QnlJZChcInNwYW5faGlkZGVuX1wiK2lkKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIC8vIFdlbm4ga2VpbiBIaWRkZW4gU3BhbiBkYSwgZGFubiB3ZXJ0IGltbWVyIGZhbHNjaCEhXHJcbiAgICAgICAgIC8vYnVnIGFzc3VtZXMganVzdCBvbmUgY2xhcyByYWlzZSB3YXJuaWduIGlmIG1vcmUgY2xhc3NlcyAhISAsIGNsZWFyZWQsIGJ5IGNoZWNrIGxlbmdodCA9PSAxXHJcbiAgICAgICAgIGlmICggc3Bhbl9saXN0Lmxlbmd0aD09MSApe1xyXG4gICAgICAgICAgICB2YXIgc3BhbiA9IHNwYW5fbGlzdFswXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3Bhbi5pbm5lckhUTUwsIHRleHQpO1xyXG4gICAgICAgICAgICBib29sID0gKCBcIlwiK3RleHQgPT0gXCJcIitzcGFuLmlubmVySFRNTCApO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBjcy5sb2coXCJcIitib29sKTtcclxuICAgICAgICAgcmV0dXJuIGJvb2w7XHJcbiAgICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcyhlbDogYW55KXsgXHJcbiAgICAgICAgIHZhciBmbGRfc2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpO1xyXG4gICAgICAgICB2YXIgZmxkID0gKDxIVE1MSW5wdXRFbGVtZW50PiBmbGRfc2VhcmNoKS52YWx1ZTtcclxuICAgICAgICAgdmFyIGtleXdvcmRzID0gZmxkO1xyXG4gICAgICAgICBjb25uLnBvc3Qoa2V5d29yZHMpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBmX3NlYXJjaF9maWx0ZXIoZWwgOiBhbnkpeyAvLyBidWcga2V5IG5vdCB1c2VkXHJcbiAgICAgICAgIHZhciBjaGVjayA9IHNwYW5faGlkZGVuX2NoZWNrKFwiZmlsdGVyX3NldHRpbmdzXCIsXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICBpZiAoY2hlY2spe1xyXG4gICAgICAgICAgICBlbGVtZW50X2hpZGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgIHNwYW5faGlkZGVuX2RlbGV0ZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBjbG9zaW5nLlwiLFwibnRmXCIpO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZWxlbWVudF9zaG93KFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBzcGFuX2hpZGRlbl9jcmVhdGUoXCJmaWx0ZXJfc2V0dGluZ3NcIixcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgb3BlbmluZy5cIixcIm50ZlwiKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICAvL3Nob3cgaGlkZSwgbm90IHRvZ2dsZSAhIVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBkYXRlX3N0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgICB2YXIgZGF0ZV9zdGFydF9zdHIgPSAgKDxIVE1MSW5wdXRFbGVtZW50PiBkYXRlX3N0YXJ0KS52YWx1ZS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgICAgdmFyIGRhdGVfc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGVfc3RhcnRfc3RyKTtcclxuICAgICAgY3MubG9nKFwiXCIrZGF0ZV9zdGFydF9kYXRlKTtcclxuICAgICAgY3MubG9nKGRhdGVfc3RhcnRfZGF0ZS50b1N0cmluZygpKTtcclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGNoZWNrX3VybF9uYW1lKGV2ZW50IDogYW55KXtcclxuICAgICAgICAgLy92YXIgdXJsX25hbWUgPSB3aW5kb3cubG9jYXRpb247Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgIC8vY3MubG9nKHVybF9uYW1lKTtcclxuICAgICAgICAgdmFyIHVybF9oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKHVybF9oYXNoKTsgLy8gZG9lcyBub3Qgd29yayBpbiBpZT8/ICEhIVxyXG4gICAgICAgICB2YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCIgO1xyXG4gICAgICAgICBpZiAodXJsX2hhc2guaW5kZXhPZihcIiNcIitrZXkpID09IDApe1xyXG4gICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoa2V5KTtcclxuICAgICAgICAgICAgY3MubG9nKGtleSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgLy9pZiAjc2VhcmNoX2ZpbHRlciBpbiB1cmxfaGFzaFxyXG4gICAgICAgICAvL211bHRpZmxhZ19sYXN0X2hhc2ggPSBzZWFyY2hfZmlsdGVyLi4uXHJcbiAgICAgICAgIC8vc2hvdyBmaWxldGVyLCBzZWFjaCBrZXl3b3Jkcywgc2hvdyBjYWNoZSAoZ3JleSwgYmx1ZSwgYmxhY2sgYW5kIHdoaXRlLCB0aGVtZSBhbGwgbmV3IGNhY2hlLCBkbyBwb3N0IHJlcS4pXHJcbiAgICAgICAgIC8vIGlmIGtleXdvcmRzLCBwb3N0IGFjdGlvbiA9IHNlcmFjaCBzdWJhY3Rpb24gPSBrZXl3b3JkcyBkYXRhID0ga2V5d29yZHMgYXJyYXksIG9yIGNhY2hlX2lkIHJlcXVlc3QgaW5mb3MuLi4sIFxyXG4gICAgICAgICAvLyB0aGVuIHNob3csIHBvc3QgdXBkYXRlIGdyZXkgYXJlIHByb2dyZXNzIGJhciwgZmlsdGVyIGluZm9zIGdldCBsb2NhbCBzdG9yYWdlIGZpbHRlcnNfXy4uLCBnZXQgZmlsdGVycyBmcm9tIHBhZ2U/IG1hcmtlZCAoc3BhbiBtYXJrZSwgcmVhbCB2YWx1ZSwgZGlzcGxheS4uLlxyXG4gICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gcHJvY2Vzc19jbGlja19vcl9lbnRlcihldiA6IGFueSl7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcclxuICAgICAgICAgZWwgPSB0aGlzO1xyXG5cclxuICAgICAgICAgLy8gYmFkIGdpdmVzIGZ1bGwgaHJlZiB3aXRoIGxpbmtcclxuICAgICAgICAgLy92YXIgaHJlZiA9IGVsLmhyZWY7IFxyXG4gICAgICAgICAvLyBuaWNlLCBnaXZlcyByYXcgaHJlZiwgZnJvbSBlbGVtZW50IG9ubHkgKCBlLmcuICNzZWFyY2hfZmlsdGVyLCBpbnN0ZWFkIG9mIHd3dy5nb29nbGUuY29tLyNzZWFjaF9maWx0ZXIpXHJcbiAgICAgICAgIHZhciBocmVmID0gKDxhbnk+ZWwpLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XHJcbiAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xyXG4gICAgICAgICAvL3ZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgLy9rZXkgPSBcIiNcIiArIGtleTtcclxuICAgICAgICAgLypcclxuICAgICAgICAgdmFyIGlzX3NhbWUgPSAoaHJlZiA9PSBrZXkpIDtcclxuICAgICAgICAgaWYgKGlzX3NhbWUpeyAvL3VybF9oYXNoLmluZGV4T2YoXCIjXCIra2V5KSA9PSAwXHJcbiAgICAgICAgIH1cclxuICAgICAgICAgKi8gXHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5mbyBocmVmIHN3aXRoYy0tXCIraHJlZitcIi0tXCIpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcImJvb2xcIiwgaHJlZj09XCJzZWFjaF9maWx0ZXJcIiwgaHJlZiwgXCJzZWFjaF9maWx0ZXJcIiApO1xyXG4gICAgICAgICBzd2l0Y2goaHJlZikge1xyXG4gICAgICAgICAgICBjYXNlIFwic2VhcmNoX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9rZXl3b3Jkc1wiOlxyXG4gICAgICAgICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcyhlbCk7XHJcbiAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAvL2RlZmF1bHQgY29kZSBibG9ja1xyXG4gICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICAgIH0gXHJcbiAgICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICAgY3MubG9nKFwiIyBzZWxlY3Rpb24gd2FzIC0gXCIraHJlZik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiaHJlZlwiLGhyZWYpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbiAgICAgICAgIC8vY3MubG9nKGVsLmdldEF0dHJpYnV0ZShcImhyZWZcIikpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vcmVwZWF0IHRoaXMgZWFjaCAwLjI1IHNlY29uZCAhISBidWcgdG9kbyByZWZhY1xyXG4gICAgICB2YXIgY29sX2EgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJBXCIpICApO1xyXG4gICAgICAvL3ZhciBsaXN0X2EgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggY29sX2EsIDAgKTtcclxuICAgICAgdmFyIGxpc3RfYTogYW55ID0gW107XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgbGlzdF9hLnB1c2goY29sX2FbaV0pO1xyXG4gICAgICBjb25zb2xlLmxvZyggXCJsaVwiLCBsaXN0X2EpO1xyXG4gICAgICBjb25zb2xlLmxvZyggXCJsaVwiLCBjb2xfYS5sZW5ndGgpO1xyXG4gICAgICBcclxuICAgICAgZm9yKHZhciBpPTA7aTxjb2xfYS5sZW5ndGg7aSsrKSB7IC8vIGlmIHlvdSBoYXZlIG5hbWVkIHByb3BlcnRpZXNcclxuICAgICAgICAgdmFyIGFuY2ggPSBsaXN0X2FbaV07IC8vICg8YW55PiB4KTtcclxuICAgICAgICAgLy8gdG9kbyBidWcsIHJlZmFjLCBjaGVjayBpZiBjbGFzcyBpcyBub3JtYWwgbGluaywgdGhlbiBkb250IGFkZCBhbnkgc3BlY2lhbCBvbmNsaWNrIGhhbmRsaW5nXHJcbiAgICAgICAgIC8vY29uc29sZS5sb2coXCJpXCIsIGFuY2gpO1xyXG4gICAgICAgICAvL3ZhciBhbmNoID0gKDxhbnk+IGxpc3RfYVtpXSAgKTtcclxuICAgICAgICAgYW5jaC5vbmNsaWNrPXByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgIC8qZnVuY3Rpb24oKXsvKiBzb21lIGNvZGUgKiAvXHJcbiAgICAgICAgICAgICggYW5jaCApO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIC8vIE5lZWQgdGhpcyBmb3IgSUUsIENocm9tZSA/XHJcbiAgICAgICAgIC8qIFxyXG4gICAgICAgICBhbmNoLm9ua2V5cHJlc3M9ZnVuY3Rpb24oZSl7IC8vaWUgPz9cclxuICAgICAgICAgICAgaWYoZS53aGljaCA9PSAxMyl7Ly9FbnRlciBrZXkgcHJlc3NlZFxyXG4gICAgICAgICAgICAgICBwcm9jZXNzX2NsaWNrX29yX2VudGVyKCBhbmNoICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICBcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy92YXIgYW5jaCA9IG51bGw7XHJcbiAgICAgIC8qXHJcbiAgICAgIGZvcih2YXIgeCBpbiByZXN1bHQpIHsgLy8gaWYgeW91IGhhdmUgbmFtZWQgcHJvcGVydGllc1xyXG4gICAgICAgICBhbmNoID0gcmVzdWx0W3hdO1xyXG4gICAgICB9XHJcbiAgICAgICovXHJcbiAgICAgIFxyXG4gICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbmNob3JJRCcpXHJcbiAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuY2hvcklEJykuXHJcbiAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgIC8qXHJcbiAgICAgIGlmICh3aW5kb3cub25wb3BzdGF0ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBjaGVja191cmxfbmFtZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9IGNoZWNrX3VybF9uYW1lO1xyXG4gICAgICB9XHJcbiAgICAgICovXHJcbiAgICAgIC8qXHJcbiAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgLy9jb25zb2xlLmxvZyhcImxvY2F0aW9uOiBcIiArIGRvY3VtZW50LmxvY2F0aW9uICsgXCIsIHN0YXRlOiBcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50LnN0YXRlKSk7XHJcbiAgICAgICAgIGNoZWNrX3VybF9uYW1lKCk7XHJcbiAgICAgIH07XHJcbiAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgIFxyXG4gICAgICAgICAgICBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICBcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBwdXNoVXJsID0gKGhyZWYpID0+IHtcclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIGhyZWYpO1xyXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncG9wc3RhdGUnKSk7XHJcbiAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICB2YXIgZGF0ZXN0cmluZyA9ICQoXCIjZGF0ZVwiKS52YWwoKS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlc3RyaW5nKTtcclxuICAgICAgLy9kYXRlLnRvc3RyaW5nKCkpO1x0XHJcbiAgICAgIHZhciBlbGVtZW50c19zZWw9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNUZXN0LCAjVGVzdCAqJyk7XHJcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYWxlcnQoJ0hlbGxvIHdvcmxkIGFnYWluISEhJyk7XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgKi9cclxuICAgICAgXHJcbiAgICAgIC8vJCgnLnN5cyBpbnB1dFt0eXBlPXRleHRdLCAuc3lzIHNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7fSlcclxuXHJcbiAgIH1cclxuICAgXHJcbiAgIC8vd2luZG93Lm9ubG9hZCA9IG9uX2xvYWQoKTtcclxuICAgXHJcbiAgIC8vI3RzYyAtLXdhdGNoIC1wIGpzXHJcbiAgIFxyXG4gICAvKlxyXG4gICAgICBjbGVhbiB1cCBqcywgdHNcclxuICAgICAgLSBvbiBlbnRlciBzZWFyY2gsIGFkdmFuY2VkIHNlYXJjaFxyXG4gICAgICAtIG9mZmVyIGRhdGUgcmFuZ2VcclxuICAgICAgLSBvZmZlciB0aGVtZXMvdG9waWNzXHJcbiAgICAgIC0gb2ZmZXIgbHVwZSBzaG93LCB1c2UgYmFja3JvdW5nIGltYWdlPz8gYmV0dGVyLCBiZWNhdXNlIGNzcyBjaGFuZ2ViYXJcclxuICAgICAgLSBvbmNsaWNrIGEgaHJlZiBvcGVuIGNhY2hlLCBzZWFyY2ggc2ltaWxhciAoaW50ZXJ2YWxsIGdldCBuZXcgdXJsKSwgZXZlbnQgbmV3IHBhZ2U/IG9ucGFnZWxvYWQ/XHJcbiAgICAgIC0gb24gXHJcbiAgICAgIC0gc2VuZCBwb3N0IGNsYXNzLCBiaW5kIGNsaWNrcyAuLi5cclxuICAgICAgLSBGaWx0ZXIgYnkgdG9waWMsIGJ5IGRhdGVcclxuICAgICAgLSBidXR0b24gLCBiYW5uZXIgLCBwcm9ncmVzcyBiYXIgZm9yIHNlYXJjaCwgc2hvdyBwb3N0IGluZm8gISFcclxuICAgICAgLSBmYXZvcml0ZSB0b3BpY3MgaW4gc2VwYXJ0ZS9maXJzdCBsaW5lICh3cml0ZSBteSBmYXZvcml0ZXM9ID8gb3Igbm90KVxyXG4gICAgICBcclxuICAgICAgLSB0b3BpY3MgeWEgPGE+IGZvciBrZXltb3ZlXHJcbiAgICAgIC0gdGVzdCBldmVyeXRoaW5nIGtleW1vdmVcclxuICAgICAgLSBmaWx0ZXIsIGx1cGUga2V5bW92ZSBjb2xvclxyXG4gICAgICBcclxuICAgICAgLSBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICBcclxuICAgICAgLSBmaWx0ZXIgYWRkIDwgPCBeYXJyb3cgZG93biBkYXp1IGF1ZmtsYXBwIGFycm93ICEhXHJcbiAgICAgIC0ganNvbiB0byBodG1sIGZvciByZXN1bHQgISFcclxuICAgICAgLSBwb3BzdGF0ZSBpbywgSUUgPz8gXHJcbiAgICAgIFxyXG4gICAgICAtIHBhcnNlIGRhdGUsIHRvcGljIG9uIHNlcnZlciBmb3IgdmFsaWRhdGluZyAhIVxyXG4gICAgICAtIG1hcmsgdXNlIG9mIG90aGVyIGF1dGhvciBsaWJyYXJpZXMgISEgZm9yIGRhdGUgISEsIFxyXG4gICAgICAtIGNsb3NlIGZpbHRlciB4IChoaWRlIGZpbGRlciAvIHN5bWJvbFA/KVxyXG4gICAgICBcclxuICAgICAgYXBwbHkgZmlsdGVyXHJcbiAgIFxyXG4gICAqL1xyXG4gICBcclxuICAgIiwiIl19
