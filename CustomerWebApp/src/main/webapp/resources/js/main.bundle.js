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
        a.href = "#cache"; // + article.articleId_str;
        a.setAttribute('data-articleId', article.articleId_str);
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
        //a.onclick = process_click_or_enter;
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
function mytest() {
    console.log("kkkkkk");
}
var global_filterOptions;
document.addEventListener("DOMContentLoaded", function (event) {
    on_load();
});
function search_demo() {
    console.log("--------------search_demo----------");
    on_load();
}
// Listen for changes of date
// fucntion date
// var el_date_start = <any> document.getElementById("date_start");
// var el_date_end = <any> document.getElementById("date_end");
// el_date_start.onblur = date_was_changed(el_date_start);
// el_date_end.onblur = date_was_changed(el_date_end);
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
        a.onclick = process_click_or_enter;
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
//var date_start = document.getElementById("date_start");
//var date_start_str = (<HTMLInputElement> date_start).value.replace(/-/g, "/");
//var date_start_date = new Date(date_start_str);
//cs.log("" + date_start_date);
//cs.log(date_start_date.toString());
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
function f_date_set_range(el) {
    var days_back_from_now = el.getAttribute('data-date-range-days');
    console.log(days_back_from_now);
}
function process_click_or_enter(ev) {
    console.log(ev);
    el = this;
    // bad gives full href with link //var href = el.href; 
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
        case "date_set_range":
            f_date_set_range(el);
            break;
        default:
    }
    // cs.log("# selection was - " + href);  // console.log("href", href);  // console.log(el);   //cs.log(el.getAttribute("href"));
}
function on_load() {
    // load mataData (sources, and topics) bug todo sources 
    ini_set_metaData();
    setInterval(function () { add_anchor_tags_to_onClick_processing(); }, 500);
    global_filterOptions = new FilterOptions_1.FilterOptions();
    var cs_log_ajax_hint = "___ajax___ ";
    //global_filterOptions.topics.push("Politics");
    //global_filterOptions.sources.push("cnn");
    //global_filterOptions.toDate = "2016-12-25";
    //global_filterOptions.fromDate = "2000-12-25";
    var keywords = document.getElementById("fld_search").value;
    console.log("_k_keyword__" + "-" + keywords + "-");
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
    function add_anchor_tags_to_onClick_processing() {
        //repeat this each 0.25 second !! bug todo refac
        var col_a = document.getElementsByTagName("A");
        //var list_a = Array.prototype.slice.call( col_a, 0 );
        var list_a = [];
        for (var i = 0; i < col_a.length; i++)
            list_a.push(col_a[i]);
        //console.log("li", list_a);
        //console.log("li", col_a.length);
        for (var i = 0; i < col_a.length; i++) {
            var anch = list_a[i]; // (<any> x);
            // todo bug, refac, check if class is normal link, then dont add any special onclick handling
            //console.log("i", anch);
            //var anch = (<any> list_a[i]  );
            // bug todo refac bad important
            anch.onclick = process_click_or_enter;
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBZ0RqQjtBQWhERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLGdEQUFnRDtJQUNuRCxJQUFNLE9BQU8sR0FBVyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsSUFBTSxnQkFBZ0IsR0FBVyxVQUFVLEdBQUcsYUFBYSxDQUFDO0lBQzVELElBQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFFLENBQUM7SUFFekQsb0JBQTJCLEtBQWEsRUFBRSxPQUFzQixFQUFFLElBQVksRUFBRSxLQUFhO1FBQzVGLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUU5QixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUUzQyxJQUFJLEdB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QUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTtZQUNuQyw2RkFBNkY7WUFDN0YseUJBQXlCO1lBQ3pCLGlDQUFpQztZQUVqQywrQkFBK0I7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQztRQWdCMUMsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDO0FBS0UsNEJBQTRCO0FBRTVCLG9CQUFvQjtBQUVwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBd0JFOztBQzNaVCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgICAgLypcclxuICAgICAqQGF1aG9yIGptb3RoZXNcclxuICAgICAqL1xyXG5cclxuXHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuICAgIC8vdmFyIGNvbnRleHRVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9DV0EvXCI7XHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9tZXRhZGF0YTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0TWV0YWRhdGFcIjtcclxuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlRdWVyeShxdWVyeTogU3RyaW5nLCBmaWx0ZXJzOiBGaWx0ZXJPcHRpb25zLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicXVlcnk9XCIgKyBxdWVyeSk7XHJcblxyXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fXCIsZmlsdGVyUGFyYW1zKTtcclxuXHRcdGlmIChmaWx0ZXJQYXJhbXMgIT09IFwiXCIpIHBhcmFtcy5wdXNoKGZpbHRlclBhcmFtcyk7XHJcblxyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUlxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKCk6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlX21ldGFkYXRhIDtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5U2ltaWxhcihhcnRpY2xlSWQ6IFN0cmluZywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdC8vIFRPRE9cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxufSIsIiAgICAvKlxyXG4gICAgICpAYXVob3Igam1vdGhlc1xyXG4gICAgICovXHJcblxyXG5leHBvcnQgY2xhc3MgRmlsdGVyT3B0aW9ucyB7XHJcblxyXG5cdHRvcGljczogc3RyaW5nW10gPSBbXTtcclxuXHRzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBmcm9tRGF0ZTogc3RyaW5nID0gXCIxOTgwLTAxLTAxXCI7XHJcblx0dG9EYXRlOiBzdHJpbmcgPSBcIjIwMjAtMDEtMDFcIjsgLy8gYnVnICwgYmV0dGVyIGRlZmF1bHRzID8gXHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwiZnJvbT1cIiArIHRoaXMuZnJvbURhdGUpO1xyXG5cdFx0aWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcInRvPVwiICsgdGhpcy50b0RhdGUpO1xyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBkYmVja3N0ZWluLCBqZnJhbnpcclxuICAgICAqL1xyXG5cclxuICAgIC8vIHV0aWwgZnVuY3Rpb25zIGh0bWxCdWlsZGVyXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbShlbE5hbWU6IHN0cmluZywgY2xzTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgdG1wID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsTmFtZSkpO1xyXG4gICAgICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVGV4dChwYXJlbnQ6IGFueSwgdHh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgICAgICAvL3JldHVybiB0bXA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBtb2R1bGUgSHRtbEJ1aWxkZXIge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkIGh0bWwgbGkgZWxlbWVudCBmcm9tIGFydGljbGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQXJ0aWNsZShhcnRpY2xlOiBhbnksIHBhcmVudDogYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdmFyIHRtcF9jbGVhcmZpeCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHJvb3QgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwicmVzdWx0XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl90b3BpY1wiKTtcclxuICAgICAgICAgICAgdmFyIHRvcGljX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dCh0b3BpY19idXR0b24sIGFydGljbGUudG9waWMpO1xyXG4gICAgICAgICAgICB0b3BpYy5hcHBlbmRDaGlsZCh0b3BpY19idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0b3BpYyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInRpdGxlXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgYXJ0aWNsZS50aXRsZSk7XHJcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGluayA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJsaW5rXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGxpbmssIGFydGljbGUudXJsLnN1YnN0cmluZygwLCA0NSkpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9kYXRlXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLCBcImRhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV95ID0gcmF3X2RhdGUuc3Vic3RyaW5nKDAsIDQpO1xyXG4gICAgICAgICAgICAvLyBoZXJlIGZpcmVmb3gganMgYnJvd3NlciBidWcgb24gc3Vic3RyKDUsNylcclxuICAgICAgICAgICAgdmFyIGRhdGVfbSA9IHJhd19kYXRlLnN1YnN0cmluZyg1LCA3KS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2QgPSByYXdfZGF0ZS5zdWJzdHJpbmcoOCwgMTApLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRfZGF0ZSA9IGRhdGVfZCArIFwiLlwiICsgZGF0ZV9tICsgXCIuXCIgKyBkYXRlX3lcclxuICAgICAgICAgICAgYWRkVGV4dChkYXRlX2RhdGUsIGZvcm1hdHRlZF9kYXRlKTtcclxuICAgICAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAgICAgLy92YXIgZGF0ZV90aW1lID0gY3JlYXRlRWxlbShcInNwYW5cIixcInRpbWVcIik7XHJcbiAgICAgICAgICAgIC8vZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV90aW1lKTtcclxuICAgICAgICAgICAgZGF0ZS5hcHBlbmRDaGlsZChkYXRlX2J1dHRvbik7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50XCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnQsIGFydGljbGUuZXh0cmFjdGVkVGV4dC5zdWJzdHJpbmcoMCwgMzAwKSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudF9jYWNoZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50X2NhY2hlXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnRfY2FjaGUsIGFydGljbGUuZXh0cmFjdGVkVGV4dCk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnRfY2FjaGUpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciBhdXRob3IgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiYXV0aG9yXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGF1dGhvciwgYXJ0aWNsZS5hdXRob3IpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gaW1nIHNyYz1cIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyX2J1dHRvbnMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX2J1dHRvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gYnVnIHJlZmFjIHRvZG8sIGhlcmUgYXVma2xhcHBlbiBsYW5nZXIgdGV4dCAhXHJcbiAgICAgICAgICAgIHZhciBjYWNoZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiNjYWNoZVwiOyAvLyArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjtcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJywgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyKTtcclxuICAgICAgICAgICAgdmFyIGltZyA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgICAgICBpbWcuc3JjID0gXCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiOy8vXCJcIjtcclxuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGEsIFwiQ2FjaGVcIik7XHJcblxyXG4gICAgICAgICAgICBjYWNoZV9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKGNhY2hlX2J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2ltaWxhcl9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiNzZWFyY2hfc2ltaWxhclwiO1xyXG4gICAgICAgICAgICAvL2EuaHJlZiA9IFwiI3NpbWlsYXJfaWRfXCIgKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7IC8vMTEyMzI0M1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnLCBhcnRpY2xlLmFydGljbGVJZF9zdHIpO1xyXG4gICAgICAgICAgICAvL2Eub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJTaW1pbGFyXCIpO1xyXG4gICAgICAgICAgICBzaW1pbGFyX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKHNpbWlsYXJfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyX2J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIF90bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7IC8vOiBhbnk7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGtpYyBra1wiKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgX3RtcC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgX3RtcCk7XHJcbiAgICAgICAgICAgIC8vcGFyZW50LmFwcGVuZENoaWxkKF90bXApO1xyXG4gICAgICAgICAgICAvL3JldHVybiBlbDtcclxuICAgICAgICAgICAgLy8gdW5zYXViZXJlciBjb2RlLCBidWlsZCB1bmQgYXBwZW5kIHRyZW5uZW4gZXZlbnRsP1xyXG4gICAgICAgICAgICB2YXIgbGkgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChyb290KTtcclxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsIGxpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuXHJcblxyXG4gICAgICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPCAwOyBpKyspeyAvL2J1Z1xyXG4gICAgICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgIC8vamwubG9nKFwiVGhpcyBwb3N0IHdhc1xcblwiLFwiZXJyXCIpO1xyXG4gICAgICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwgMTU7IGkrKyl7XHJcbiAgICAgICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgICAgIC8vIGJ1ZyBlcnJvZiBvZiB0eXBlc2NyaXB0ID8/XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgXHJcbiAgICAgICovXHJcblxyXG4iLCIgICAgLypcclxuICAgICAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gICAgICovXHJcblxyXG4gICAgaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbiAgICBpbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuICAgIGltcG9ydCB7SHRtbEJ1aWxkZXJ9IGZyb20gXCIuL0h0bWxCdWlsZGVyXCI7XHJcblxyXG4gICAgY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgYXJ0aWNsZXM6IGFueVtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE1ldGFkYXRhUmVzdWx0IHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBzb3VyY2VzOiBzdHJpbmdbXTtcclxuICAgICAgICB0b3BpY3M6IHN0cmluZ1tdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE15Q29uc29sZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBsb2coczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgcG9zdChzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIgKyBzLCBcIm50ZlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsYXNzIEpzTG9nIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIGxvZyhzOiBzdHJpbmcsIHN0YXR1c19uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgLy8janNvbj8/IEZGOTgzOFxyXG4gICAgICAgICAgICB2YXIgc3RhdHVzID0gW1wiZXJyXCIsIFwibXNnXCIsIFwibnRmXCJdO1xyXG4gICAgICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIl07XHJcbiAgICAgICAgICAgIHZhciBjb2xvcnMgPSBbXCJGRjYxNTlcIiwgXCJGRjlGNTFcIiwgXCIyMkI4RUJcIiwgXCJcIiwgXCJcIl07IFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBvcmFuZ2UgIFxyXG4gICAgICAgICAgICB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgLy9pbiBjb25zdHJ1Y3RvciByZWluXHJcbiAgICAgICAgICAgIHZhciBjb2xfaWQgPSBzdGF0dXMuaW5kZXhPZihzdGF0dXNfbmFtZSk7XHJcbiAgICAgICAgICAgIC8vIGFsbGVydCByYXNpZSBidWcgLCBlcnJvIHJpZiBjb2xfaWQgPCAwXHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheV9uYW1lID0gc3RhdHVzX2Rpc3BsYXlbY29sX2lkXVxyXG4gICAgICAgICAgICBzID0gcy5yZXBsYWNlKFwiXFxuXCIsIFwiPGJyPlwiKTtcclxuICAgICAgICAgICAgcyA9IHN0YXR1c19kaXNwbGF5X25hbWUgKyBcIlxcblxcblwiICsgcztcclxuICAgICAgICAgICAgdmFyIHR4dCA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIC8vamwucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIgKyBjb2xvcnNbY29sX2lkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEV4Y2F0IG9yZGVyIG9mIHRoZXNlIG5leHQgY29tbWFuZHMgaXMgaW1wb3J0YW50IFxyXG4gICAgdmFyIGNzID0gbmV3IE15Q29uc29sZSgpO1xyXG4gICAgdmFyIGpsID0gbmV3IEpzTG9nKCk7XHJcbiAgICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIG15dGVzdCgpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwia2tra2trXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBnbG9iYWxfZmlsdGVyT3B0aW9uczogYW55O1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IFxyXG4gICAgICAgIG9uX2xvYWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaF9kZW1vKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS1zZWFyY2hfZGVtby0tLS0tLS0tLS1cIik7XHJcbiAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciBjaGFuZ2VzIG9mIGRhdGVcclxuICAgIFxyXG4gICAgICAgIC8vIGZ1Y250aW9uIGRhdGVcclxuICAgICAgICBcclxuICAgICAgICAvLyB2YXIgZWxfZGF0ZV9zdGFydCA9IDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgICAvLyB2YXIgZWxfZGF0ZV9lbmQgPSA8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpO1xyXG4gICAgICAgIC8vIGVsX2RhdGVfc3RhcnQub25ibHVyID0gZGF0ZV93YXNfY2hhbmdlZChlbF9kYXRlX3N0YXJ0KTtcclxuICAgICAgICAvLyBlbF9kYXRlX2VuZC5vbmJsdXIgPSBkYXRlX3dhc19jaGFuZ2VkKGVsX2RhdGVfZW5kKTtcclxuICAgIFxyXG4gICAgLy9DcmVhdGVzIGxpc3Qgb2YgbWV0YWRhdGEgbGkgZWxlbWVudHNcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gc2V0X21ldGFEYXRhKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICB2YXIgdG9waWNfc2V0OiBhbnkgPSBbXTtcclxuICAgICAgICAvL3RvcGljX3NldCA9IFtcInRvcGljIDFcIiwgXCJ0b3BpYyAyXCIsIFwidG9waWMgM1wiXTtcclxuXHJcbiAgICAgICAgdG9waWNfc2V0ID0gcmVzdWx0LnRvcGljcztcclxuXHJcbiAgICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9waWNfc2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3BpY05hbWUgPSB0b3BpY19zZXRbaV07XHJcbiAgICAgICAgICAgIHZhciBhID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NldF9maWx0ZXJcIjsgLy8gdG9waWNzIHRoaXMsIGFkZCB0byBhdFxyXG4gICAgICAgICAgICAvL2EuaHJlZiA9IFwiI3NpbWlsYXJfaWRfXCIgKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7IC8vMTEyMzI0M1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScsIHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJywgXCJ0b3BpY1wiKTtcclxuICAgICAgICAgICAgYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBMb2FkcyBtZXRhZGF0YVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaV9zZXRfbWV0YURhdGEoKTogYW55IHtcclxuICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICAgICAgQWpheC5nZXRNZXRhZGF0YSgpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyB0b3BpY3MgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LnRvcGljcyk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldF9tZXRhRGF0YShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHJlc3VsdDsgLy9idWcgYXN5bmNocm9udW9zICEhXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICBsaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMDsgaSsrKSB7IC8vYnVnXHJcbiAgICAgICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2hvdyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfaGlkZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vY2hlY2sgc3RhdHVzPyByYWlzZSBlcnJvciBpZiBoaWRkZW4/XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpKTtcclxuICAgICAgICAgICAgZS5pZCA9IFwic3Bhbl9oaWRkZW5fXCIgKyBpZDtcclxuICAgICAgICAgICAgZS5jbGFzc05hbWUgPSBcInNwYW5faGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fZGVsZXRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2VubiBrZWluIEhpZGRlbiBTcGFuIGRhLCBkYW5uIHdlcnQgaW1tZXIgZmFsc2NoISFcclxuICAgICAgICAgICAgLy9idWcgYXNzdW1lcyBqdXN0IG9uZSBjbGFzIHJhaXNlIHdhcm5pZ24gaWYgbW9yZSBjbGFzc2VzICEhICwgY2xlYXJlZCwgYnkgY2hlY2sgbGVuZ2h0ID09IDFcclxuICAgICAgICAgICAgaWYgKHNwYW5fbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwYW4gPSBzcGFuX2xpc3RbMF07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFuLmlubmVySFRNTCwgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICBib29sID0gKFwiXCIgKyB0ZXh0ID09IFwiXCIgKyBzcGFuLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBib29sKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJvb2w7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHNfb2xkKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGZsZF9zZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIik7XHJcbiAgICAgICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgICAgIGNvbm4ucG9zdChrZXl3b3Jkcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcyhlbDogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS1zZWFyY2hfZGVtby0tLS0tLS0tLS1cIik7XHJcbiAgICAgICAgICAgIG9uX2xvYWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2ZpbHRlcihlbDogYW55KSB7IC8vIGJ1ZyBrZXkgbm90IHVzZWRcclxuICAgICAgICAgICAgdmFyIGNoZWNrID0gc3Bhbl9oaWRkZW5fY2hlY2soXCJmaWx0ZXJfc2V0dGluZ3NcIiwgXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICAgICBpZiAoY2hlY2spIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRfaGlkZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIHNwYW5faGlkZGVuX2RlbGV0ZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgY2xvc2luZy5cIiwgXCJudGZcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50X3Nob3coXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBzcGFuX2hpZGRlbl9jcmVhdGUoXCJmaWx0ZXJfc2V0dGluZ3NcIiwgXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBvcGVuaW5nLlwiLCBcIm50ZlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL3Nob3cgaGlkZSwgbm90IHRvZ2dsZSAhIVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL3ZhciBkYXRlX3N0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgICAgIC8vdmFyIGRhdGVfc3RhcnRfc3RyID0gKDxIVE1MSW5wdXRFbGVtZW50PiBkYXRlX3N0YXJ0KS52YWx1ZS5yZXBsYWNlKC8tL2csIFwiL1wiKTtcclxuICAgICAgICAvL3ZhciBkYXRlX3N0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlX3N0YXJ0X3N0cik7XHJcbiAgICAgICAgLy9jcy5sb2coXCJcIiArIGRhdGVfc3RhcnRfZGF0ZSk7XHJcbiAgICAgICAgLy9jcy5sb2coZGF0ZV9zdGFydF9kYXRlLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGVja191cmxfbmFtZShldmVudDogYW55KSB7XHJcbiAgICAgICAgICAgIC8vdmFyIHVybF9uYW1lID0gd2luZG93LmxvY2F0aW9uOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgICAgICAvL2NzLmxvZyh1cmxfbmFtZSk7XHJcbiAgICAgICAgICAgIHZhciB1cmxfaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cmxfaGFzaCk7IC8vIGRvZXMgbm90IHdvcmsgaW4gaWU/PyAhISFcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgICAgICBpZiAodXJsX2hhc2guaW5kZXhPZihcIiNcIiArIGtleSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGtleSk7XHJcbiAgICAgICAgICAgICAgICBjcy5sb2coa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2lmICNzZWFyY2hfZmlsdGVyIGluIHVybF9oYXNoXHJcbiAgICAgICAgICAgIC8vbXVsdGlmbGFnX2xhc3RfaGFzaCA9IHNlYXJjaF9maWx0ZXIuLi5cclxuICAgICAgICAgICAgLy9zaG93IGZpbGV0ZXIsIHNlYWNoIGtleXdvcmRzLCBzaG93IGNhY2hlIChncmV5LCBibHVlLCBibGFjayBhbmQgd2hpdGUsIHRoZW1lIGFsbCBuZXcgY2FjaGUsIGRvIHBvc3QgcmVxLilcclxuICAgICAgICAgICAgLy8gaWYga2V5d29yZHMsIHBvc3QgYWN0aW9uID0gc2VyYWNoIHN1YmFjdGlvbiA9IGtleXdvcmRzIGRhdGEgPSBrZXl3b3JkcyBhcnJheSwgb3IgY2FjaGVfaWQgcmVxdWVzdCBpbmZvcy4uLiwgXHJcbiAgICAgICAgICAgIC8vIHRoZW4gc2hvdywgcG9zdCB1cGRhdGUgZ3JleSBhcmUgcHJvZ3Jlc3MgYmFyLCBmaWx0ZXIgaW5mb3MgZ2V0IGxvY2FsIHN0b3JhZ2UgZmlsdGVyc19fLi4sIGdldCBmaWx0ZXJzIGZyb20gcGFnZT8gbWFya2VkIChzcGFuIG1hcmtlLCByZWFsIHZhbHVlLCBkaXNwbGF5Li4uXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX3NpbWlsYXIoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLXNpbWlsYXItLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgaWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXJhZGlvLWlzU2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2RhdGVfc2V0X3JhbmdlKGVsIDogYW55KXtcclxuICAgICAgICAgICB2YXIgZGF5c19iYWNrX2Zyb21fbm93ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUtcmFuZ2UtZGF5cycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXlzX2JhY2tfZnJvbV9ub3cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzX2NsaWNrX29yX2VudGVyKGV2OiBhbnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xyXG4gICAgICAgICAgICBlbCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAvLyBiYWQgZ2l2ZXMgZnVsbCBocmVmIHdpdGggbGluayAvL3ZhciBocmVmID0gZWwuaHJlZjsgXHJcbiAgICAgICAgICAgIC8vIG5pY2UsIGdpdmVzIHJhdyBocmVmLCBmcm9tIGVsZW1lbnQgb25seSAoIGUuZy4gI3NlYXJjaF9maWx0ZXIsIGluc3RlYWQgb2Ygd3d3Lmdvb2dsZS5jb20vI3NlYWNoX2ZpbHRlcilcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAoPGFueT5lbCkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcclxuICAgICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIC8vdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgICAgICAvL2tleSA9IFwiI1wiICsga2V5O1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICB2YXIgaXNfc2FtZSA9IChocmVmID09IGtleSkgO1xyXG4gICAgICAgICAgICBpZiAoaXNfc2FtZSl7IC8vdXJsX2hhc2guaW5kZXhPZihcIiNcIitrZXkpID09IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluZm8gaHJlZiBzd2l0aGMtLVwiICsgaHJlZiArIFwiLS1cIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYm9vbFwiLCBocmVmID09IFwic2VhY2hfZmlsdGVyXCIsIGhyZWYsIFwic2VhY2hfZmlsdGVyXCIpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGhyZWYpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfa2V5d29yZHNcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcyhlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX3NpbWlsYXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9zaW1pbGFyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlX3NldF9yYW5nZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfZGF0ZV9zZXRfcmFuZ2UoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY3MubG9nKFwiIyBzZWxlY3Rpb24gd2FzIC0gXCIgKyBocmVmKTsgIC8vIGNvbnNvbGUubG9nKFwiaHJlZlwiLCBocmVmKTsgIC8vIGNvbnNvbGUubG9nKGVsKTsgICAvL2NzLmxvZyhlbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICBcclxuXHJcbiAgICBmdW5jdGlvbiBvbl9sb2FkKCkge1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgLy8gbG9hZCBtYXRhRGF0YSAoc291cmNlcywgYW5kIHRvcGljcykgYnVnIHRvZG8gc291cmNlcyBcclxuICAgICAgICBpbmlfc2V0X21ldGFEYXRhKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgYWRkX2FuY2hvcl90YWdzX3RvX29uQ2xpY2tfcHJvY2Vzc2luZygpOyB9LCA1MDApO1xyXG5cclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucyA9IG5ldyBGaWx0ZXJPcHRpb25zKCk7XHJcbiAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnQgPSBcIl9fX2FqYXhfX18gXCI7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3MucHVzaChcIlBvbGl0aWNzXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMuc291cmNlcy5wdXNoKFwiY25uXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9EYXRlID0gXCIyMDE2LTEyLTI1XCI7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgICAgXHJcbiAgICAgICAgdmFyIGtleXdvcmRzID0gKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpKS52YWx1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9rX2tleXdvcmRfX1wiICsgXCItXCIgKyBrZXl3b3JkcyArIFwiLVwiKTtcclxuICAgICAgICBBamF4LmdldEJ5UXVlcnkoa2V5d29yZHMsIGdsb2JhbF9maWx0ZXJPcHRpb25zLCAwLCAxMClcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIkFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSA8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBIdG1sQnVpbGRlci5idWlsZEFydGljbGUoYXJ0aWNsZSwgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZF9hbmNob3JfdGFnc190b19vbkNsaWNrX3Byb2Nlc3NpbmcoKXtcclxuICAgICAgICAgICAgLy9yZXBlYXQgdGhpcyBlYWNoIDAuMjUgc2Vjb25kICEhIGJ1ZyB0b2RvIHJlZmFjXHJcbiAgICAgICAgICAgIHZhciBjb2xfYSA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkFcIikpO1xyXG4gICAgICAgICAgICAvL3ZhciBsaXN0X2EgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggY29sX2EsIDAgKTtcclxuICAgICAgICAgICAgdmFyIGxpc3RfYTogYW55ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIGxpc3RfYS5wdXNoKGNvbF9hW2ldKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImxpXCIsIGxpc3RfYSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJsaVwiLCBjb2xfYS5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICB2YXIgYW5jaCA9IGxpc3RfYVtpXTsgLy8gKDxhbnk+IHgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdG9kbyBidWcsIHJlZmFjLCBjaGVjayBpZiBjbGFzcyBpcyBub3JtYWwgbGluaywgdGhlbiBkb250IGFkZCBhbnkgc3BlY2lhbCBvbmNsaWNrIGhhbmRsaW5nXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiaVwiLCBhbmNoKTtcclxuICAgICAgICAgICAgICAgIC8vdmFyIGFuY2ggPSAoPGFueT4gbGlzdF9hW2ldICApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBidWcgdG9kbyByZWZhYyBiYWQgaW1wb3J0YW50XHJcbiAgICAgICAgICAgICAgICBhbmNoLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICAgICAgLy9hbmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcm9jZXNzX2NsaWNrX29yX2VudGVyLCBmYWxzZSk7IFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8qZnVuY3Rpb24oKXsvKiBzb21lIGNvZGUgKiAvXHJcbiAgICAgICAgICAgICAgICAgICAoIGFuY2ggKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIE5lZWQgdGhpcyBmb3IgSUUsIENocm9tZSA/XHJcbiAgICAgICAgICAgICAgICAvKiBcclxuICAgICAgICAgICAgICAgIGFuY2gub25rZXlwcmVzcz1mdW5jdGlvbihlKXsgLy9pZSA/P1xyXG4gICAgICAgICAgICAgICAgICAgaWYoZS53aGljaCA9PSAxMyl7Ly9FbnRlciBrZXkgcHJlc3NlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc19jbGlja19vcl9lbnRlciggYW5jaCApO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgIC8vd2luZG93Lm9ubG9hZCA9IG9uX2xvYWQoKTtcclxuICAgICAgIFxyXG4gICAgICAgLy8jdHNjIC0td2F0Y2ggLXAganNcclxuICAgICAgIFxyXG4gICAgICAgLypcclxuICAgICAgICAgIGNsZWFuIHVwIGpzLCB0c1xyXG4gICAgICAgICAgLSBvbiBlbnRlciBzZWFyY2gsIGFkdmFuY2VkIHNlYXJjaFxyXG4gICAgICAgICAgLSBvZmZlciBkYXRlIHJhbmdlXHJcbiAgICAgICAgICAtIG9mZmVyIHRoZW1lcy90b3BpY3NcclxuICAgICAgICAgIC0gb2ZmZXIgbHVwZSBzaG93LCB1c2UgYmFja3JvdW5nIGltYWdlPz8gYmV0dGVyLCBiZWNhdXNlIGNzcyBjaGFuZ2ViYXJcclxuICAgICAgICAgIC0gb25jbGljayBhIGhyZWYgb3BlbiBjYWNoZSwgc2VhcmNoIHNpbWlsYXIgKGludGVydmFsbCBnZXQgbmV3IHVybCksIGV2ZW50IG5ldyBwYWdlPyBvbnBhZ2Vsb2FkP1xyXG4gICAgICAgICAgLSBvbiBcclxuICAgICAgICAgIC0gc2VuZCBwb3N0IGNsYXNzLCBiaW5kIGNsaWNrcyAuLi5cclxuICAgICAgICAgIC0gRmlsdGVyIGJ5IHRvcGljLCBieSBkYXRlXHJcbiAgICAgICAgICAtIGJ1dHRvbiAsIGJhbm5lciAsIHByb2dyZXNzIGJhciBmb3Igc2VhcmNoLCBzaG93IHBvc3QgaW5mbyAhIVxyXG4gICAgICAgICAgLSBmYXZvcml0ZSB0b3BpY3MgaW4gc2VwYXJ0ZS9maXJzdCBsaW5lICh3cml0ZSBteSBmYXZvcml0ZXM9ID8gb3Igbm90KVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIHRvcGljcyB5YSA8YT4gZm9yIGtleW1vdmVcclxuICAgICAgICAgIC0gdGVzdCBldmVyeXRoaW5nIGtleW1vdmVcclxuICAgICAgICAgIC0gZmlsdGVyLCBsdXBlIGtleW1vdmUgY29sb3JcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLSBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIGZpbHRlciBhZGQgPCA8IF5hcnJvdyBkb3duIGRhenUgYXVma2xhcHAgYXJyb3cgISFcclxuICAgICAgICAgIC0ganNvbiB0byBodG1sIGZvciByZXN1bHQgISFcclxuXHJcbiAgICAgICAgICBhcHBseSBmaWx0ZXJcclxuICAgICAgIFxyXG4gICAgICAgKi9cclxuICAgICAgIFxyXG4gICAgICAgIiwiIl19
