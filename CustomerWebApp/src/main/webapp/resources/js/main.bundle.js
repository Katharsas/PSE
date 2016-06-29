(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *@auhor jmothes
 */
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
/*
 *@auhor jmothes
 */
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
/*
 *@auhor dbeckstein, jfranz
 */
"use strict";
// util functions htmlBuilder
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
        a.href = "#search_similar";
        //a.href = "#similar_id_" + article.articleId_str; //1123243
        a.setAttribute('data-articleId', article.articleId_str);
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
// Excat order of these next commands is important 
var cs = new MyConsole();
var jl = new JsLog();
var conn = new ServerConnection();
var global_filterOptions;
document.addEventListener("DOMContentLoaded", function (event) {
    on_load();
});
function search_demo() {
    console.log("--------------search_demo----------");
    on_load();
}
//Creates list of metadata li elements
function set_metaData(result) {
    var topic_set = [];
    //topic_set = ["topic 1", "topic 2", "topic 3"];
    topic_set = result.topics;
    var topic_list = document.getElementById("select_topic_list");
    for (var i = 0; i < topic_set.length; i++) {
        var topicName = topic_set[i];
        var a = document.createElement('a');
        a.href = "#set_filter"; // topics this, add to at
        //a.href = "#similar_id_" + article.articleId_str; //1123243
        a.setAttribute('data-filter-name', topicName);
        a.setAttribute('data-filter-type', "topic");
        var el = document.createElement('li');
        var text_node = document.createTextNode(topicName);
        el.appendChild(text_node);
        a.appendChild(el);
        topic_list.appendChild(a);
    }
}
// Loads metadata
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
    // load mataData (sources, and topics) bug todo sources 
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
    function f_search_similar(el) {
        console.log("------similar----", el);
        var id = el.getAttribute('data-radio-isSelected');
        console.log(id);
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
            case "search_similar":
                f_search_similar(el);
                break;
            default:
        }
        cs.log("# selection was - " + href);
        console.log("href", href);
        console.log(el);
        //cs.log(el.getAttribute("href"));
    }
    function date_was_changed(type) {
        var el = this;
        var date = el.value();
        console.log(type, date);
    }
    // Listen for changes of date
    var el_date_start = document.getElementById("date_start");
    var el_date_end = document.getElementById("date_end");
    el_date_start.onBlur = date_was_changed("start");
    el_date_end.onBlur = date_was_changed("end");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBZ0RqQjtBQWhERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLGdEQUFnRDtJQUNuRCxJQUFNLE9BQU8sR0FBVyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsSUFBTSxnQkFBZ0IsR0FBVyxVQUFVLEdBQUcsYUFBYSxDQUFDO0lBQzVELElBQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFFLENBQUM7SUFFekQsb0JBQTJCLEtBQWEsRUFBRSxPQUFzQixFQUFFLElBQVksRUFBRSxLQUFhO1FBQzVGLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUU5QixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUUzQyxJQUFJLEdB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LENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWhDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWE7UUFDbkMsNkZBQTZGO1FBQzdGLHlCQUF5QjtRQUN6QixpQ0FBaUM7UUFFakMsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUM7SUFlMUMsQ0FBQztBQUNMLENBQUM7QUFLRSw0QkFBNEI7QUFFNUIsb0JBQW9CO0FBRXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF3QkU7O0FDN1lUIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiAgICAvKlxyXG4gICAgICpAYXVob3Igam1vdGhlc1xyXG4gICAgICovXHJcblxyXG5cclxuaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcblxyXG5kZWNsYXJlIHZhciBjb250ZXh0VXJsOiBzdHJpbmc7XHJcblxyXG5leHBvcnQgbW9kdWxlIEFqYXgge1xyXG4gICAgLy92YXIgY29udGV4dFVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL0NXQS9cIjtcclxuXHRjb25zdCB1cmxCYXNlOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRBcnRpY2xlcy9zZWFyY2hcIjtcclxuXHRjb25zdCB1cmxCYXNlX21ldGFkYXRhOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRNZXRhZGF0YVwiO1xyXG5cdGNvbnN0IGhlYWRlcnMgPSB7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uLCovKjtxPTAuOFwiIH07XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVF1ZXJ5KHF1ZXJ5OiBTdHJpbmcsIGZpbHRlcnM6IEZpbHRlck9wdGlvbnMsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJxdWVyeT1cIiArIHF1ZXJ5KTtcclxuXHJcblx0XHRsZXQgZmlsdGVyUGFyYW1zOiBzdHJpbmcgPSBmaWx0ZXJzLnRvVXJsUGFyYW0oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19cIixmaWx0ZXJQYXJhbXMpO1xyXG5cdFx0aWYgKGZpbHRlclBhcmFtcyAhPT0gXCJcIikgcGFyYW1zLnB1c2goZmlsdGVyUGFyYW1zKTtcclxuXHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2UgKyBcIj9cIiArIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEoKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2VfbWV0YWRhdGEgO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlTaW1pbGFyKGFydGljbGVJZDogU3RyaW5nLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0Ly8gVE9ET1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59IiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBqbW90aGVzXHJcbiAgICAgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBGaWx0ZXJPcHRpb25zIHtcclxuXHJcblx0dG9waWNzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdHNvdXJjZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGZyb21EYXRlOiBzdHJpbmcgPSBcIjE5ODAtMDEtMDFcIjtcclxuXHR0b0RhdGU6IHN0cmluZyA9IFwiMjAyMC0wMS0wMVwiOyAvLyBidWcgLCBiZXR0ZXIgZGVmYXVsdHMgPyBcclxuICAgIFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0IGZpbHRlciBvcHRpb25zIHRvIHVybCBwYXJhbWV0ZXIgc3RyaW5nIG9mIGZvcm1hdFxyXG5cdCAqIFwicGFyYW0xPXZhbHVlMSZwYXJhbTI9dmFsdWUyJnBhcmFtND12YWx1ZTNcIiBmb3IgdXNlIGFzIHVybCBwYXJhbWV0ZXJzLlxyXG5cdCAqL1xyXG5cdHRvVXJsUGFyYW0oKTogc3RyaW5nIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMudG9waWNzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJ0b3BpY3M9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy50b3BpY3MpKTtcclxuXHRcdGlmICh0aGlzLnNvdXJjZXMubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInNvdXJjZXM9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy5zb3VyY2VzKSk7XHJcblx0XHRpZiAodGhpcy5mcm9tRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJmcm9tPVwiICsgdGhpcy5mcm9tRGF0ZSk7XHJcblx0XHRpZiAodGhpcy50b0RhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY29uY2F0TXVsdGlQYXJhbShhcnJheTogc3RyaW5nW10pOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGFycmF5LmpvaW4oXCI7XCIpO1xyXG5cdH1cclxufVxyXG4iLCIgICAgLypcclxuICAgICAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gICAgICovXHJcblxyXG4gICAgLy8gdXRpbCBmdW5jdGlvbnMgaHRtbEJ1aWxkZXJcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtKGVsTmFtZTogc3RyaW5nLCBjbHNOYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHZhciB0bXAgPSAoPEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxOYW1lKSk7XHJcbiAgICAgICAgdG1wLmNsYXNzTGlzdC5hZGQoY2xzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHRtcDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUZXh0KHBhcmVudDogYW55LCB0eHQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0bXApO1xyXG4gICAgICAgIC8vcmV0dXJuIHRtcDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IG1vZHVsZSBIdG1sQnVpbGRlciB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGQgaHRtbCBsaSBlbGVtZW50IGZyb20gYXJ0aWNsZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gYnVpbGRBcnRpY2xlKGFydGljbGU6IGFueSwgcGFyZW50OiBhbnkpIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy92YXIgdG1wX2NsZWFyZml4ID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcm9vdCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJyZXN1bHRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9waWMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX3RvcGljXCIpO1xyXG4gICAgICAgICAgICB2YXIgdG9waWNfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KHRvcGljX2J1dHRvbiwgYXJ0aWNsZS50b3BpYyk7XHJcbiAgICAgICAgICAgIHRvcGljLmFwcGVuZENoaWxkKHRvcGljX2J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHRvcGljKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwidGl0bGVcIik7XHJcbiAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBhcnRpY2xlLnVybDtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBhcnRpY2xlLnRpdGxlKTtcclxuICAgICAgICAgICAgdGl0bGUuYXBwZW5kQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsaW5rID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImxpbmtcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQobGluaywgYXJ0aWNsZS51cmwuc3Vic3RyaW5nKDAsIDQ1KSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX2RhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfZGF0ZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsIFwiZGF0ZVwiKTtcclxuICAgICAgICAgICAgdmFyIHJhd19kYXRlID0gYXJ0aWNsZS5wdWJEYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2J1ZyBzdWJzdHIgb3RoZXIgYmVoYXZpb3VyIHRoYW4gc3Vic3RyaW5nXHJcbiAgICAgICAgICAgIHZhciBkYXRlX3kgPSByYXdfZGF0ZS5zdWJzdHJpbmcoMCwgNCk7XHJcbiAgICAgICAgICAgIC8vIGhlcmUgZmlyZWZveCBqcyBicm93c2VyIGJ1ZyBvbiBzdWJzdHIoNSw3KVxyXG4gICAgICAgICAgICB2YXIgZGF0ZV9tID0gcmF3X2RhdGUuc3Vic3RyaW5nKDUsIDcpLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfZCA9IHJhd19kYXRlLnN1YnN0cmluZyg4LCAxMCkucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZF9kYXRlID0gZGF0ZV9kICsgXCIuXCIgKyBkYXRlX20gKyBcIi5cIiArIGRhdGVfeVxyXG4gICAgICAgICAgICBhZGRUZXh0KGRhdGVfZGF0ZSwgZm9ybWF0dGVkX2RhdGUpO1xyXG4gICAgICAgICAgICBkYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX2RhdGUpO1xyXG4gICAgICAgICAgICAvL3ZhciBkYXRlX3RpbWUgPSBjcmVhdGVFbGVtKFwic3BhblwiLFwidGltZVwiKTtcclxuICAgICAgICAgICAgLy9kYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX3RpbWUpO1xyXG4gICAgICAgICAgICBkYXRlLmFwcGVuZENoaWxkKGRhdGVfYnV0dG9uKTtcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChkYXRlKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudCwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0LnN1YnN0cmluZygwLCAzMDApKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50X2NhY2hlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRfY2FjaGVcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGVudF9jYWNoZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJhdXRob3JcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYXV0aG9yLCBhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpbWcgc3JjPVwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfYnV0dG9uc1wiKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBidWcgcmVmYWMgdG9kbywgaGVyZSBhdWZrbGFwcGVuIGxhbmdlciB0ZXh0ICFcclxuICAgICAgICAgICAgdmFyIGNhY2hlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI2NhY2hlX2lkX1wiICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyO1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBcIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7Ly9cIlwiO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJDYWNoZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoY2FjaGVfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaW1pbGFyX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NlYXJjaF9zaW1pbGFyXCI7XHJcbiAgICAgICAgICAgIC8vYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjsgLy8xMTIzMjQzXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcsIGFydGljbGUuYXJ0aWNsZUlkX3N0cik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJTaW1pbGFyXCIpO1xyXG4gICAgICAgICAgICBzaW1pbGFyX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKHNpbWlsYXJfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyX2J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIF90bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7IC8vOiBhbnk7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGtpYyBra1wiKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgX3RtcC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgX3RtcCk7XHJcbiAgICAgICAgICAgIC8vcGFyZW50LmFwcGVuZENoaWxkKF90bXApO1xyXG4gICAgICAgICAgICAvL3JldHVybiBlbDtcclxuICAgICAgICAgICAgLy8gdW5zYXViZXJlciBjb2RlLCBidWlsZCB1bmQgYXBwZW5kIHRyZW5uZW4gZXZlbnRsP1xyXG4gICAgICAgICAgICB2YXIgbGkgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChyb290KTtcclxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsIGxpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuXHJcblxyXG4gICAgICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPCAwOyBpKyspeyAvL2J1Z1xyXG4gICAgICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgIC8vamwubG9nKFwiVGhpcyBwb3N0IHdhc1xcblwiLFwiZXJyXCIpO1xyXG4gICAgICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwgMTU7IGkrKyl7XHJcbiAgICAgICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgICAgIC8vIGJ1ZyBlcnJvZiBvZiB0eXBlc2NyaXB0ID8/XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgXHJcbiAgICAgICovXHJcblxyXG4iLCIgICAgLypcclxuICAgICAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gICAgICovXHJcblxyXG4gICAgaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbiAgICBpbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuICAgIGltcG9ydCB7SHRtbEJ1aWxkZXJ9IGZyb20gXCIuL0h0bWxCdWlsZGVyXCI7XHJcblxyXG4gICAgY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgYXJ0aWNsZXM6IGFueVtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE1ldGFkYXRhUmVzdWx0IHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBzb3VyY2VzOiBzdHJpbmdbXTtcclxuICAgICAgICB0b3BpY3M6IHN0cmluZ1tdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE15Q29uc29sZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBsb2coczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgcG9zdChzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIgKyBzLCBcIm50ZlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsYXNzIEpzTG9nIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIGxvZyhzOiBzdHJpbmcsIHN0YXR1c19uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgLy8janNvbj8/IEZGOTgzOFxyXG4gICAgICAgICAgICB2YXIgc3RhdHVzID0gW1wiZXJyXCIsIFwibXNnXCIsIFwibnRmXCJdO1xyXG4gICAgICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIl07XHJcbiAgICAgICAgICAgIHZhciBjb2xvcnMgPSBbXCJGRjYxNTlcIiwgXCJGRjlGNTFcIiwgXCIyMkI4RUJcIiwgXCJcIiwgXCJcIl07IFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBvcmFuZ2UgIFxyXG4gICAgICAgICAgICB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgLy9pbiBjb25zdHJ1Y3RvciByZWluXHJcbiAgICAgICAgICAgIHZhciBjb2xfaWQgPSBzdGF0dXMuaW5kZXhPZihzdGF0dXNfbmFtZSk7XHJcbiAgICAgICAgICAgIC8vIGFsbGVydCByYXNpZSBidWcgLCBlcnJvIHJpZiBjb2xfaWQgPCAwXHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheV9uYW1lID0gc3RhdHVzX2Rpc3BsYXlbY29sX2lkXVxyXG4gICAgICAgICAgICBzID0gcy5yZXBsYWNlKFwiXFxuXCIsIFwiPGJyPlwiKTtcclxuICAgICAgICAgICAgcyA9IHN0YXR1c19kaXNwbGF5X25hbWUgKyBcIlxcblxcblwiICsgcztcclxuICAgICAgICAgICAgdmFyIHR4dCA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIC8vamwucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIgKyBjb2xvcnNbY29sX2lkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEV4Y2F0IG9yZGVyIG9mIHRoZXNlIG5leHQgY29tbWFuZHMgaXMgaW1wb3J0YW50IFxyXG4gICAgdmFyIGNzID0gbmV3IE15Q29uc29sZSgpO1xyXG4gICAgdmFyIGpsID0gbmV3IEpzTG9nKCk7XHJcbiAgICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcblxyXG4gICAgdmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zOiBhbnk7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHsgXHJcbiAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2VhcmNoX2RlbW8oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLXNlYXJjaF9kZW1vLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICBvbl9sb2FkKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vQ3JlYXRlcyBsaXN0IG9mIG1ldGFkYXRhIGxpIGVsZW1lbnRzXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHNldF9tZXRhRGF0YShyZXN1bHQ6IE1ldGFkYXRhUmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIHRvcGljX3NldDogYW55ID0gW107XHJcbiAgICAgICAgLy90b3BpY19zZXQgPSBbXCJ0b3BpYyAxXCIsIFwidG9waWMgMlwiLCBcInRvcGljIDNcIl07XHJcblxyXG4gICAgICAgIHRvcGljX3NldCA9IHJlc3VsdC50b3BpY3M7XHJcblxyXG4gICAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcGljX3NldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdG9waWNOYW1lID0gdG9waWNfc2V0W2ldO1xyXG4gICAgICAgICAgICB2YXIgYSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiNzZXRfZmlsdGVyXCI7IC8vIHRvcGljcyB0aGlzLCBhZGQgdG8gYXRcclxuICAgICAgICAgICAgLy9hLmhyZWYgPSBcIiNzaW1pbGFyX2lkX1wiICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyOyAvLzExMjMyNDNcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLW5hbWUnLCB0b3BpY05hbWUpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScsIFwidG9waWNcIik7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b3BpY05hbWUpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICB9ICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gTG9hZHMgbWV0YWRhdGFcclxuXHJcbiAgICBmdW5jdGlvbiBpbmlfc2V0X21ldGFEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnRfMSA9IFwiX19fX25ld19hamF4X19fX1wiO1xyXG4gICAgICAgIEFqYXguZ2V0TWV0YWRhdGEoKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IE1ldGFkYXRhUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJOZXcgdG9waWNzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC50b3BpY3MpOy8vLmFydGljbGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRfbWV0YURhdGEocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiByZXN1bHQ7IC8vYnVnIGFzeW5jaHJvbnVvcyAhIVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25fbG9hZCgpIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgIC8vIGxvYWQgbWF0YURhdGEgKHNvdXJjZXMsIGFuZCB0b3BpY3MpIGJ1ZyB0b2RvIHNvdXJjZXMgXHJcbiAgICAgICAgaW5pX3NldF9tZXRhRGF0YSgpO1xyXG5cclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucyA9IG5ldyBGaWx0ZXJPcHRpb25zKCk7XHJcbiAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnQgPSBcIl9fX2FqYXhfX18gXCI7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3MucHVzaChcIlBvbGl0aWNzXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMuc291cmNlcy5wdXNoKFwiY25uXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9EYXRlID0gXCIyMDE2LTEyLTI1XCI7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgICAgXHJcbiAgICAgICAgdmFyIGtleXdvcmRzID0gKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpKS52YWx1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fa2V5d29yZF9fXCIgKyBcIi1cIiArIGtleXdvcmRzICsgXCItXCIpO1xyXG4gICAgICAgIEFqYXguZ2V0QnlRdWVyeShrZXl3b3JkcywgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IEFydGljbGVSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFydGljbGUgb2YgcmVzdWx0LmFydGljbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIGFydGljbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgc2FtcGxlID0gKDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIikgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxCdWlsZGVyLmJ1aWxkQXJ0aWNsZShhcnRpY2xlLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDA7IGkrKykgeyAvL2J1Z1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBlbGVtZW50X3NldF9kaXNwbGF5KGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBlbGVtZW50X3Nob3coaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcImJsb2NrXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBlbGVtZW50X2hpZGUoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICAvL2NoZWNrIHN0YXR1cz8gcmFpc2UgZXJyb3IgaWYgaGlkZGVuP1xyXG4gICAgICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcIm5vbmVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jcmVhdGUoaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSk7XHJcbiAgICAgICAgICAgIGUuaWQgPSBcInNwYW5faGlkZGVuX1wiICsgaWQ7XHJcbiAgICAgICAgICAgIGUuY2xhc3NOYW1lID0gXCJzcGFuX2hpZGRlblwiO1xyXG4gICAgICAgICAgICBlLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgIGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2RlbGV0ZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY2hlY2soaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgdmFyIGJvb2wgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHNwYW5fbGlzdCA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdlbm4ga2VpbiBIaWRkZW4gU3BhbiBkYSwgZGFubiB3ZXJ0IGltbWVyIGZhbHNjaCEhXHJcbiAgICAgICAgICAgIC8vYnVnIGFzc3VtZXMganVzdCBvbmUgY2xhcyByYWlzZSB3YXJuaWduIGlmIG1vcmUgY2xhc3NlcyAhISAsIGNsZWFyZWQsIGJ5IGNoZWNrIGxlbmdodCA9PSAxXHJcbiAgICAgICAgICAgIGlmIChzcGFuX2xpc3QubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzcGFuID0gc3Bhbl9saXN0WzBdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3Bhbi5pbm5lckhUTUwsIHRleHQpO1xyXG4gICAgICAgICAgICAgICAgYm9vbCA9IChcIlwiICsgdGV4dCA9PSBcIlwiICsgc3Bhbi5pbm5lckhUTUwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNzLmxvZyhcIlwiICsgYm9vbCk7XHJcbiAgICAgICAgICAgIHJldHVybiBib29sO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2tleXdvcmRzX29sZChlbDogYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBmbGRfc2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpO1xyXG4gICAgICAgICAgICB2YXIgZmxkID0gKDxIVE1MSW5wdXRFbGVtZW50PiBmbGRfc2VhcmNoKS52YWx1ZTtcclxuICAgICAgICAgICAgdmFyIGtleXdvcmRzID0gZmxkO1xyXG4gICAgICAgICAgICBjb25uLnBvc3Qoa2V5d29yZHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHMoZWw6IGFueSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tc2VhcmNoX2RlbW8tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgICAgICBvbl9sb2FkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9maWx0ZXIoZWw6IGFueSkgeyAvLyBidWcga2V5IG5vdCB1c2VkXHJcbiAgICAgICAgICAgIHZhciBjaGVjayA9IHNwYW5faGlkZGVuX2NoZWNrKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgaWYgKGNoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50X2hpZGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBzcGFuX2hpZGRlbl9kZWxldGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIGNsb3NpbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudF9zaG93KFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgc3Bhbl9oaWRkZW5fY3JlYXRlKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgb3BlbmluZy5cIiwgXCJudGZcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9zaG93IGhpZGUsIG5vdCB0b2dnbGUgISFcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGRhdGVfc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgICAgdmFyIGRhdGVfc3RhcnRfc3RyID0gKDxIVE1MSW5wdXRFbGVtZW50PiBkYXRlX3N0YXJ0KS52YWx1ZS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgICAgICB2YXIgZGF0ZV9zdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZV9zdGFydF9zdHIpO1xyXG4gICAgICAgIGNzLmxvZyhcIlwiICsgZGF0ZV9zdGFydF9kYXRlKTtcclxuICAgICAgICBjcy5sb2coZGF0ZV9zdGFydF9kYXRlLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGVja191cmxfbmFtZShldmVudDogYW55KSB7XHJcbiAgICAgICAgICAgIC8vdmFyIHVybF9uYW1lID0gd2luZG93LmxvY2F0aW9uOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgICAgICAvL2NzLmxvZyh1cmxfbmFtZSk7XHJcbiAgICAgICAgICAgIHZhciB1cmxfaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cmxfaGFzaCk7IC8vIGRvZXMgbm90IHdvcmsgaW4gaWU/PyAhISFcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgICAgICBpZiAodXJsX2hhc2guaW5kZXhPZihcIiNcIiArIGtleSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGtleSk7XHJcbiAgICAgICAgICAgICAgICBjcy5sb2coa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2lmICNzZWFyY2hfZmlsdGVyIGluIHVybF9oYXNoXHJcbiAgICAgICAgICAgIC8vbXVsdGlmbGFnX2xhc3RfaGFzaCA9IHNlYXJjaF9maWx0ZXIuLi5cclxuICAgICAgICAgICAgLy9zaG93IGZpbGV0ZXIsIHNlYWNoIGtleXdvcmRzLCBzaG93IGNhY2hlIChncmV5LCBibHVlLCBibGFjayBhbmQgd2hpdGUsIHRoZW1lIGFsbCBuZXcgY2FjaGUsIGRvIHBvc3QgcmVxLilcclxuICAgICAgICAgICAgLy8gaWYga2V5d29yZHMsIHBvc3QgYWN0aW9uID0gc2VyYWNoIHN1YmFjdGlvbiA9IGtleXdvcmRzIGRhdGEgPSBrZXl3b3JkcyBhcnJheSwgb3IgY2FjaGVfaWQgcmVxdWVzdCBpbmZvcy4uLiwgXHJcbiAgICAgICAgICAgIC8vIHRoZW4gc2hvdywgcG9zdCB1cGRhdGUgZ3JleSBhcmUgcHJvZ3Jlc3MgYmFyLCBmaWx0ZXIgaW5mb3MgZ2V0IGxvY2FsIHN0b3JhZ2UgZmlsdGVyc19fLi4sIGdldCBmaWx0ZXJzIGZyb20gcGFnZT8gbWFya2VkIChzcGFuIG1hcmtlLCByZWFsIHZhbHVlLCBkaXNwbGF5Li4uXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX3NpbWlsYXIoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLXNpbWlsYXItLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgaWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXJhZGlvLWlzU2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc19jbGlja19vcl9lbnRlcihldjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcclxuICAgICAgICAgICAgZWwgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gYmFkIGdpdmVzIGZ1bGwgaHJlZiB3aXRoIGxpbmtcclxuICAgICAgICAgICAgLy92YXIgaHJlZiA9IGVsLmhyZWY7IFxyXG4gICAgICAgICAgICAvLyBuaWNlLCBnaXZlcyByYXcgaHJlZiwgZnJvbSBlbGVtZW50IG9ubHkgKCBlLmcuICNzZWFyY2hfZmlsdGVyLCBpbnN0ZWFkIG9mIHd3dy5nb29nbGUuY29tLyNzZWFjaF9maWx0ZXIpXHJcbiAgICAgICAgICAgIHZhciBocmVmID0gKDxhbnk+ZWwpLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XHJcbiAgICAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAvL3ZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgICAgLy9rZXkgPSBcIiNcIiArIGtleTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgdmFyIGlzX3NhbWUgPSAoaHJlZiA9PSBrZXkpIDtcclxuICAgICAgICAgICAgaWYgKGlzX3NhbWUpeyAvL3VybF9oYXNoLmluZGV4T2YoXCIjXCIra2V5KSA9PSAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbmZvIGhyZWYgc3dpdGhjLS1cIiArIGhyZWYgKyBcIi0tXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJvb2xcIiwgaHJlZiA9PSBcInNlYWNoX2ZpbHRlclwiLCBocmVmLCBcInNlYWNoX2ZpbHRlclwiKTtcclxuICAgICAgICAgICAgc3dpdGNoIChocmVmKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2tleXdvcmRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfa2V5d29yZHMoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9zaW1pbGFyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfc2ltaWxhcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgLy9kZWZhdWx0IGNvZGUgYmxvY2tcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGNzLmxvZyhcIiMgc2VsZWN0aW9uIHdhcyAtIFwiICsgaHJlZik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaHJlZlwiLCBocmVmKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4gICAgICAgICAgICAvL2NzLmxvZyhlbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZGF0ZV93YXNfY2hhbmdlZCh0eXBlIDogc3RyaW5nKXtcclxuICAgICAgICAgICAgdmFyIGVsID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBlbC52YWx1ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlLGRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBMaXN0ZW4gZm9yIGNoYW5nZXMgb2YgZGF0ZVxyXG4gICAgICAgIHZhciBlbF9kYXRlX3N0YXJ0ID0gPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgICAgIHZhciBlbF9kYXRlX2VuZCA9IDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9lbmRcIik7XHJcbiAgICAgICAgZWxfZGF0ZV9zdGFydC5vbkJsdXIgPSBkYXRlX3dhc19jaGFuZ2VkKFwic3RhcnRcIik7XHJcbiAgICAgICAgZWxfZGF0ZV9lbmQub25CbHVyID0gZGF0ZV93YXNfY2hhbmdlZChcImVuZFwiKTtcclxuICAgICAgICBcclxuICAgICAgICAvL3JlcGVhdCB0aGlzIGVhY2ggMC4yNSBzZWNvbmQgISEgYnVnIHRvZG8gcmVmYWNcclxuICAgICAgICB2YXIgY29sX2EgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJBXCIpKTtcclxuICAgICAgICAvL3ZhciBsaXN0X2EgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggY29sX2EsIDAgKTtcclxuICAgICAgICB2YXIgbGlzdF9hOiBhbnkgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSBsaXN0X2EucHVzaChjb2xfYVtpXSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsaVwiLCBsaXN0X2EpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibGlcIiwgY29sX2EubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIHZhciBhbmNoID0gbGlzdF9hW2ldOyAvLyAoPGFueT4geCk7XHJcbiAgICAgICAgICAgIC8vIHRvZG8gYnVnLCByZWZhYywgY2hlY2sgaWYgY2xhc3MgaXMgbm9ybWFsIGxpbmssIHRoZW4gZG9udCBhZGQgYW55IHNwZWNpYWwgb25jbGljayBoYW5kbGluZ1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiaVwiLCBhbmNoKTtcclxuICAgICAgICAgICAgLy92YXIgYW5jaCA9ICg8YW55PiBsaXN0X2FbaV0gICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBidWcgdG9kbyByZWZhYyBiYWQgaW1wb3J0YW50XHJcbiAgICAgICAgICAgIGFuY2gub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLypmdW5jdGlvbigpey8qIHNvbWUgY29kZSAqIC9cclxuICAgICAgICAgICAgICAgKCBhbmNoICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gTmVlZCB0aGlzIGZvciBJRSwgQ2hyb21lID9cclxuICAgICAgICAgICAgLyogXHJcbiAgICAgICAgICAgIGFuY2gub25rZXlwcmVzcz1mdW5jdGlvbihlKXsgLy9pZSA/P1xyXG4gICAgICAgICAgICAgICBpZihlLndoaWNoID09IDEzKXsvL0VudGVyIGtleSBwcmVzc2VkXHJcbiAgICAgICAgICAgICAgICAgIHByb2Nlc3NfY2xpY2tfb3JfZW50ZXIoIGFuY2ggKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgLy93aW5kb3cub25sb2FkID0gb25fbG9hZCgpO1xyXG4gICAgICAgXHJcbiAgICAgICAvLyN0c2MgLS13YXRjaCAtcCBqc1xyXG4gICAgICAgXHJcbiAgICAgICAvKlxyXG4gICAgICAgICAgY2xlYW4gdXAganMsIHRzXHJcbiAgICAgICAgICAtIG9uIGVudGVyIHNlYXJjaCwgYWR2YW5jZWQgc2VhcmNoXHJcbiAgICAgICAgICAtIG9mZmVyIGRhdGUgcmFuZ2VcclxuICAgICAgICAgIC0gb2ZmZXIgdGhlbWVzL3RvcGljc1xyXG4gICAgICAgICAgLSBvZmZlciBsdXBlIHNob3csIHVzZSBiYWNrcm91bmcgaW1hZ2U/PyBiZXR0ZXIsIGJlY2F1c2UgY3NzIGNoYW5nZWJhclxyXG4gICAgICAgICAgLSBvbmNsaWNrIGEgaHJlZiBvcGVuIGNhY2hlLCBzZWFyY2ggc2ltaWxhciAoaW50ZXJ2YWxsIGdldCBuZXcgdXJsKSwgZXZlbnQgbmV3IHBhZ2U/IG9ucGFnZWxvYWQ/XHJcbiAgICAgICAgICAtIG9uIFxyXG4gICAgICAgICAgLSBzZW5kIHBvc3QgY2xhc3MsIGJpbmQgY2xpY2tzIC4uLlxyXG4gICAgICAgICAgLSBGaWx0ZXIgYnkgdG9waWMsIGJ5IGRhdGVcclxuICAgICAgICAgIC0gYnV0dG9uICwgYmFubmVyICwgcHJvZ3Jlc3MgYmFyIGZvciBzZWFyY2gsIHNob3cgcG9zdCBpbmZvICEhXHJcbiAgICAgICAgICAtIGZhdm9yaXRlIHRvcGljcyBpbiBzZXBhcnRlL2ZpcnN0IGxpbmUgKHdyaXRlIG15IGZhdm9yaXRlcz0gPyBvciBub3QpXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC0gdG9waWNzIHlhIDxhPiBmb3Iga2V5bW92ZVxyXG4gICAgICAgICAgLSB0ZXN0IGV2ZXJ5dGhpbmcga2V5bW92ZVxyXG4gICAgICAgICAgLSBmaWx0ZXIsIGx1cGUga2V5bW92ZSBjb2xvclxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIGJ1ZyBhZGQgc2VyYWNoIGJ1dHRvbiBzZWFyY2ggYnV0dG9uXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC0gZmlsdGVyIGFkZCA8IDwgXmFycm93IGRvd24gZGF6dSBhdWZrbGFwcCBhcnJvdyAhIVxyXG4gICAgICAgICAgLSBqc29uIHRvIGh0bWwgZm9yIHJlc3VsdCAhIVxyXG5cclxuICAgICAgICAgIGFwcGx5IGZpbHRlclxyXG4gICAgICAgXHJcbiAgICAgICAqL1xyXG4gICAgICAgXHJcbiAgICAgICAiLCIiXX0=
