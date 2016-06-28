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
var MetadataResult = (function () {
    function MetadataResult() {
    }
    return MetadataResult;
}());
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
document.addEventListener("DOMContentLoaded", function (event) {
    on_load();
});
var global_filterOptions;
function search_demo() {
    console.log("--------------search_demo----------");
    on_load();
}
function set_metaData(result) {
    var topic_list = document.getElementById("select_topic_list");
    var topic_set = [];
    topic_set = ["topic 1", "topic 2", "topic 3"];
    topic_set = result.topics;
    for (var i = 0; i < topic_set.length; i++) {
        var topicName = topic_set[i];
        var el = document.createElement('li');
        var text_node = document.createTextNode(topicName);
        el.appendChild(text_node);
        topic_list.appendChild(el);
    }
}
function ini_set_metaData() {
    var cs_log_ajax_hint_1 = "____new_ajax____";
    Ajax_1.Ajax.getMetadata()
        .done(function (result) {
        if (result.errorMessage !== null) {
            console.log(cs_log_ajax_hint_1, result.errorMessage);
        }
        else {
            console.log(cs_log_ajax_hint_1, "New topics received:");
            console.log(cs_log_ajax_hint_1, result.topics); //.articles);
            set_metaData(result);
        }
    })
        .fail(function () {
        console.log(cs_log_ajax_hint_1, "Sending request failed!");
    });
}
function on_load() {
    ini_set_metaData();
    global_filterOptions = new FilterOptions_1.FilterOptions();
    var cs_log_ajax_hint = "___ajax___ ";
    //global_filterOptions.topics.push("Politics");
    //global_filterOptions.sources.push("cnn");
    //global_filterOptions.toDate = "2016-12-25";
    //global_filterOptions.fromDate = "2000-12-25";
    var keywords = document.getElementById("fld_search").value;
    console.log("__keyword__" + "-" + keywords + "-");
    Ajax_1.Ajax.getByQuery(keywords, global_filterOptions, 0, 10)
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
    var list = document.getElementById("result_sample_list");
    list.innerHTML = "";
    var sample = document.getElementById("result_sample");
    for (var i = 0; i < 0; i++) {
        var el = sample.cloneNode(true); // bug overwritten by ts
        list.appendChild(el);
    }
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
    function f_search_keywords_old(el) {
        var fld_search = document.getElementById("fld_search");
        var fld = fld_search.value;
        var keywords = fld;
        conn.post(keywords);
    }
    function f_search_keywords(el) {
        console.log("--------------search_demo----------");
        on_load();
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
        // bug todo refac bad important
        anch.onclick = process_click_or_enter;
    }
}
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

   apply filter

