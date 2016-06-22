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
    var cs_log_ajax_hint_1 = "____new_ajax____";
    Ajax_1.Ajax.getMetadata()
        .done(function (result) {
        if (result.errorMessage !== null) {
            console.log(cs_log_ajax_hint_1, result.errorMessage);
        }
        else {
            console.log(cs_log_ajax_hint_1, "New Articles received:");
            console.log(result);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBLElBQWMsSUFBSSxDQWdEakI7QUFoREQsV0FBYyxJQUFJLEVBQUMsQ0FBQztJQUNoQixnREFBZ0Q7SUFDbkQsSUFBTSxPQUFPLEdBQVcsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0lBQzFELElBQU0sZ0JBQWdCLEdBQVcsVUFBVSxHQUFHLGFBQWEsQ0FBQztJQUM1RCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELHNDQUFzQztRQUV0QyxJQUFJLFFBQVEsR0FBRztZQUNkLEdBQUcsRUFBRSxHQUFHO1lBQ1IsT0FBTyxFQUFFLE9BQU87WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsSUFBSSxFQUFFLEtBQUs7U0FDWCxDQUFDO1FBQ0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQXJCZSxlQUFVLGFBcUJ6QixDQUFBO0lBRUU7UUFDRixJQUFJLEdBQUcsR0FBVyxnQkFBZ0IsQ0FBRTtRQUNwQyxzQ0FBc0M7UUFFdEMsSUFBSSxRQUFRLEdBQUc7WUFDZCxHQUFHLEVBQUUsR0FBRztZQUNSLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLElBQUksRUFBRSxLQUFLO1NBQ1gsQ0FBQztRQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFaa0IsZ0JBQVcsY0FZN0IsQ0FBQTtJQUdELHNCQUE2QixTQUFpQixFQUFFLElBQVksRUFBRSxLQUFhO1FBQzFFLE9BQU87UUFDUCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUhlLGlCQUFZLGVBRzNCLENBQUE7QUFDRixDQUFDLEVBaERhLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQWdEakI7OztBQ3BERDtJQUFBO1FBRUMsV0FBTSxHQUFhLEVBQUUsQ0FBQztRQUN0QixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRXBCLGFBQVEsR0FBVyxZQUFZLENBQUM7UUFDbkMsV0FBTSxHQUFXLFlBQVksQ0FBQyxDQUFDLDJCQUEyQjtJQXFCM0QsQ0FBQztJQWxCQTs7O09BR0c7SUFDSCxrQ0FBVSxHQUFWO1FBQ0MsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDN0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVPLHdDQUFnQixHQUF4QixVQUF5QixLQUFlO1FBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFDRixvQkFBQztBQUFELENBM0JBLEFBMkJDLElBQUE7QUEzQlkscUJBQWEsZ0JBMkJ6QixDQUFBOzs7QUMzQkQsb0JBQW9CLE1BQWEsRUFBRSxPQUFjO0lBQ3pDLElBQUksR0FBRyxHQUFjLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFJLENBQUM7SUFDdkQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFRixpQkFBaUIsTUFBWSxFQUFDLEdBQVk7SUFDbEMsSUFBSSxHQUFHLEdBQVcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUksQ0FBQztJQUNsRCxNQUFNLENBQUMsV0FBVyxDQUFFLEdBQUcsQ0FBRSxDQUFDO0lBQ2hDLGFBQWE7QUFDZCxDQUFDO0FBSUYsSUFBYyxXQUFXLENBcUh4QjtBQXJIRCxXQUFjLFdBQVcsRUFBQSxDQUFDO0lBSXpCOzs7T0FHRztJQUNILHNCQUE2QixPQUFhLEVBQUUsTUFBWTtRQUVqRCxrREFBa0Q7UUFFbEQsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBQyxRQUFRLENBQUMsQ0FBQztRQUVsQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDNUMsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUUsQ0FBQztRQUMzQyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxXQUFXLENBQUUsS0FBSyxDQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLFdBQVcsQ0FBRSxVQUFVLENBQUMsS0FBSyxFQUFDLFVBQVUsQ0FBQyxDQUFFLENBQUM7UUFHN0MsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsR0FBUyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUNyQixPQUFPLENBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUUsQ0FBQztRQUNoQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpCLElBQUksQ0FBQyxXQUFXLENBQUUsS0FBSyxDQUFFLENBQUM7UUFFdEIsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUUsQ0FBQztRQUVyQyxJQUFJLENBQUMsV0FBVyxDQUFFLElBQUksQ0FBRSxDQUFDO1FBRXJCLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMxQyxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUUvQiwyQ0FBMkM7UUFDM0MsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsNkNBQTZDO1FBQzdDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqRSxJQUFJLGNBQWMsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFBO1FBQ3pELE9BQU8sQ0FBRSxTQUFTLEVBQUUsY0FBYyxDQUFFLENBQUM7UUFDckMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuQyw0Q0FBNEM7UUFDNUMscUNBQXFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsV0FBVyxDQUFFLFVBQVUsQ0FBQyxLQUFLLEVBQUMsVUFBVSxDQUFDLENBQUUsQ0FBQztRQUU3QyxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sQ0FBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLFdBQVcsQ0FBRSxPQUFPLENBQUUsQ0FBQztRQUV4QixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBRTFDLElBQUksQ0FBQyxXQUFXLENBQUUsTUFBTSxDQUFFLENBQUM7UUFFM0IsZ0VBQWdFO1FBRWhFLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRTFELGdEQUFnRDtRQUNoRCxJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFTLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQztRQUM3QixJQUFJLEdBQUcsR0FBUyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsb0RBQW9ELENBQUMsQ0FBQSxLQUFLO1FBQ3BFLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsT0FBTyxDQUFFLENBQUMsRUFBRSxPQUFPLENBQUUsQ0FBQztRQUUxQixZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU1QyxJQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxHQUFTLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQztRQUMvQixPQUFPLENBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBRSxDQUFDO1FBQzVCLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxXQUFXLENBQUUsaUJBQWlCLENBQUUsQ0FBQztRQUV0QyxJQUFJLENBQUMsV0FBVyxDQUFFLFVBQVUsQ0FBQyxLQUFLLEVBQUMsVUFBVSxDQUFDLENBQUUsQ0FBQztRQUtqRCxJQUFJLElBQUksR0FBVyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBSSxDQUFDLENBQUMsUUFBUTtRQUM5RCxJQUFJLEVBQUUsR0FBWSxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBSSxDQUFDO1FBQ2xELElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUU7UUFDdEQsRUFBRSxDQUFDLFdBQVcsQ0FBRSxTQUFTLENBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLDJCQUEyQjtRQUNyQixZQUFZO1FBQ1osb0RBQW9EO1FBQ3BELElBQUksRUFBRSxHQUFXLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFJLENBQUM7UUFDakQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLHlDQUF5QztRQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBQyxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBekdlLHdCQUFZLGVBeUczQixDQUFBO0FBSUYsQ0FBQyxFQXJIYSxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQXFIeEI7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQkk7OztBQy9KSixxQkFBbUIsUUFBUSxDQUFDLENBQUE7QUFDNUIsOEJBQTRCLGlCQUFpQixDQUFDLENBQUE7QUFDOUMsNEJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDO0lBQUE7SUFHQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUhBLEFBR0MsSUFBQTtBQUVFLGlGQUFpRjtBQUVqRixJQUFJLE1BQU0sR0FBRztJQUNWLE9BQU8sRUFBRTtRQUNOO1lBQ0csUUFBUSxFQUFFO2dCQUNQLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixLQUFLLEVBQUUsZUFBZTthQUN4QjtTQUNIO1FBQ0Q7WUFDRyxRQUFRLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLEtBQUssRUFBRSxnQkFBZ0I7YUFDekI7U0FDSDtLQUNIO0NBQ0gsQ0FBQztBQUlGO0lBQ0k7SUFBZ0IsQ0FBQztJQUNqQix1QkFBRyxHQUFILFVBQUksQ0FBVTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFDRCx1QkFBRyxHQUFILFVBQUksRUFBVztRQUNYLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTCxnQkFBQztBQUFELENBUkEsQUFRQyxJQUFBO0FBQUEsQ0FBQztBQUNGO0lBQ0k7SUFBZ0IsQ0FBQztJQUNqQiwrQkFBSSxHQUFKLFVBQUssQ0FBUztRQUNWLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDTCx1QkFBQztBQUFELENBTkEsQUFNQyxJQUFBO0FBQUEsQ0FBQztBQUVGO0lBQ0k7SUFBZ0IsQ0FBQztJQUNqQixtQkFBRyxHQUFILFVBQUksQ0FBUSxFQUFDLFdBQWtCO1FBQzdCLGdCQUFnQjtRQUNoQixJQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFFLENBQUM7UUFDcEMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBRSxDQUFDO1FBQzNELElBQUksTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBRSxDQUFDO1FBQ2xELHVCQUF1QjtRQUNwQixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1FBQ2pFLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekMseUNBQXlDO1FBQ3pDLElBQUksbUJBQW1CLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hELENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixDQUFDLEdBQUcsbUJBQW1CLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxVQUFVLENBQUMsQ0FBQztRQUNyQyxFQUFFLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNuQix5REFBeUQ7UUFDekQsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0QsbUJBQUcsR0FBSCxVQUFJLEVBQVc7UUFDWCxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0wsWUFBQztBQUFELENBdEJBLEFBc0JDLElBQUE7QUFBQSxDQUFDO0FBR0YsNkNBQTZDO0FBQzdDLG1EQUFtRDtBQUNuRCxJQUFJLEVBQUUsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQ3pCLElBQUksRUFBRSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDckIsSUFBSSxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBQ2xDLHNFQUFzRTtBQUN0RTs7Ozs7R0FLRztBQUVHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLEtBQUs7SUFDekQsZUFBZTtJQUNmLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQyxDQUFDLENBQUM7QUFDVixJQUFJLG9CQUEwQixDQUFDO0FBQy9CO0lBQ0csb0JBQW9CLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7SUFDM0MsSUFBSSxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7SUFDckMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7SUFDM0MsK0NBQStDO0lBQy9DLFdBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLG9CQUFvQixFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDdEQsSUFBSSxDQUFDLFVBQVMsTUFBcUI7UUFDaEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNuRCxHQUFHLENBQUMsQ0FBZ0IsVUFBZSxFQUFmLEtBQUEsTUFBTSxDQUFDLFFBQVEsRUFBZixjQUFlLEVBQWYsSUFBZSxDQUFDO2dCQUEvQixJQUFJLE9BQU8sU0FBQTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFNUIsSUFBSSxJQUFJLEdBQVUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNoRSxrRUFBa0U7Z0JBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLHlCQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBQyxJQUFJLENBQUMsQ0FBQzthQUMxQztRQUNMLENBQUM7SUFDTCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFTCxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3JCLDRDQUE0QztJQUU1QyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDekQsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUV0RCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFFOUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsQ0FBQztRQUN0QixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsd0JBQXdCO1FBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFJeEIsQ0FBQztJQUNELDBCQUEwQjtJQUMxQixJQUFJLFNBQVMsR0FBUyxFQUFFLENBQUM7SUFDekIsU0FBUyxHQUFHLENBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxTQUFTLENBQUMsQ0FBQztJQUU1QyxJQUFJLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQzVDLFdBQUksQ0FBQyxXQUFXLEVBQUU7U0FDZixJQUFJLENBQUMsVUFBUyxNQUFxQjtRQUNoQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNMLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUMseUJBQXlCLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUdMLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDO1FBQ3RDLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLEVBQUUsR0FBWSxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBSSxDQUFDO1FBQ2xELElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUU7UUFDcEQsRUFBRSxDQUFDLFdBQVcsQ0FBRSxTQUFTLENBQUUsQ0FBQztRQUM1QixVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDO1FBQ3ZCLElBQUksRUFBRSxHQUFZLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFJLENBQUM7UUFDbEQsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEdBQUMsQ0FBQyxDQUFDLENBQUU7UUFDckQsRUFBRSxDQUFDLFdBQVcsQ0FBRSxTQUFTLENBQUUsQ0FBQztRQUM1QixVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRzlCLENBQUM7SUFDRCxJQUFJO0lBRUosNkJBQTZCLEVBQVcsRUFBRSxHQUFZO1FBQ25ELElBQUksRUFBRSxHQUFVLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFJLENBQUM7UUFDL0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQzFCLENBQUM7SUFDRCxzQkFBc0IsRUFBVztRQUM5QixtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNELHNCQUFzQixFQUFXO1FBQzlCLHNDQUFzQztRQUN0QyxtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELDRCQUE0QixFQUFXLEVBQUMsSUFBYTtRQUNsRCxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXJDLElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMzQixrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVELElBQUksQ0FBQyxHQUFVLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFJLENBQUM7UUFDakQsQ0FBQyxDQUFDLEVBQUUsR0FBRyxjQUFjLEdBQUMsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN6QixFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUNELDRCQUE0QixFQUFXO1FBQ3BDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFckMsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFbEUsT0FBTyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzNCLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxDQUFDO0lBQ0osQ0FBQztJQUdELDJCQUEyQixFQUFXLEVBQUMsSUFBYTtRQUNqRCxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNqQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekQsdUNBQXVDO1FBRXZDLHFEQUFxRDtRQUNyRCw0RkFBNEY7UUFDNUYsRUFBRSxDQUFDLENBQUUsU0FBUyxDQUFDLE1BQU0sSUFBRSxDQUFFLENBQUMsQ0FBQSxDQUFDO1lBQ3hCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBSSxHQUFHLENBQUUsRUFBRSxHQUFDLElBQUksSUFBSSxFQUFFLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDO1FBQzNDLENBQUM7UUFBQSxJQUFJLENBQUEsQ0FBQztRQUNOLENBQUM7UUFDRCxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBRWYsQ0FBQztJQUVELDJCQUEyQixFQUFPO1FBQy9CLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkQsSUFBSSxHQUFHLEdBQXVCLFVBQVcsQ0FBQyxLQUFLLENBQUM7UUFDaEQsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELHlCQUF5QixFQUFRO1FBQzlCLElBQUksS0FBSyxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzlELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUM7WUFDUixZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNoQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUFBLElBQUksQ0FBQSxDQUFDO1lBQ0gsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDaEMsa0JBQWtCLENBQUMsaUJBQWlCLEVBQUMsWUFBWSxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsMEJBQTBCO0lBQzdCLENBQUM7SUFDRCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3ZELElBQUksY0FBYyxHQUF3QixVQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0UsSUFBSSxlQUFlLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0MsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUVuQyx3QkFBd0IsS0FBVztRQUNoQyw2Q0FBNkM7UUFDN0MsbUJBQW1CO1FBQ25CLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUEsWUFBWTtRQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsNEJBQTRCO1FBQ25ELElBQUksR0FBRyxHQUFHLGVBQWUsQ0FBRTtRQUMzQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQ2pDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsQ0FBQztRQUNELCtCQUErQjtRQUMvQix3Q0FBd0M7UUFDeEMsMkdBQTJHO1FBQzNHLCtHQUErRztRQUMvRyw4SkFBOEo7SUFDaEssQ0FBQztJQUVGLGdDQUFnQyxFQUFRO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsRUFBRSxHQUFHLElBQUksQ0FBQztRQUVWLGdDQUFnQztRQUNoQyxzQkFBc0I7UUFDdEIsMEdBQTBHO1FBQzFHLElBQUksSUFBSSxHQUFTLEVBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsNEJBQTRCO1FBQzVCLGtCQUFrQjtRQUNsQjs7OztVQUlFO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBQyxJQUFJLEdBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFFLENBQUM7UUFDakUsTUFBTSxDQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNYLEtBQUssZUFBZTtnQkFDakIsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNwQixLQUFLLENBQUM7WUFDVCxLQUFLLGlCQUFpQjtnQkFDbkIsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQztZQUNULFFBQVE7UUFHWCxDQUFDO1FBR0QsRUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLGtDQUFrQztJQUNyQyxDQUFDO0lBQ0QsZ0RBQWdEO0lBQ2hELElBQUksS0FBSyxHQUFVLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUksQ0FBQztJQUN6RCxzREFBc0Q7SUFDdEQsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFDO0lBQ3JCLEdBQUcsQ0FBQSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVqQyxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQ25DLDZGQUE2RjtRQUM3Rix5QkFBeUI7UUFDekIsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUMsc0JBQXNCLENBQUM7SUFhdkMsQ0FBQztJQUVELGtCQUFrQjtJQUNsQjs7OztNQUlFO0lBRUYscUNBQXFDO0lBQ3JDLHNDQUFzQztJQUd0Qzs7Ozs7O01BTUU7SUFDRjs7Ozs7TUFLRTtJQUNJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQko7SUFFRiw2REFBNkQ7QUFFaEUsQ0FBQztBQUVELDRCQUE0QjtBQUU1QixvQkFBb0I7QUFFcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNkJFOztBQ2phTCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuXHJcbmRlY2xhcmUgdmFyIGNvbnRleHRVcmw6IHN0cmluZztcclxuXHJcbmV4cG9ydCBtb2R1bGUgQWpheCB7XHJcbiAgICAvL3ZhciBjb250ZXh0VXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvQ1dBL1wiO1xyXG5cdGNvbnN0IHVybEJhc2U6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NlYXJjaFwiO1xyXG5cdGNvbnN0IHVybEJhc2VfbWV0YWRhdGE6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldE1ldGFkYXRhXCI7XHJcblx0Y29uc3QgaGVhZGVycyA9IHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb24sKi8qO3E9MC44XCIgfTtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5UXVlcnkocXVlcnk6IFN0cmluZywgZmlsdGVyczogRmlsdGVyT3B0aW9ucywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcInF1ZXJ5PVwiICsgcXVlcnkpO1xyXG5cclxuXHRcdGxldCBmaWx0ZXJQYXJhbXM6IHN0cmluZyA9IGZpbHRlcnMudG9VcmxQYXJhbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX1wiLGZpbHRlclBhcmFtcyk7XHJcblx0XHRpZiAoZmlsdGVyUGFyYW1zICE9PSBcIlwiKSBwYXJhbXMucHVzaChmaWx0ZXJQYXJhbXMpO1xyXG5cclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZSArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNZXRhZGF0YSgpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZV9tZXRhZGF0YSA7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUlxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVNpbWlsYXIoYXJ0aWNsZUlkOiBTdHJpbmcsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHQvLyBUT0RPXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn0iLCJleHBvcnQgY2xhc3MgRmlsdGVyT3B0aW9ucyB7XHJcblxyXG5cdHRvcGljczogc3RyaW5nW10gPSBbXTtcclxuXHRzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBmcm9tRGF0ZTogc3RyaW5nID0gXCIxOTgwLTAxLTAxXCI7XHJcblx0dG9EYXRlOiBzdHJpbmcgPSBcIjIwMjAtMDEtMDFcIjsgLy8gYnVnICwgYmV0dGVyIGRlZmF1bHRzID8gXHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwiZnJvbT1cIiArIHRoaXMuZnJvbURhdGUpO1xyXG5cdFx0aWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcInRvPVwiICsgdGhpcy50b0RhdGUpO1xyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiZnVuY3Rpb24gY3JlYXRlRWxlbShlbE5hbWU6c3RyaW5nLCBjbHNOYW1lOnN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIHRtcCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbE5hbWUpICApO1xyXG4gICAgICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG5cdFx0cmV0dXJuIHRtcDtcclxuXHR9XHJcblxyXG5mdW5jdGlvbiBhZGRUZXh0KHBhcmVudCA6IGFueSx0eHQgOiBzdHJpbmcpe1xyXG4gICAgICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkgICk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKCB0bXAgKTtcclxuXHRcdC8vcmV0dXJuIHRtcDtcclxuXHR9XHJcbiAgICBcclxuICAgIFxyXG5cclxuZXhwb3J0IG1vZHVsZSBIdG1sQnVpbGRlcntcclxuXHJcblxyXG4gICAgXHJcblx0LyoqXHJcblx0ICogQnVpbGQgaHRtbCBsaSBlbGVtZW50IGZyb20gYXJ0aWNsZSBvYmplY3RcclxuXHQgKiBra2tcclxuXHQgKi9cclxuXHRleHBvcnQgZnVuY3Rpb24gYnVpbGRBcnRpY2xlKGFydGljbGUgOiBhbnksIHBhcmVudCA6IGFueSl7XHJcbiAgICBcclxuICAgICAgICAvL3ZhciB0bXBfY2xlYXJmaXggPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjbGVhcmZpeFwiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcm9vdCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcInJlc3VsdFwiKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY29udGFpbmVyX3RvcGljXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcGljX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggdG9waWNfYnV0dG9uLCBhcnRpY2xlLnRvcGljICk7XHJcbiAgICAgICAgICAgIHRvcGljLmFwcGVuZENoaWxkKHRvcGljX2J1dHRvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggdG9waWMgKTtcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjbGVhcmZpeFwiKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJ0aXRsZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBhLCBhcnRpY2xlLnRpdGxlICk7XHJcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIHRpdGxlICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsaW5rID0gY3JlYXRlRWxlbShcImRpdlwiLFwibGlua1wiKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGxpbmssIGFydGljbGUudXJsICk7ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKCBsaW5rICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY29udGFpbmVyX2RhdGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLFwiZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVfeSA9IHJhd19kYXRlLnN1YnN0cmluZygwLDQpO1xyXG4gICAgICAgICAgICAgICAgLy8gaGVyZSBmaXJlZm94IGpzIGJyb3dzZXIgYnVnIG9uIHN1YnN0cig1LDcpXHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZV9tID0gcmF3X2RhdGUuc3Vic3RyaW5nKDUsNykucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGVfZCA9IHJhd19kYXRlLnN1YnN0cmluZyg4LDEwKS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdHRlZF9kYXRlID0gZGF0ZV9kICsgXCIuXCIgKyBkYXRlX20gKyBcIi5cIiArIGRhdGVfeVxyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggZGF0ZV9kYXRlLCBmb3JtYXR0ZWRfZGF0ZSApO1xyXG4gICAgICAgICAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAgICAgICAgIC8vdmFyIGRhdGVfdGltZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsXCJ0aW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9kYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX3RpbWUpO1xyXG4gICAgICAgICAgICBkYXRlLmFwcGVuZENoaWxkKGRhdGVfYnV0dG9uKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGRhdGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY29udGVudFwiKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGNvbnRlbnQsIGFydGljbGUuZXh0cmFjdGVkVGV4dC5zdWJzdHJpbmcoMCwzMDApKTsgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNvbnRlbnQgKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImF1dGhvclwiKTtcclxuICAgICAgICAgICAgICAgIGFkZFRleHQoIGF1dGhvciwgYXJ0aWNsZS5hdXRob3IgKTsgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGF1dGhvciApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGltZyBzcmM9XCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNvbnRhaW5lcl9idXR0b25zXCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gYnVnIHJlZmFjIHRvZG8sIGhlcmUgYXVma2xhcHBlbiBsYW5nZXIgdGV4dCAhXHJcbiAgICAgICAgICAgIHZhciBjYWNoZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgYS5ocmVmID0gXCIjY2FjaGVfaWRfMTEyMzI0M1wiO1xyXG4gICAgICAgICAgICAgICAgdmFyIGltZyA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjsvL1wiXCI7XHJcbiAgICAgICAgICAgICAgICBhLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgICAgICBhZGRUZXh0KCBhLCBcIkNhY2hlXCIgKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYWNoZV9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKGNhY2hlX2J1dHRvbik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHNpbWlsYXJfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NpbWlsYXJfaWRfMTEyMzI0M1wiO1xyXG4gICAgICAgICAgICAgICAgYWRkVGV4dCggYSwgXCJTaW1pbGFyXCIgKTtcclxuICAgICAgICAgICAgc2ltaWxhcl9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoc2ltaWxhcl9idXR0b24pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lcl9idXR0b25zICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCggY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIikgKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB2YXIgX3RtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpICApOyAvLzogYW55O1xyXG4gICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9wa2ljIGtrXCIpIDtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgX3RtcC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLF90bXApO1xyXG5cdFx0Ly9wYXJlbnQuYXBwZW5kQ2hpbGQoX3RtcCk7XHJcbiAgICAgICAgLy9yZXR1cm4gZWw7XHJcbiAgICAgICAgLy8gdW5zYXViZXJlciBjb2RlLCBidWlsZCB1bmQgYXBwZW5kIHRyZW5uZW4gZXZlbnRsP1xyXG4gICAgICAgIHZhciBsaSA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZChyb290KTtcclxuXHRcdHBhcmVudC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixsaSk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBcclxuXHJcbn1cclxuXHJcbi8qXHJcblxyXG5cclxuICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgXHJcbiAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMDsgaSsrKXsgLy9idWdcclxuICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2psLmxvZyhcIlRoaXMgcG9zdCB3YXNcXG5cIixcImVyclwiKTtcclxuICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAxNTsgaSsrKXtcclxuICAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgLy8gYnVnIGVycm9mIG9mIHR5cGVzY3JpcHQgPz9cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBcclxuICAqL1xyXG5cclxuIiwiaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5pbXBvcnQge0h0bWxCdWlsZGVyfSBmcm9tIFwiLi9IdG1sQnVpbGRlclwiO1xyXG5cclxuY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcblx0ZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcblx0YXJ0aWNsZXM6IGFueVtdOyAvLyBUT0RPIGRlZmluZSBBcnRpY2xlIHdoZW4gQXJ0aWNsZSBzZXJ2ZXIgY2xhc3MgaXMgc3RhYmxlXHJcbn1cclxuXHJcbiAgIC8vZGVjbGFyZSB2YXIgJDsgYnVnLCBwbGFjZSB0aGlzIGluIGRlZmluaXRvbiBmaWxlPywgaG93IHRvIGVtYmVkIG90aGVyIGpzIGRvY3M9P1xyXG5cclxuICAgdmFyIHJlc3VsdCA9IHsgXHJcbiAgICAgIFwiY2FyZHNcIjogW1xyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiU291cmNlXCIsXHJcbiAgICAgICAgICAgICAgIFwiam9iXCI6IFwiVGhpcyBpcyBhIGpvYlwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICAgXCJhY3Rpb25cIjoge1xyXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJQb3VyY2VcIixcclxuICAgICAgICAgICAgICAgXCJqb2JcIjogXCJUaGlzIGlzIGEgam9pblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0sXHJcbiAgICAgIF1cclxuICAgfTtcclxuICAgXHJcbiAgIFxyXG5cclxuICAgY2xhc3MgTXlDb25zb2xlIHtcclxuICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICBsb2cocyA6IHN0cmluZykge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIrcyk7XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgY3MubG9nKFwiXCIrcyk7XHJcbiAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIrcywgXCJudGZcIik7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG4gICBjbGFzcyBKc0xvZyB7XHJcbiAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgbG9nKHM6c3RyaW5nLHN0YXR1c19uYW1lOnN0cmluZykge1xyXG4gICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgIHZhciBzdGF0dXMgPSBbXCJlcnJcIiwgXCJtc2dcIiwgXCJudGZcIiBdO1xyXG4gICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIiBdO1xyXG4gICAgICAgICB2YXIgY29sb3JzID0gW1wiRkY2MTU5XCIsIFwiRkY5RjUxXCIsXCIyMkI4RUJcIixcIlwiLFwiXCIgXTsgXHJcbiAgICAgICAgIC8vICAgICAgICAgICAgIG9yYW5nZSAgXHJcbiAgICAgICAgICAgIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyAvL2luIGNvbnN0cnVjdG9yIHJlaW5cclxuICAgICAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAgICAgLy8gYWxsZXJ0IHJhc2llIGJ1ZyAsIGVycm8gcmlmIGNvbF9pZCA8IDBcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5X25hbWUgPSBzdGF0dXNfZGlzcGxheVtjb2xfaWRdXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj5cIik7XHJcbiAgICAgICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSBzLnJlcGxhY2UoXCJcXG5cIixcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIC8vamwucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICB9XHJcbiAgICAgICBnZXQoaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICB9XHJcbiAgIH07XHJcbiAgIFxyXG5cclxuICAgLy92YXIgZ3JlZXRlciA9IG5ldyBHcmVldGVyKFwiSGVsbG8sIHdvcmxkIVwiKTtcclxuICAgLy8gRXhjYXQgb3JkZXIgb2YgdGhlc2UgbmV4dCBjb21tYW5kcyBpcyBpbXBvcnRhbnQgXHJcbiAgIHZhciBjcyA9IG5ldyBNeUNvbnNvbGUoKTsgICAgXHJcbiAgIHZhciBqbCA9IG5ldyBKc0xvZygpO1xyXG4gICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcbiAgIC8vIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyBidWcgd2h5IG5vdCBoZXJlIGdsb2JhbFxyXG4gICAvKlxyXG4gICAgICAgJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgY29uc29sZS5sb2coJ3RzIDEnKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93Lm9ubG9hZFxyXG4gICAgKi9cclxuICAgIFxyXG4gICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICAgICAgLy92YXIgayA9IFwia2pcIjtcclxuICAgICAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gdmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zIDogYW55OyBcclxuIGZ1bmN0aW9uIG9uX2xvYWQoKXtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzLnB1c2goXCJQb2xpdGljc1wiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXMucHVzaChcImNublwiKTtcclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IFwiMjAxNi0xMi0yNVwiO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgQWpheC5nZXRCeVF1ZXJ5KFwiVGlnZXIgV29vZHNcIiwgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCxyZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsbGlzdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjcy5sb2coXCJoaSAtLS0tLS0gXCIpO1xyXG4gICAgICAvL2NzLmdldChcInJlc1wiKS5pbm5lckhUTUwgPSBncmVldGVyLmdyZWV0KCk7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG4gICAgICBcclxuICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICBcclxuICAgICAgZm9yICh2YXIgaT0wOyBpPCAwOyBpKyspeyAvL2J1Z1xyXG4gICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgIC8vamwubG9nKFwiVGhpcyBwb3N0IHdhc1xcblwiLFwiZXJyXCIpO1xyXG4gICAgICAgICAvL2psLmxvZyhpLFwibXNnXCIpO1xyXG4gICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBidWcgZ2V0IHNvdXJjZXMgdG9kbyAhIVxyXG4gICAgICB2YXIgdG9waWNfc2V0IDogYW55ID0gW107XHJcbiAgICAgIHRvcGljX3NldCA9IFtcInRvcGljIDFcIixcInRvcGljIDJcIixcInRvcGljIDNcIl07XHJcbiAgICAgIFxyXG4gICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICAgIEFqYXguZ2V0TWV0YWRhdGEoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLFwiTmV3IEFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIFxyXG4gICAgICBmb3IgKHZhciBpPTA7IGk8IHRvcGljX3NldC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIHRvcGljTmFtZSA9IHRvcGljX3NldFtpXTtcclxuICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b3BpY05hbWUpIDtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMTU7IGkrKyl7XHJcbiAgICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGljIFwiK2kpIDtcclxuICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgICAgIC8vIGJ1ZyBlcnJvZiBvZiB0eXBlc2NyaXB0ID8/XHJcbiAgICAgIH1cclxuICAgICAgLy8qL1xyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gZWxlbWVudF9zZXRfZGlzcGxheShpZCA6IHN0cmluZywgdmFsIDogc3RyaW5nKXtcclxuICAgICAgICAgdmFyIGVsID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSAgKTtcclxuICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbDtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBlbGVtZW50X3Nob3coaWQgOiBzdHJpbmcpe1xyXG4gICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcImJsb2NrXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfaGlkZShpZCA6IHN0cmluZyl7XHJcbiAgICAgICAgIC8vY2hlY2sgc3RhdHVzPyByYWlzZSBlcnJvciBpZiBoaWRkZW4/XHJcbiAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY3JlYXRlKGlkIDogc3RyaW5nLHRleHQgOiBzdHJpbmcpe1xyXG4gICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICAgdmFyIGUgPSAoPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIikgICk7XHJcbiAgICAgICAgIGUuaWQgPSBcInNwYW5faGlkZGVuX1wiK2lkO1xyXG4gICAgICAgICBlLmNsYXNzTmFtZSA9IFwic3Bhbl9oaWRkZW5cIjtcclxuICAgICAgICAgZS5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgICAgICBlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZSk7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2RlbGV0ZShpZCA6IHN0cmluZyl7XHJcbiAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZCA6IHN0cmluZyx0ZXh0IDogc3RyaW5nKXtcclxuICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG4gICAgICAgICAvL2VsLmdldEVsZW1lbnRCeUlkKFwic3Bhbl9oaWRkZW5fXCIraWQpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgLy8gV2VubiBrZWluIEhpZGRlbiBTcGFuIGRhLCBkYW5uIHdlcnQgaW1tZXIgZmFsc2NoISFcclxuICAgICAgICAgLy9idWcgYXNzdW1lcyBqdXN0IG9uZSBjbGFzIHJhaXNlIHdhcm5pZ24gaWYgbW9yZSBjbGFzc2VzICEhICwgY2xlYXJlZCwgYnkgY2hlY2sgbGVuZ2h0ID09IDFcclxuICAgICAgICAgaWYgKCBzcGFuX2xpc3QubGVuZ3RoPT0xICl7XHJcbiAgICAgICAgICAgIHZhciBzcGFuID0gc3Bhbl9saXN0WzBdO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFuLmlubmVySFRNTCwgdGV4dCk7XHJcbiAgICAgICAgICAgIGJvb2wgPSAoIFwiXCIrdGV4dCA9PSBcIlwiK3NwYW4uaW5uZXJIVE1MICk7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIGNzLmxvZyhcIlwiK2Jvb2wpO1xyXG4gICAgICAgICByZXR1cm4gYm9vbDtcclxuICAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2tleXdvcmRzKGVsOiBhbnkpeyBcclxuICAgICAgICAgdmFyIGZsZF9zZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIik7XHJcbiAgICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgIGNvbm4ucG9zdChrZXl3b3Jkcyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2ZpbHRlcihlbCA6IGFueSl7IC8vIGJ1ZyBrZXkgbm90IHVzZWRcclxuICAgICAgICAgdmFyIGNoZWNrID0gc3Bhbl9oaWRkZW5fY2hlY2soXCJmaWx0ZXJfc2V0dGluZ3NcIixcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgIGlmIChjaGVjayl7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfaGlkZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgc3Bhbl9oaWRkZW5fZGVsZXRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIGNsb3NpbmcuXCIsXCJudGZcIik7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50X3Nob3coXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgIHNwYW5faGlkZGVuX2NyZWF0ZShcImZpbHRlcl9zZXR0aW5nc1wiLFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBvcGVuaW5nLlwiLFwibnRmXCIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIC8vc2hvdyBoaWRlLCBub3QgdG9nZ2xlICEhXHJcbiAgICAgIH1cclxuICAgICAgdmFyIGRhdGVfc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgIHZhciBkYXRlX3N0YXJ0X3N0ciA9ICAoPEhUTUxJbnB1dEVsZW1lbnQ+IGRhdGVfc3RhcnQpLnZhbHVlLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgICB2YXIgZGF0ZV9zdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZV9zdGFydF9zdHIpO1xyXG4gICAgICBjcy5sb2coXCJcIitkYXRlX3N0YXJ0X2RhdGUpO1xyXG4gICAgICBjcy5sb2coZGF0ZV9zdGFydF9kYXRlLnRvU3RyaW5nKCkpO1xyXG4gICAgICBcclxuICAgICAgZnVuY3Rpb24gY2hlY2tfdXJsX25hbWUoZXZlbnQgOiBhbnkpe1xyXG4gICAgICAgICAvL3ZhciB1cmxfbmFtZSA9IHdpbmRvdy5sb2NhdGlvbjsvLy5wYXRobmFtZTtcclxuICAgICAgICAgLy9jcy5sb2codXJsX25hbWUpO1xyXG4gICAgICAgICB2YXIgdXJsX2hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDsvLy5wYXRobmFtZTtcclxuICAgICAgICAgY29uc29sZS5sb2codXJsX2hhc2gpOyAvLyBkb2VzIG5vdCB3b3JrIGluIGllPz8gISEhXHJcbiAgICAgICAgIHZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIiA7XHJcbiAgICAgICAgIGlmICh1cmxfaGFzaC5pbmRleE9mKFwiI1wiK2tleSkgPT0gMCl7XHJcbiAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihrZXkpO1xyXG4gICAgICAgICAgICBjcy5sb2coa2V5KTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICAvL2lmICNzZWFyY2hfZmlsdGVyIGluIHVybF9oYXNoXHJcbiAgICAgICAgIC8vbXVsdGlmbGFnX2xhc3RfaGFzaCA9IHNlYXJjaF9maWx0ZXIuLi5cclxuICAgICAgICAgLy9zaG93IGZpbGV0ZXIsIHNlYWNoIGtleXdvcmRzLCBzaG93IGNhY2hlIChncmV5LCBibHVlLCBibGFjayBhbmQgd2hpdGUsIHRoZW1lIGFsbCBuZXcgY2FjaGUsIGRvIHBvc3QgcmVxLilcclxuICAgICAgICAgLy8gaWYga2V5d29yZHMsIHBvc3QgYWN0aW9uID0gc2VyYWNoIHN1YmFjdGlvbiA9IGtleXdvcmRzIGRhdGEgPSBrZXl3b3JkcyBhcnJheSwgb3IgY2FjaGVfaWQgcmVxdWVzdCBpbmZvcy4uLiwgXHJcbiAgICAgICAgIC8vIHRoZW4gc2hvdywgcG9zdCB1cGRhdGUgZ3JleSBhcmUgcHJvZ3Jlc3MgYmFyLCBmaWx0ZXIgaW5mb3MgZ2V0IGxvY2FsIHN0b3JhZ2UgZmlsdGVyc19fLi4sIGdldCBmaWx0ZXJzIGZyb20gcGFnZT8gbWFya2VkIChzcGFuIG1hcmtlLCByZWFsIHZhbHVlLCBkaXNwbGF5Li4uXHJcbiAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBmdW5jdGlvbiBwcm9jZXNzX2NsaWNrX29yX2VudGVyKGV2IDogYW55KXtcclxuICAgICAgICAgY29uc29sZS5sb2coZXYpO1xyXG4gICAgICAgICBlbCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAvLyBiYWQgZ2l2ZXMgZnVsbCBocmVmIHdpdGggbGlua1xyXG4gICAgICAgICAvL3ZhciBocmVmID0gZWwuaHJlZjsgXHJcbiAgICAgICAgIC8vIG5pY2UsIGdpdmVzIHJhdyBocmVmLCBmcm9tIGVsZW1lbnQgb25seSAoIGUuZy4gI3NlYXJjaF9maWx0ZXIsIGluc3RlYWQgb2Ygd3d3Lmdvb2dsZS5jb20vI3NlYWNoX2ZpbHRlcilcclxuICAgICAgICAgdmFyIGhyZWYgPSAoPGFueT5lbCkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcclxuICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSk7XHJcbiAgICAgICAgIC8vdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgICAvL2tleSA9IFwiI1wiICsga2V5O1xyXG4gICAgICAgICAvKlxyXG4gICAgICAgICB2YXIgaXNfc2FtZSA9IChocmVmID09IGtleSkgO1xyXG4gICAgICAgICBpZiAoaXNfc2FtZSl7IC8vdXJsX2hhc2guaW5kZXhPZihcIiNcIitrZXkpID09IDBcclxuICAgICAgICAgfVxyXG4gICAgICAgICAqLyBcclxuICAgICAgICAgY29uc29sZS5sb2coXCJpbmZvIGhyZWYgc3dpdGhjLS1cIitocmVmK1wiLS1cIik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiYm9vbFwiLCBocmVmPT1cInNlYWNoX2ZpbHRlclwiLCBocmVmLCBcInNlYWNoX2ZpbHRlclwiICk7XHJcbiAgICAgICAgIHN3aXRjaChocmVmKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic2VhcmNoX2tleXdvcmRzXCI6XHJcbiAgICAgICAgICAgICAgIGZfc2VhcmNoX2tleXdvcmRzKGVsKTtcclxuICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgIC8vZGVmYXVsdCBjb2RlIGJsb2NrXHJcbiAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgfSBcclxuICAgICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICAgICBjcy5sb2coXCIjIHNlbGVjdGlvbiB3YXMgLSBcIitocmVmKTtcclxuICAgICAgICAgY29uc29sZS5sb2coXCJocmVmXCIsaHJlZik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICAgLy9jcy5sb2coZWwuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSk7XHJcbiAgICAgIH1cclxuICAgICAgLy9yZXBlYXQgdGhpcyBlYWNoIDAuMjUgc2Vjb25kICEhIGJ1ZyB0b2RvIHJlZmFjXHJcbiAgICAgIHZhciBjb2xfYSA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkFcIikgICk7XHJcbiAgICAgIC8vdmFyIGxpc3RfYSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBjb2xfYSwgMCApO1xyXG4gICAgICB2YXIgbGlzdF9hOiBhbnkgPSBbXTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSBsaXN0X2EucHVzaChjb2xfYVtpXSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBcImxpXCIsIGxpc3RfYSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBcImxpXCIsIGNvbF9hLmxlbmd0aCk7XHJcbiAgICAgIFxyXG4gICAgICBmb3IodmFyIGk9MDtpPGNvbF9hLmxlbmd0aDtpKyspIHsgLy8gaWYgeW91IGhhdmUgbmFtZWQgcHJvcGVydGllc1xyXG4gICAgICAgICB2YXIgYW5jaCA9IGxpc3RfYVtpXTsgLy8gKDxhbnk+IHgpO1xyXG4gICAgICAgICAvLyB0b2RvIGJ1ZywgcmVmYWMsIGNoZWNrIGlmIGNsYXNzIGlzIG5vcm1hbCBsaW5rLCB0aGVuIGRvbnQgYWRkIGFueSBzcGVjaWFsIG9uY2xpY2sgaGFuZGxpbmdcclxuICAgICAgICAgLy9jb25zb2xlLmxvZyhcImlcIiwgYW5jaCk7XHJcbiAgICAgICAgIC8vdmFyIGFuY2ggPSAoPGFueT4gbGlzdF9hW2ldICApO1xyXG4gICAgICAgICBhbmNoLm9uY2xpY2s9cHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgLypmdW5jdGlvbigpey8qIHNvbWUgY29kZSAqIC9cclxuICAgICAgICAgICAgKCBhbmNoICk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgLy8gTmVlZCB0aGlzIGZvciBJRSwgQ2hyb21lID9cclxuICAgICAgICAgLyogXHJcbiAgICAgICAgIGFuY2gub25rZXlwcmVzcz1mdW5jdGlvbihlKXsgLy9pZSA/P1xyXG4gICAgICAgICAgICBpZihlLndoaWNoID09IDEzKXsvL0VudGVyIGtleSBwcmVzc2VkXHJcbiAgICAgICAgICAgICAgIHByb2Nlc3NfY2xpY2tfb3JfZW50ZXIoIGFuY2ggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvL3ZhciBhbmNoID0gbnVsbDtcclxuICAgICAgLypcclxuICAgICAgZm9yKHZhciB4IGluIHJlc3VsdCkgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgIGFuY2ggPSByZXN1bHRbeF07XHJcbiAgICAgIH1cclxuICAgICAgKi9cclxuICAgICAgXHJcbiAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuY2hvcklEJylcclxuICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5jaG9ySUQnKS5cclxuICAgICAgXHJcbiAgICAgICBcclxuICAgICAgLypcclxuICAgICAgaWYgKHdpbmRvdy5vbnBvcHN0YXRlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGNoZWNrX3VybF9uYW1lO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gY2hlY2tfdXJsX25hbWU7XHJcbiAgICAgIH1cclxuICAgICAgKi9cclxuICAgICAgLypcclxuICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAvL2NvbnNvbGUubG9nKFwibG9jYXRpb246IFwiICsgZG9jdW1lbnQubG9jYXRpb24gKyBcIiwgc3RhdGU6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXZlbnQuc3RhdGUpKTtcclxuICAgICAgICAgY2hlY2tfdXJsX25hbWUoKTtcclxuICAgICAgfTtcclxuICAgICAgKi9cclxuICAgICAgICAgICAgLypcclxuICAgICAgXHJcbiAgICAgICAgICAgIGJ1ZyBhZGQgc2VyYWNoIGJ1dHRvbiBzZWFyY2ggYnV0dG9uXHJcbiAgICAgIFxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBsaXN0ZW5lcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHB1c2hVcmwgPSAoaHJlZikgPT4ge1xyXG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgaHJlZik7XHJcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdwb3BzdGF0ZScpKTtcclxuICAgICAgfTtcclxuICAgICAgICAgICAgXHJcbiAgICAgIHZhciBkYXRlc3RyaW5nID0gJChcIiNkYXRlXCIpLnZhbCgpLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGVzdHJpbmcpO1xyXG4gICAgICAvL2RhdGUudG9zdHJpbmcoKSk7XHRcclxuICAgICAgdmFyIGVsZW1lbnRzX3NlbD0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI1Rlc3QsICNUZXN0IConKTtcclxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBhbGVydCgnSGVsbG8gd29ybGQgYWdhaW4hISEnKTtcclxuICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAqL1xyXG4gICAgICBcclxuICAgICAgLy8kKCcuc3lzIGlucHV0W3R5cGU9dGV4dF0sIC5zeXMgc2VsZWN0JykuZWFjaChmdW5jdGlvbigpIHt9KVxyXG5cclxuICAgfVxyXG4gICBcclxuICAgLy93aW5kb3cub25sb2FkID0gb25fbG9hZCgpO1xyXG4gICBcclxuICAgLy8jdHNjIC0td2F0Y2ggLXAganNcclxuICAgXHJcbiAgIC8qXHJcbiAgICAgIGNsZWFuIHVwIGpzLCB0c1xyXG4gICAgICAtIG9uIGVudGVyIHNlYXJjaCwgYWR2YW5jZWQgc2VhcmNoXHJcbiAgICAgIC0gb2ZmZXIgZGF0ZSByYW5nZVxyXG4gICAgICAtIG9mZmVyIHRoZW1lcy90b3BpY3NcclxuICAgICAgLSBvZmZlciBsdXBlIHNob3csIHVzZSBiYWNrcm91bmcgaW1hZ2U/PyBiZXR0ZXIsIGJlY2F1c2UgY3NzIGNoYW5nZWJhclxyXG4gICAgICAtIG9uY2xpY2sgYSBocmVmIG9wZW4gY2FjaGUsIHNlYXJjaCBzaW1pbGFyIChpbnRlcnZhbGwgZ2V0IG5ldyB1cmwpLCBldmVudCBuZXcgcGFnZT8gb25wYWdlbG9hZD9cclxuICAgICAgLSBvbiBcclxuICAgICAgLSBzZW5kIHBvc3QgY2xhc3MsIGJpbmQgY2xpY2tzIC4uLlxyXG4gICAgICAtIEZpbHRlciBieSB0b3BpYywgYnkgZGF0ZVxyXG4gICAgICAtIGJ1dHRvbiAsIGJhbm5lciAsIHByb2dyZXNzIGJhciBmb3Igc2VhcmNoLCBzaG93IHBvc3QgaW5mbyAhIVxyXG4gICAgICAtIGZhdm9yaXRlIHRvcGljcyBpbiBzZXBhcnRlL2ZpcnN0IGxpbmUgKHdyaXRlIG15IGZhdm9yaXRlcz0gPyBvciBub3QpXHJcbiAgICAgIFxyXG4gICAgICAtIHRvcGljcyB5YSA8YT4gZm9yIGtleW1vdmVcclxuICAgICAgLSB0ZXN0IGV2ZXJ5dGhpbmcga2V5bW92ZVxyXG4gICAgICAtIGZpbHRlciwgbHVwZSBrZXltb3ZlIGNvbG9yXHJcbiAgICAgIFxyXG4gICAgICAtIGJ1ZyBhZGQgc2VyYWNoIGJ1dHRvbiBzZWFyY2ggYnV0dG9uXHJcbiAgICAgIFxyXG4gICAgICAtIGZpbHRlciBhZGQgPCA8IF5hcnJvdyBkb3duIGRhenUgYXVma2xhcHAgYXJyb3cgISFcclxuICAgICAgLSBqc29uIHRvIGh0bWwgZm9yIHJlc3VsdCAhIVxyXG4gICAgICAtIHBvcHN0YXRlIGlvLCBJRSA/PyBcclxuICAgICAgXHJcbiAgICAgIC0gcGFyc2UgZGF0ZSwgdG9waWMgb24gc2VydmVyIGZvciB2YWxpZGF0aW5nICEhXHJcbiAgICAgIC0gbWFyayB1c2Ugb2Ygb3RoZXIgYXV0aG9yIGxpYnJhcmllcyAhISBmb3IgZGF0ZSAhISwgXHJcbiAgICAgIC0gY2xvc2UgZmlsdGVyIHggKGhpZGUgZmlsZGVyIC8gc3ltYm9sUD8pXHJcbiAgICAgIFxyXG4gICAgICBhcHBseSBmaWx0ZXJcclxuICAgXHJcbiAgICovXHJcbiAgIFxyXG4gICAiLCIiXX0=