*/
},{"./Ajax":1,"./FilterOptions":2,"./HtmlBuilder":3}],5:[function(require,module,exports){

},{}]},{},[4,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0lBLElBQWMsSUFBSSxDQWdEakI7QUFoREQsV0FBYyxJQUFJLEVBQUMsQ0FBQztJQUNoQixnREFBZ0Q7SUFDbkQsSUFBTSxPQUFPLEdBQVcsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0lBQzFELElBQU0sZ0JBQWdCLEdBQVcsVUFBVSxHQUFHLGFBQWEsQ0FBQztJQUM1RCxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FB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RSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVoQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNwQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQ25DLDZGQUE2RjtRQUM3Rix5QkFBeUI7UUFDekIsaUNBQWlDO1FBRWpDLCtCQUErQjtRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDO0lBZTFDLENBQUM7QUFDTCxDQUFDO0FBR1c7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWtCSjtBQUVGLDZEQUE2RDtBQUdoRSw0QkFBNEI7QUFFNUIsb0JBQW9CO0FBRXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF3QkU7O0FDaFlMIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuICAgIC8vdmFyIGNvbnRleHRVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9DV0EvXCI7XHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9tZXRhZGF0YTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0TWV0YWRhdGFcIjtcclxuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlRdWVyeShxdWVyeTogU3RyaW5nLCBmaWx0ZXJzOiBGaWx0ZXJPcHRpb25zLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicXVlcnk9XCIgKyBxdWVyeSk7XHJcblxyXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fXCIsZmlsdGVyUGFyYW1zKTtcclxuXHRcdGlmIChmaWx0ZXJQYXJhbXMgIT09IFwiXCIpIHBhcmFtcy5wdXNoKGZpbHRlclBhcmFtcyk7XHJcblxyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUlxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKCk6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlX21ldGFkYXRhIDtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5U2ltaWxhcihhcnRpY2xlSWQ6IFN0cmluZywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdC8vIFRPRE9cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufSIsImV4cG9ydCBjbGFzcyBGaWx0ZXJPcHRpb25zIHtcclxuXHJcblx0dG9waWNzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdHNvdXJjZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGZyb21EYXRlOiBzdHJpbmcgPSBcIjE5ODAtMDEtMDFcIjtcclxuXHR0b0RhdGU6IHN0cmluZyA9IFwiMjAyMC0wMS0wMVwiOyAvLyBidWcgLCBiZXR0ZXIgZGVmYXVsdHMgPyBcclxuICAgIFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0IGZpbHRlciBvcHRpb25zIHRvIHVybCBwYXJhbWV0ZXIgc3RyaW5nIG9mIGZvcm1hdFxyXG5cdCAqIFwicGFyYW0xPXZhbHVlMSZwYXJhbTI9dmFsdWUyJnBhcmFtND12YWx1ZTNcIiBmb3IgdXNlIGFzIHVybCBwYXJhbWV0ZXJzLlxyXG5cdCAqL1xyXG5cdHRvVXJsUGFyYW0oKTogc3RyaW5nIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMudG9waWNzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJ0b3BpY3M9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy50b3BpY3MpKTtcclxuXHRcdGlmICh0aGlzLnNvdXJjZXMubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInNvdXJjZXM9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy5zb3VyY2VzKSk7XHJcblx0XHRpZiAodGhpcy5mcm9tRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJmcm9tPVwiICsgdGhpcy5mcm9tRGF0ZSk7XHJcblx0XHRpZiAodGhpcy50b0RhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY29uY2F0TXVsdGlQYXJhbShhcnJheTogc3RyaW5nW10pOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGFycmF5LmpvaW4oXCI7XCIpO1xyXG5cdH1cclxufVxyXG4iLCJmdW5jdGlvbiBjcmVhdGVFbGVtKGVsTmFtZTogc3RyaW5nLCBjbHNOYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgdmFyIHRtcCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbE5hbWUpKTtcclxuICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG4gICAgcmV0dXJuIHRtcDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkVGV4dChwYXJlbnQ6IGFueSwgdHh0OiBzdHJpbmcpIHtcclxuICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRtcCk7XHJcbiAgICAvL3JldHVybiB0bXA7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IG1vZHVsZSBIdG1sQnVpbGRlciB7XHJcblxyXG5cclxuICAgIFxyXG5cdC8qKlxyXG5cdCAqIEJ1aWxkIGh0bWwgbGkgZWxlbWVudCBmcm9tIGFydGljbGUgb2JqZWN0XHJcblx0ICoga2trXHJcblx0ICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gYnVpbGRBcnRpY2xlKGFydGljbGU6IGFueSwgcGFyZW50OiBhbnkpIHtcclxuICAgIFxyXG4gICAgICAgIC8vdmFyIHRtcF9jbGVhcmZpeCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciByb290ID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInJlc3VsdFwiKTtcclxuXHJcbiAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl90b3BpY1wiKTtcclxuICAgICAgICB2YXIgdG9waWNfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgIGFkZFRleHQodG9waWNfYnV0dG9uLCBhcnRpY2xlLnRvcGljKTtcclxuICAgICAgICB0b3BpYy5hcHBlbmRDaGlsZCh0b3BpY19idXR0b24pO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHRvcGljKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRpdGxlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInRpdGxlXCIpO1xyXG4gICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGEuaHJlZiA9IGFydGljbGUudXJsO1xyXG4gICAgICAgIGFkZFRleHQoYSwgYXJ0aWNsZS50aXRsZSk7XHJcbiAgICAgICAgdGl0bGUuYXBwZW5kQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG5cclxuICAgICAgICB2YXIgbGluayA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJsaW5rXCIpO1xyXG4gICAgICAgIGFkZFRleHQobGluaywgYXJ0aWNsZS51cmwuc3Vic3RyaW5nKDAsIDQ1KSk7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQobGluayk7XHJcblxyXG4gICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9kYXRlXCIpO1xyXG4gICAgICAgIHZhciBkYXRlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICB2YXIgZGF0ZV9kYXRlID0gY3JlYXRlRWxlbShcInNwYW5cIiwgXCJkYXRlXCIpO1xyXG4gICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vYnVnIHN1YnN0ciBvdGhlciBiZWhhdmlvdXIgdGhhbiBzdWJzdHJpbmdcclxuICAgICAgICB2YXIgZGF0ZV95ID0gcmF3X2RhdGUuc3Vic3RyaW5nKDAsIDQpO1xyXG4gICAgICAgIC8vIGhlcmUgZmlyZWZveCBqcyBicm93c2VyIGJ1ZyBvbiBzdWJzdHIoNSw3KVxyXG4gICAgICAgIHZhciBkYXRlX20gPSByYXdfZGF0ZS5zdWJzdHJpbmcoNSwgNykucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG4gICAgICAgIHZhciBkYXRlX2QgPSByYXdfZGF0ZS5zdWJzdHJpbmcoOCwgMTApLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1hdHRlZF9kYXRlID0gZGF0ZV9kICsgXCIuXCIgKyBkYXRlX20gKyBcIi5cIiArIGRhdGVfeVxyXG4gICAgICAgIGFkZFRleHQoZGF0ZV9kYXRlLCBmb3JtYXR0ZWRfZGF0ZSk7XHJcbiAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAvL3ZhciBkYXRlX3RpbWUgPSBjcmVhdGVFbGVtKFwic3BhblwiLFwidGltZVwiKTtcclxuICAgICAgICAvL2RhdGVfYnV0dG9uLmFwcGVuZENoaWxkKGRhdGVfdGltZSk7XHJcbiAgICAgICAgZGF0ZS5hcHBlbmRDaGlsZChkYXRlX2J1dHRvbik7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChkYXRlKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuICAgICAgICB2YXIgY29udGVudCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50XCIpO1xyXG4gICAgICAgIGFkZFRleHQoY29udGVudCwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0LnN1YnN0cmluZygwLCAzMDApKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICAgICAgICB2YXIgY29udGVudF9jYWNoZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50X2NhY2hlXCIpO1xyXG4gICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0KTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250ZW50X2NhY2hlKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBhdXRob3IgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiYXV0aG9yXCIpO1xyXG4gICAgICAgIGFkZFRleHQoYXV0aG9yLCBhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoYXV0aG9yKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBpbWcgc3JjPVwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY29udGFpbmVyX2J1dHRvbnMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX2J1dHRvbnNcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIC8vIGJ1ZyByZWZhYyB0b2RvLCBoZXJlIGF1ZmtsYXBwZW4gbGFuZ2VyIHRleHQgIVxyXG4gICAgICAgIHZhciBjYWNoZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgYS5ocmVmID0gXCIjY2FjaGVfaWRfXCIgKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7XHJcbiAgICAgICAgdmFyIGltZyA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgIGltZy5zcmMgPSBcIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7Ly9cIlwiO1xyXG4gICAgICAgIGEuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICBhZGRUZXh0KGEsIFwiQ2FjaGVcIik7XHJcblxyXG4gICAgICAgIGNhY2hlX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICBjb250YWluZXJfYnV0dG9ucy5hcHBlbmRDaGlsZChjYWNoZV9idXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgc2ltaWxhcl9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjsgLy8xMTIzMjQzXHJcbiAgICAgICAgYWRkVGV4dChhLCBcIlNpbWlsYXJcIik7XHJcbiAgICAgICAgc2ltaWxhcl9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKHNpbWlsYXJfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250YWluZXJfYnV0dG9ucyk7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgdmFyIF90bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7IC8vOiBhbnk7XHJcbiAgICAgICAgdmFyIGVsID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUb3BraWMga2tcIik7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICBfdG1wLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsIF90bXApO1xyXG4gICAgICAgIC8vcGFyZW50LmFwcGVuZENoaWxkKF90bXApO1xyXG4gICAgICAgIC8vcmV0dXJuIGVsO1xyXG4gICAgICAgIC8vIHVuc2F1YmVyZXIgY29kZSwgYnVpbGQgdW5kIGFwcGVuZCB0cmVubmVuIGV2ZW50bD9cclxuICAgICAgICB2YXIgbGkgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHJvb3QpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgbGkpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4vKlxyXG5cclxuXHJcbiAgICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgdG9waWNfbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0X3RvcGljX2xpc3RcIik7XHJcbiAgICAgIFxyXG4gICAgICBmb3IgKHZhciBpPTA7IGk8IDA7IGkrKyl7IC8vYnVnXHJcbiAgICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgLy9qbC5sb2coXCJUaGlzIHBvc3Qgd2FzXFxuXCIsXCJlcnJcIik7XHJcbiAgICAgICAgIC8vamwubG9nKGksXCJtc2dcIik7XHJcbiAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGJ1ZyBnZXQgc291cmNlcyB0b2RvICEhXHJcbiAgICAgIGZvciAodmFyIGk9MDsgaTwgMTU7IGkrKyl7XHJcbiAgICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGljIFwiK2kpIDtcclxuICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgICAgIC8vIGJ1ZyBlcnJvZiBvZiB0eXBlc2NyaXB0ID8/XHJcbiAgICAgIH1cclxuICAgICAgLy9cclxuICAgICAgXHJcbiAgKi9cclxuXHJcbiIsIi8qXHJcbiAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gKi9cclxuXHJcbmltcG9ydCB7QWpheH0gZnJvbSBcIi4vQWpheFwiO1xyXG5pbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuaW1wb3J0IHtIdG1sQnVpbGRlcn0gZnJvbSBcIi4vSHRtbEJ1aWxkZXJcIjtcclxuXHJcbmNsYXNzIEFydGljbGVSZXN1bHQge1xyXG4gICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBhcnRpY2xlczogYW55W107IC8vIFRPRE8gZGVmaW5lIEFydGljbGUgd2hlbiBBcnRpY2xlIHNlcnZlciBjbGFzcyBpcyBzdGFibGVcclxufVxyXG5jbGFzcyBNZXRhZGF0YVJlc3VsdCB7XHJcbiAgICAvL2FydGljbGVzOiBhbnlbXTsgLy8gVE9ETyBkZWZpbmUgQXJ0aWNsZSB3aGVuIEFydGljbGUgc2VydmVyIGNsYXNzIGlzIHN0YWJsZVxyXG4gICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBzb3VyY2VzOiBzdHJpbmdbXTtcclxuICAgIHRvcGljczogc3RyaW5nW107XHJcbn1cclxuXHJcblxyXG5jbGFzcyBNeUNvbnNvbGUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIGxvZyhzOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlwiICsgcyk7XHJcbiAgICB9XHJcbiAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICB9XHJcbn07XHJcbmNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgY3MubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICBqbC5sb2coXCJwb3N0OiBcIiArIHMsIFwibnRmXCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY2xhc3MgSnNMb2cge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIGxvZyhzOiBzdHJpbmcsIHN0YXR1c19uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgdmFyIHN0YXR1cyA9IFtcImVyclwiLCBcIm1zZ1wiLCBcIm50ZlwiXTtcclxuICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIl07XHJcbiAgICAgICAgdmFyIGNvbG9ycyA9IFtcIkZGNjE1OVwiLCBcIkZGOUY1MVwiLCBcIjIyQjhFQlwiLCBcIlwiLCBcIlwiXTsgXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgb3JhbmdlICBcclxuICAgICAgICB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgLy9pbiBjb25zdHJ1Y3RvciByZWluXHJcbiAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAvLyBhbGxlcnQgcmFzaWUgYnVnICwgZXJybyByaWYgY29sX2lkIDwgMFxyXG4gICAgICAgIHZhciBzdGF0dXNfZGlzcGxheV9uYW1lID0gc3RhdHVzX2Rpc3BsYXlbY29sX2lkXVxyXG4gICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIiwgXCI8YnI+XCIpO1xyXG4gICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgdmFyIHR4dCA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj48YnI+XCIpO1xyXG4gICAgICAgIGpsLmlubmVySFRNTCA9IHR4dDtcclxuICAgICAgICAvL2psLnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI1wiK2NvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIgKyBjb2xvcnNbY29sX2lkXTtcclxuICAgIH1cclxuICAgIGdldChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIH1cclxufTtcclxuICAgXHJcblxyXG4vL3ZhciBncmVldGVyID0gbmV3IEdyZWV0ZXIoXCJIZWxsbywgd29ybGQhXCIpO1xyXG4vLyBFeGNhdCBvcmRlciBvZiB0aGVzZSBuZXh0IGNvbW1hbmRzIGlzIGltcG9ydGFudCBcclxudmFyIGNzID0gbmV3IE15Q29uc29sZSgpO1xyXG52YXIgamwgPSBuZXcgSnNMb2coKTtcclxudmFyIGNvbm4gPSBuZXcgU2VydmVyQ29ubmVjdGlvbigpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHsgXHJcbiAgICBvbl9sb2FkKCk7XHJcbn0pO1xyXG5cclxudmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zOiBhbnk7XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hfZGVtbygpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS1zZWFyY2hfZGVtby0tLS0tLS0tLS1cIik7XHJcbiAgICBvbl9sb2FkKCk7XHJcbn1cclxuZnVuY3Rpb24gc2V0X21ldGFEYXRhKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgIHZhciB0b3BpY19zZXQ6IGFueSA9IFtdO1xyXG4gICAgdG9waWNfc2V0ID0gW1widG9waWMgMVwiLCBcInRvcGljIDJcIiwgXCJ0b3BpYyAzXCJdO1xyXG5cclxuICAgIHRvcGljX3NldCA9IHJlc3VsdC50b3BpY3M7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BpY19zZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgdG9waWNOYW1lID0gdG9waWNfc2V0W2ldO1xyXG4gICAgICAgIHZhciBlbCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRvcGljTmFtZSk7XHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiBpbmlfc2V0X21ldGFEYXRhKCk6IGFueSB7XHJcbiAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICBBamF4LmdldE1ldGFkYXRhKClcclxuICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IE1ldGFkYXRhUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyB0b3BpY3MgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQudG9waWNzKTsvLy5hcnRpY2xlcyk7XHJcbiAgICAgICAgICAgICAgICBzZXRfbWV0YURhdGEocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIHJlc3VsdDsgLy9idWcgYXN5bmNocm9udW9zICEhXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uX2xvYWQoKSB7XHJcbiAgICAgIFxyXG4gICAgaW5pX3NldF9tZXRhRGF0YSgpO1xyXG5cclxuICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3MucHVzaChcIlBvbGl0aWNzXCIpO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5zb3VyY2VzLnB1c2goXCJjbm5cIik7XHJcbiAgICAvL2dsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IFwiMjAxNi0xMi0yNVwiO1xyXG4gICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICBcclxuICAgIHZhciBrZXl3b3JkcyA9ICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxkX3NlYXJjaFwiKSkudmFsdWU7XHJcbiAgICBjb25zb2xlLmxvZyhcIl9fa2V5d29yZF9fXCIgKyBcIi1cIiArIGtleXdvcmRzICsgXCItXCIpO1xyXG4gICAgQWpheC5nZXRCeVF1ZXJ5KGtleXdvcmRzLCBnbG9iYWxfZmlsdGVyT3B0aW9ucywgMCwgMTApXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICBsaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG5cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDA7IGkrKykgeyAvL2J1Z1xyXG4gICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgfVxyXG4gICAgIFxyXG4gICAgZnVuY3Rpb24gZWxlbWVudF9zZXRfZGlzcGxheShpZDogc3RyaW5nLCB2YWw6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBlbCA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xyXG4gICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBlbGVtZW50X3Nob3coaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwiYmxvY2tcIik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBlbGVtZW50X2hpZGUoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIC8vY2hlY2sgc3RhdHVzPyByYWlzZSBlcnJvciBpZiBoaWRkZW4/XHJcbiAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJub25lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpKTtcclxuICAgICAgICBlLmlkID0gXCJzcGFuX2hpZGRlbl9cIiArIGlkO1xyXG4gICAgICAgIGUuY2xhc3NOYW1lID0gXCJzcGFuX2hpZGRlblwiO1xyXG4gICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICBlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZChlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2RlbGV0ZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgdmFyIGJvb2wgPSBmYWxzZTtcclxuICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAvLyBXZW5uIGtlaW4gSGlkZGVuIFNwYW4gZGEsIGRhbm4gd2VydCBpbW1lciBmYWxzY2ghIVxyXG4gICAgICAgIC8vYnVnIGFzc3VtZXMganVzdCBvbmUgY2xhcyByYWlzZSB3YXJuaWduIGlmIG1vcmUgY2xhc3NlcyAhISAsIGNsZWFyZWQsIGJ5IGNoZWNrIGxlbmdodCA9PSAxXHJcbiAgICAgICAgaWYgKHNwYW5fbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICB2YXIgc3BhbiA9IHNwYW5fbGlzdFswXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3Bhbi5pbm5lckhUTUwsIHRleHQpO1xyXG4gICAgICAgICAgICBib29sID0gKFwiXCIgKyB0ZXh0ID09IFwiXCIgKyBzcGFuLmlubmVySFRNTCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3MubG9nKFwiXCIgKyBib29sKTtcclxuICAgICAgICByZXR1cm4gYm9vbDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHNfb2xkKGVsOiBhbnkpIHtcclxuICAgICAgICB2YXIgZmxkX3NlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxkX3NlYXJjaFwiKTtcclxuICAgICAgICB2YXIgZmxkID0gKDxIVE1MSW5wdXRFbGVtZW50PiBmbGRfc2VhcmNoKS52YWx1ZTtcclxuICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgY29ubi5wb3N0KGtleXdvcmRzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcyhlbDogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLXNlYXJjaF9kZW1vLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICBvbl9sb2FkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZl9zZWFyY2hfZmlsdGVyKGVsOiBhbnkpIHsgLy8gYnVnIGtleSBub3QgdXNlZFxyXG4gICAgICAgIHZhciBjaGVjayA9IHNwYW5faGlkZGVuX2NoZWNrKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICBpZiAoY2hlY2spIHtcclxuICAgICAgICAgICAgZWxlbWVudF9oaWRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBzcGFuX2hpZGRlbl9kZWxldGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgY2xvc2luZy5cIiwgXCJudGZcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbWVudF9zaG93KFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICBzcGFuX2hpZGRlbl9jcmVhdGUoXCJmaWx0ZXJfc2V0dGluZ3NcIiwgXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIG9wZW5pbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3Nob3cgaGlkZSwgbm90IHRvZ2dsZSAhIVxyXG4gICAgfVxyXG4gICAgdmFyIGRhdGVfc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICB2YXIgZGF0ZV9zdGFydF9zdHIgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGRhdGVfc3RhcnQpLnZhbHVlLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgdmFyIGRhdGVfc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGVfc3RhcnRfc3RyKTtcclxuICAgIGNzLmxvZyhcIlwiICsgZGF0ZV9zdGFydF9kYXRlKTtcclxuICAgIGNzLmxvZyhkYXRlX3N0YXJ0X2RhdGUudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tfdXJsX25hbWUoZXZlbnQ6IGFueSkge1xyXG4gICAgICAgIC8vdmFyIHVybF9uYW1lID0gd2luZG93LmxvY2F0aW9uOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgIC8vY3MubG9nKHVybF9uYW1lKTtcclxuICAgICAgICB2YXIgdXJsX2hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDsvLy5wYXRobmFtZTtcclxuICAgICAgICBjb25zb2xlLmxvZyh1cmxfaGFzaCk7IC8vIGRvZXMgbm90IHdvcmsgaW4gaWU/PyAhISFcclxuICAgICAgICB2YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCI7XHJcbiAgICAgICAgaWYgKHVybF9oYXNoLmluZGV4T2YoXCIjXCIgKyBrZXkpID09IDApIHtcclxuICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGtleSk7XHJcbiAgICAgICAgICAgIGNzLmxvZyhrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2lmICNzZWFyY2hfZmlsdGVyIGluIHVybF9oYXNoXHJcbiAgICAgICAgLy9tdWx0aWZsYWdfbGFzdF9oYXNoID0gc2VhcmNoX2ZpbHRlci4uLlxyXG4gICAgICAgIC8vc2hvdyBmaWxldGVyLCBzZWFjaCBrZXl3b3Jkcywgc2hvdyBjYWNoZSAoZ3JleSwgYmx1ZSwgYmxhY2sgYW5kIHdoaXRlLCB0aGVtZSBhbGwgbmV3IGNhY2hlLCBkbyBwb3N0IHJlcS4pXHJcbiAgICAgICAgLy8gaWYga2V5d29yZHMsIHBvc3QgYWN0aW9uID0gc2VyYWNoIHN1YmFjdGlvbiA9IGtleXdvcmRzIGRhdGEgPSBrZXl3b3JkcyBhcnJheSwgb3IgY2FjaGVfaWQgcmVxdWVzdCBpbmZvcy4uLiwgXHJcbiAgICAgICAgLy8gdGhlbiBzaG93LCBwb3N0IHVwZGF0ZSBncmV5IGFyZSBwcm9ncmVzcyBiYXIsIGZpbHRlciBpbmZvcyBnZXQgbG9jYWwgc3RvcmFnZSBmaWx0ZXJzX18uLiwgZ2V0IGZpbHRlcnMgZnJvbSBwYWdlPyBtYXJrZWQgKHNwYW4gbWFya2UsIHJlYWwgdmFsdWUsIGRpc3BsYXkuLi5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcm9jZXNzX2NsaWNrX29yX2VudGVyKGV2OiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhldik7XHJcbiAgICAgICAgZWwgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBiYWQgZ2l2ZXMgZnVsbCBocmVmIHdpdGggbGlua1xyXG4gICAgICAgIC8vdmFyIGhyZWYgPSBlbC5ocmVmOyBcclxuICAgICAgICAvLyBuaWNlLCBnaXZlcyByYXcgaHJlZiwgZnJvbSBlbGVtZW50IG9ubHkgKCBlLmcuICNzZWFyY2hfZmlsdGVyLCBpbnN0ZWFkIG9mIHd3dy5nb29nbGUuY29tLyNzZWFjaF9maWx0ZXIpXHJcbiAgICAgICAgdmFyIGhyZWYgPSAoPGFueT5lbCkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcclxuICAgICAgICBocmVmID0gaHJlZi5zbGljZSgxKTtcclxuICAgICAgICAvL3ZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAvL2tleSA9IFwiI1wiICsga2V5O1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgdmFyIGlzX3NhbWUgPSAoaHJlZiA9PSBrZXkpIDtcclxuICAgICAgICBpZiAoaXNfc2FtZSl7IC8vdXJsX2hhc2guaW5kZXhPZihcIiNcIitrZXkpID09IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuICAgICAgICBjb25zb2xlLmxvZyhcImluZm8gaHJlZiBzd2l0aGMtLVwiICsgaHJlZiArIFwiLS1cIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJib29sXCIsIGhyZWYgPT0gXCJzZWFjaF9maWx0ZXJcIiwgaHJlZiwgXCJzZWFjaF9maWx0ZXJcIik7XHJcbiAgICAgICAgc3dpdGNoIChocmVmKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfa2V5d29yZHNcIjpcclxuICAgICAgICAgICAgICAgIGZfc2VhcmNoX2tleXdvcmRzKGVsKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvL2RlZmF1bHQgY29kZSBibG9ja1xyXG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY3MubG9nKFwiIyBzZWxlY3Rpb24gd2FzIC0gXCIgKyBocmVmKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImhyZWZcIiwgaHJlZik7XHJcbiAgICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4gICAgICAgIC8vY3MubG9nKGVsLmdldEF0dHJpYnV0ZShcImhyZWZcIikpO1xyXG4gICAgfVxyXG4gICAgLy9yZXBlYXQgdGhpcyBlYWNoIDAuMjUgc2Vjb25kICEhIGJ1ZyB0b2RvIHJlZmFjXHJcbiAgICB2YXIgY29sX2EgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJBXCIpKTtcclxuICAgIC8vdmFyIGxpc3RfYSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBjb2xfYSwgMCApO1xyXG4gICAgdmFyIGxpc3RfYTogYW55ID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSBsaXN0X2EucHVzaChjb2xfYVtpXSk7XHJcbiAgICBjb25zb2xlLmxvZyhcImxpXCIsIGxpc3RfYSk7XHJcbiAgICBjb25zb2xlLmxvZyhcImxpXCIsIGNvbF9hLmxlbmd0aCk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgdmFyIGFuY2ggPSBsaXN0X2FbaV07IC8vICg8YW55PiB4KTtcclxuICAgICAgICAvLyB0b2RvIGJ1ZywgcmVmYWMsIGNoZWNrIGlmIGNsYXNzIGlzIG5vcm1hbCBsaW5rLCB0aGVuIGRvbnQgYWRkIGFueSBzcGVjaWFsIG9uY2xpY2sgaGFuZGxpbmdcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiaVwiLCBhbmNoKTtcclxuICAgICAgICAvL3ZhciBhbmNoID0gKDxhbnk+IGxpc3RfYVtpXSAgKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBidWcgdG9kbyByZWZhYyBiYWQgaW1wb3J0YW50XHJcbiAgICAgICAgYW5jaC5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvKmZ1bmN0aW9uKCl7Lyogc29tZSBjb2RlICogL1xyXG4gICAgICAgICAgICggYW5jaCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBOZWVkIHRoaXMgZm9yIElFLCBDaHJvbWUgP1xyXG4gICAgICAgIC8qIFxyXG4gICAgICAgIGFuY2gub25rZXlwcmVzcz1mdW5jdGlvbihlKXsgLy9pZSA/P1xyXG4gICAgICAgICAgIGlmKGUud2hpY2ggPT0gMTMpey8vRW50ZXIga2V5IHByZXNzZWRcclxuICAgICAgICAgICAgICBwcm9jZXNzX2NsaWNrX29yX2VudGVyKCBhbmNoICk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgIH1cclxufVxyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgIFxyXG4gICAgICAgICAgICBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICBcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgbGlzdGVuZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBwdXNoVXJsID0gKGhyZWYpID0+IHtcclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIGhyZWYpO1xyXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncG9wc3RhdGUnKSk7XHJcbiAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICB2YXIgZGF0ZXN0cmluZyA9ICQoXCIjZGF0ZVwiKS52YWwoKS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlc3RyaW5nKTtcclxuICAgICAgLy9kYXRlLnRvc3RyaW5nKCkpO1x0XHJcbiAgICAgIHZhciBlbGVtZW50c19zZWw9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNUZXN0LCAjVGVzdCAqJyk7XHJcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYWxlcnQoJ0hlbGxvIHdvcmxkIGFnYWluISEhJyk7XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgKi9cclxuICAgICAgXHJcbiAgICAgIC8vJCgnLnN5cyBpbnB1dFt0eXBlPXRleHRdLCAuc3lzIHNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7fSlcclxuXHJcbiAgIFxyXG4gICAvL3dpbmRvdy5vbmxvYWQgPSBvbl9sb2FkKCk7XHJcbiAgIFxyXG4gICAvLyN0c2MgLS13YXRjaCAtcCBqc1xyXG4gICBcclxuICAgLypcclxuICAgICAgY2xlYW4gdXAganMsIHRzXHJcbiAgICAgIC0gb24gZW50ZXIgc2VhcmNoLCBhZHZhbmNlZCBzZWFyY2hcclxuICAgICAgLSBvZmZlciBkYXRlIHJhbmdlXHJcbiAgICAgIC0gb2ZmZXIgdGhlbWVzL3RvcGljc1xyXG4gICAgICAtIG9mZmVyIGx1cGUgc2hvdywgdXNlIGJhY2tyb3VuZyBpbWFnZT8/IGJldHRlciwgYmVjYXVzZSBjc3MgY2hhbmdlYmFyXHJcbiAgICAgIC0gb25jbGljayBhIGhyZWYgb3BlbiBjYWNoZSwgc2VhcmNoIHNpbWlsYXIgKGludGVydmFsbCBnZXQgbmV3IHVybCksIGV2ZW50IG5ldyBwYWdlPyBvbnBhZ2Vsb2FkP1xyXG4gICAgICAtIG9uIFxyXG4gICAgICAtIHNlbmQgcG9zdCBjbGFzcywgYmluZCBjbGlja3MgLi4uXHJcbiAgICAgIC0gRmlsdGVyIGJ5IHRvcGljLCBieSBkYXRlXHJcbiAgICAgIC0gYnV0dG9uICwgYmFubmVyICwgcHJvZ3Jlc3MgYmFyIGZvciBzZWFyY2gsIHNob3cgcG9zdCBpbmZvICEhXHJcbiAgICAgIC0gZmF2b3JpdGUgdG9waWNzIGluIHNlcGFydGUvZmlyc3QgbGluZSAod3JpdGUgbXkgZmF2b3JpdGVzPSA/IG9yIG5vdClcclxuICAgICAgXHJcbiAgICAgIC0gdG9waWNzIHlhIDxhPiBmb3Iga2V5bW92ZVxyXG4gICAgICAtIHRlc3QgZXZlcnl0aGluZyBrZXltb3ZlXHJcbiAgICAgIC0gZmlsdGVyLCBsdXBlIGtleW1vdmUgY29sb3JcclxuICAgICAgXHJcbiAgICAgIC0gYnVnIGFkZCBzZXJhY2ggYnV0dG9uIHNlYXJjaCBidXR0b25cclxuICAgICAgXHJcbiAgICAgIC0gZmlsdGVyIGFkZCA8IDwgXmFycm93IGRvd24gZGF6dSBhdWZrbGFwcCBhcnJvdyAhIVxyXG4gICAgICAtIGpzb24gdG8gaHRtbCBmb3IgcmVzdWx0ICEhXHJcblxyXG4gICAgICBhcHBseSBmaWx0ZXJcclxuICAgXHJcbiAgICovXHJcbiAgIFxyXG4gICAiLCIiXX0=
