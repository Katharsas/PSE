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
    var urlBase_similar = contextUrl + "getArticles/similar";
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
        var params = [];
        params.push("id=" + articleId);
        params.push("range=" + skip + "-" + limit);
        var url = urlBase_similar + "?" + params.join("&");
        console.log("__getById__", url);
        var settings = {
            url: url,
            headers: headers,
            processData: false,
            contentType: false,
            type: "GET"
        };
        return $.ajax(settings);
    }
    Ajax.getBySimilar = getBySimilar;
})(Ajax = exports.Ajax || (exports.Ajax = {}));
},{}],2:[function(require,module,exports){
/*
 *@auhor jmothes
 */
"use strict";
// util function for clean 
function pad(n, width) {
    //var z = z || '0';
    var z = '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
// __filter__ from=1980-01-01&to=2020-01-01
// __filter__ from=2015-8-7&to=2016-6-3
function clean(date) {
    var parts = date.split("-");
    parts[0] = pad(parts[0], 4);
    parts[1] = pad(parts[1], 2);
    parts[2] = pad(parts[2], 2);
    //return "1980-j01-01";
    return parts.join("-");
}
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
        if (this.fromDate !== null) {
            this.fromDate = clean(this.fromDate);
            params.push("from=" + this.fromDate);
        }
        if (this.toDate !== null) {
            this.toDate = clean(this.toDate);
            params.push("to=" + this.toDate);
        }
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
        var br_tag = createElem("br", "nothing_special");
        content_cache.appendChild(br_tag);
        var br_tag = createElem("br", "nothing_special");
        content_cache.appendChild(br_tag);
        addText(content_cache, article.source);
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
var global_filterOptions;
document.addEventListener("DOMContentLoaded", function (event) {
    on_load();
});
function search_demo() {
    console.log("--------------search_demo----------");
    on_load();
}
// todo date changed is in html
// Listen for changes of date
// fucntion date
// var el_date_start = <any> document.getElementById("date_start");
// var el_date_end = <any> document.getElementById("date_end");
// el_date_start.onblur = date_was_changed(el_date_start);
// el_date_end.onblur = date_was_changed(el_date_end);
//Creates list of metadata li elements
function set_metaData(result) {
    var topic_set = [];
    var source_set = [];
    //topic_set = ["topic 1", "topic 2", "topic 3"];
    console.log("---now---", result.sources);
    topic_set = result.topics;
    source_set = result.sources;
    var topic_list = document.getElementById("select_topic_list");
    // check length 
    //var children = topic_list.getElementsByTagName("li");
    //if children.lenght
    for (var i = 0; i < topic_set.length; i++) {
        var topicName = topic_set[i];
        var a = document.createElement('a');
        a.href = "#toggle_filter"; // topics this, add to at
        //a.href = "#similar_id_" + article.articleId_str; //1123243
        a.setAttribute('data-filter-name', topicName);
        a.setAttribute('data-filter-type', "topic");
        a.setAttribute('data-filter-selected', false);
        a.onclick = process_click_or_enter;
        var el = document.createElement('li');
        var text_node = document.createTextNode(topicName);
        el.appendChild(text_node);
        a.appendChild(el);
        topic_list.appendChild(a);
    }
    var source_list = document.getElementById("select_source_list");
    // check length 
    //var children_source = source_list.getElementsByTagName("li");
    //if children.lenght
    for (var i = 0; i < source_set.length; i++) {
        var sourceName = source_set[i];
        var a = document.createElement('a');
        a.href = "#toggle_filter"; // sources this, add to at
        //a.href = "#similar_id_" + article.articleId_str; //1123243
        a.setAttribute('data-filter-name', sourceName);
        a.setAttribute('data-filter-type', "source");
        a.setAttribute('data-filter-selected', false);
        a.onclick = process_click_or_enter;
        var el = document.createElement('li');
        var text_node = document.createTextNode(sourceName);
        el.appendChild(text_node);
        a.appendChild(el);
        source_list.appendChild(a);
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
            console.log(cs_log_ajax_hint_1, "New sources received:");
            console.log(cs_log_ajax_hint_1, result.sources); //.articles);
            set_metaData(result);
        }
    })
        .fail(function () {
        console.log(cs_log_ajax_hint_1, "Sending request failed!");
    });
}
/*
var list = document.getElementById("result_sample_list");
list.innerHTML = "";
var sample = document.getElementById("result_sample");

for (var i = 0; i < 0; i++) { //bug
    var el = sample.cloneNode(true); // bug overwritten by ts
    list.appendChild(el);
}
*/
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
function util_empty_node(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
function f_search_keywords() {
    console.log("--------------search_demo----------");
    // on_load(); // bug todo , <- done
    var cs_log_ajax_hint = "___ajax___ ";
    var keywords = document.getElementById("fld_search").value;
    console.log("_k_keyword__" + "-" + keywords + "-");
    Ajax_1.Ajax.getByQuery(keywords, global_filterOptions, 0, 10)
        .done(function (result) {
        if (result.errorMessage !== null) {
            console.log(cs_log_ajax_hint, result.errorMessage);
        }
        else {
            console.log(cs_log_ajax_hint, "Articles received:");
            var list = document.getElementById("result_sample_list");
            util_empty_node(list);
            for (var _i = 0, _a = result.articles; _i < _a.length; _i++) {
                var article = _a[_i];
                console.log(cs_log_ajax_hint, article);
                console.log(article.author);
                //var sample = (<Node> document.getElementById("result_sample") );
                console.log(list);
                HtmlBuilder_1.HtmlBuilder.buildArticle(article, list);
            }
        }
    })
        .fail(function () {
        console.log(cs_log_ajax_hint, "Sending request failed!");
    });
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
    var articleId = el.getAttribute('data-articleId');
    console.log(articleId);
    var cs_log_ajax_hint = "___similar___";
    Ajax_1.Ajax.getBySimilar(articleId, 0, 10)
        .done(function (result) {
        if (result.errorMessage !== null) {
            console.log(cs_log_ajax_hint, result.errorMessage);
        }
        else {
            console.log(cs_log_ajax_hint, "Articles received:");
            var list = document.getElementById("result_sample_list");
            util_empty_node(list);
            for (var _i = 0, _a = result.articles; _i < _a.length; _i++) {
                var article = _a[_i];
                console.log(cs_log_ajax_hint, article);
                console.log(article.author);
                //var sample = (<Node> document.getElementById("result_sample") );
                console.log(list);
                HtmlBuilder_1.HtmlBuilder.buildArticle(article, list);
            }
        }
    })
        .fail(function () {
        console.log(cs_log_ajax_hint, "Sending request failed!");
    });
}
function f_date_set_range(el) {
    var days_back_from_now = el.getAttribute('data-date-range-days');
    console.log(days_back_from_now);
    var date_end = new Date();
    //var ds = "" + d.toLocaleDateString("en-US");
    var date_end_str = (date_end.getFullYear()) + "-" + date_end.getMonth() + "-" + date_end.getDate();
    document.getElementById("date_end").value = date_end_str;
    global_filterOptions.toDate = date_end_str;
    var date_start = new Date();
    date_start.setDate(date_start.getDate() - days_back_from_now);
    //var date_start = date_end - 1;
    //days_back_from_now
    var date_start_str = (date_start.getFullYear()) + "-" + date_start.getMonth() + "-" + date_start.getDate();
    document.getElementById("date_start").value = date_start_str;
    global_filterOptions.fromDate = date_start_str;
}
function css_hide(el) {
    el.style.display = "none";
}
function css_show(el) {
    el.style.display = "block";
}
function f_toggle_filter(el) {
    console.log(el);
    console.log("------filter----", el);
    var type = el.getAttribute('data-filter-type');
    var name = el.getAttribute('data-filter-name');
    var isSelected = el.getAttribute('data-filter-selected');
    var isSelected_pre = el.getAttribute('data-filter-selected');
    var filter;
    if (type == "topic") {
        filter = global_filterOptions.topics;
    }
    else {
        filter = global_filterOptions.sources;
    }
    if (isSelected === "true") {
        el.setAttribute('data-filter-selected', "false");
        var index = filter.indexOf(name);
        //bug ??
        if (index !== (-1)) {
            filter.splice(index, 1);
        }
    }
    else {
        el.setAttribute('data-filter-selected', "true");
        filter.push(name);
    }
    console.log(name);
    console.log(type);
    //console.log("__filter__contenet__", global_filterOptions.topics);
    //console.log("__filter__contenet__", global_filterOptions.sources);
    console.log("__filter__is________", isSelected);
    console.log("__filter__is__pre___", isSelected_pre);
    console.log("__filter__is________", filter);
}
function f_cache_toggle(el) {
    console.log("------cache----", el);
    var id = el.getAttribute('data-articleId');
    console.log(id);
    var pe = el.parentElement.parentElement.parentElement;
    var pid = pe.className;
    console.log(pe);
    console.log(pid);
    var e_con = pe.getElementsByClassName("content")[0];
    var e_con_cache = pe.getElementsByClassName("content_cache")[0];
    if (e_con_cache.style.display != "block") {
        css_show(e_con_cache);
        css_hide(e_con);
    }
    else {
        css_hide(e_con_cache);
        css_show(e_con);
    }
    console.log(e_con);
}
function process_click_or_enter(ev) {
    console.log(ev);
    var el = this;
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
            f_search_keywords();
            break;
        case "search_similar":
            f_search_similar(el);
            break;
        case "toggle_filter":
            f_toggle_filter(el);
            break;
        case "date_set_range":
            f_date_set_range(el);
            break;
        case "cache":
            f_cache_toggle(el);
            break;
        default:
    }
    // cs.log("# selection was - " + href);  // console.log("href", href);  // console.log(el);   //cs.log(el.getAttribute("href"));
}
// intervall onClick processing
function add_anchor_tags_to_onClick_processing() {
    //repeat this each 0.25 second !! bug todo refac
    var col_a = document.getElementsByTagName("A");
    //var list_a = Array.prototype.slice.call( col_a, 0 );
    var list_a = [];
    for (var i = 0; i < col_a.length; i++)
        list_a.push(col_a[i]);
    //console.log("li", list_a); //console.log("li", col_a.length);
    for (var i = 0; i < col_a.length; i++) {
        var anch = list_a[i]; // (<any> x);
        anch.onclick = process_click_or_enter;
    }
    var d_start = document.getElementById("date_start");
    d_start.onchange = d_start_change;
    var d_end = document.getElementById("date_end");
    d_end.onchange = d_end_change;
}
// function set_global_filterOptions_fromDate(d:string){
// //global_filterOptions.fromDate = d;
// //bug
// }
function d_start_change() {
    var date_start = document.getElementById("date_start").value;
    global_filterOptions.fromDate = date_start;
    console.log("click date start");
}
function d_end_change() {
    var date_end = document.getElementById("date_end").value;
    global_filterOptions.toDate = date_end;
    console.log("click date end");
}
function on_load() {
    ini_set_metaData();
    // add source 
    global_filterOptions = new FilterOptions_1.FilterOptions();
    //global_filterOptions.topics.push("politics");
    //global_filterOptions.topics.push("business");
    //global_filterOptions.sources.push("cnn");
    //global_filterOptions.toDate = "2016-12-25";
    //global_filterOptions.fromDate = "2000-12-25";
    setInterval(function () { add_anchor_tags_to_onClick_processing(); }, 500);
    f_search_keywords();
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

 // todo search more button !!
 // todo doku, js mini klassendiagramm
   
 // load mataData (sources, and topics) bug todo sources
 
*/
},{"./Ajax":1,"./FilterOptions":2,"./HtmlBuilder":3}],5:[function(require,module,exports){

},{}]},{},[4,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBK0RqQjtBQS9ERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLGdEQUFnRDtJQUNuRCxJQUFNLE9BQU8sR0FBVyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsSUFBTSxnQkFBZ0IsR0FBVyxVQUFVLEdBQUcsYUFBYSxDQUFDO0lBQzVELElBQU0sZUFBZSxHQUFXLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztJQUNuRSxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUks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dEQsS0FBSyxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7QUFFbEMsQ0FBQztBQUVELHdEQUF3RDtBQUNwRCx1Q0FBdUM7QUFDdkMsUUFBUTtBQUNaLElBQUk7QUFFSjtJQUNJLElBQUksVUFBVSxHQUFVLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3RFLG9CQUFvQixDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFDRDtJQUNJLElBQUksUUFBUSxHQUFVLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFHLENBQUMsS0FBSyxDQUFDO0lBQ2xFLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFHRDtJQUVJLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsY0FBYztJQUVkLG9CQUFvQixHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO0lBRTNDLCtDQUErQztJQUMvQywrQ0FBK0M7SUFDL0MsMkNBQTJDO0lBQzNDLDZDQUE2QztJQUM3QywrQ0FBK0M7SUFFL0MsV0FBVyxDQUFDLGNBQVkscUNBQXFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUV6RSxpQkFBaUIsRUFBRSxDQUFDO0FBRXhCLENBQUM7QUFLRSw0QkFBNEI7QUFFNUIsb0JBQW9CO0FBRXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZCRTs7QUM5akJUIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiAgICAvKlxyXG4gICAgICpAYXVob3Igam1vdGhlc1xyXG4gICAgICovXHJcblxyXG5cclxuaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcblxyXG5kZWNsYXJlIHZhciBjb250ZXh0VXJsOiBzdHJpbmc7XHJcblxyXG5leHBvcnQgbW9kdWxlIEFqYXgge1xyXG4gICAgLy92YXIgY29udGV4dFVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL0NXQS9cIjtcclxuXHRjb25zdCB1cmxCYXNlOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRBcnRpY2xlcy9zZWFyY2hcIjtcclxuXHRjb25zdCB1cmxCYXNlX21ldGFkYXRhOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRNZXRhZGF0YVwiO1xyXG5cdGNvbnN0IHVybEJhc2Vfc2ltaWxhcjogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2ltaWxhclwiO1xyXG5cdGNvbnN0IGhlYWRlcnMgPSB7IGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uLCovKjtxPTAuOFwiIH07XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVF1ZXJ5KHF1ZXJ5OiBTdHJpbmcsIGZpbHRlcnM6IEZpbHRlck9wdGlvbnMsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJxdWVyeT1cIiArIHF1ZXJ5KTtcclxuXHJcblx0XHRsZXQgZmlsdGVyUGFyYW1zOiBzdHJpbmcgPSBmaWx0ZXJzLnRvVXJsUGFyYW0oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19cIixmaWx0ZXJQYXJhbXMpO1xyXG5cdFx0aWYgKGZpbHRlclBhcmFtcyAhPT0gXCJcIikgcGFyYW1zLnB1c2goZmlsdGVyUGFyYW1zKTtcclxuXHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2UgKyBcIj9cIiArIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEoKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2VfbWV0YWRhdGEgO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFIgXHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5U2ltaWxhcihhcnRpY2xlSWQ6IFN0cmluZywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHJcbiAgICAgICAgbGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwiaWQ9XCIgKyBhcnRpY2xlSWQpO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlX3NpbWlsYXIgKyBcIj9cIiArIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9fZ2V0QnlJZF9fXCIsdXJsKTtcclxuXHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxufSIsIiAgICAvKiBcclxuICAgICAqQGF1aG9yIGptb3RoZXNcclxuICAgICAqL1xyXG5cclxuICAvLyB1dGlsIGZ1bmN0aW9uIGZvciBjbGVhbiBcclxuICBmdW5jdGlvbiBwYWQobiA6IHN0cmluZywgd2lkdGggOiBudW1iZXIgKSB7XHJcbiAgLy92YXIgeiA9IHogfHwgJzAnO1xyXG4gIHZhciB6ID0gJzAnO1xyXG4gIG4gPSBuICsgJyc7XHJcbiAgcmV0dXJuIG4ubGVuZ3RoID49IHdpZHRoID8gbiA6IG5ldyBBcnJheSh3aWR0aCAtIG4ubGVuZ3RoICsgMSkuam9pbih6KSArIG47XHJcbn1cclxuICAgICBcclxuIC8vIF9fZmlsdGVyX18gZnJvbT0xOTgwLTAxLTAxJnRvPTIwMjAtMDEtMDFcclxuIC8vIF9fZmlsdGVyX18gZnJvbT0yMDE1LTgtNyZ0bz0yMDE2LTYtM1xyXG4gZnVuY3Rpb24gY2xlYW4oZGF0ZSA6IHN0cmluZyl7XHJcbiAgICB2YXIgcGFydHMgPSBkYXRlLnNwbGl0KFwiLVwiKTtcclxuICAgIHBhcnRzWzBdID0gcGFkKCBwYXJ0c1swXSwgNCApO1xyXG4gICAgcGFydHNbMV0gPSBwYWQoIHBhcnRzWzFdLCAyICk7XHJcbiAgICBwYXJ0c1syXSA9IHBhZCggcGFydHNbMl0sIDIgKTtcclxuICAgIC8vcmV0dXJuIFwiMTk4MC1qMDEtMDFcIjtcclxuICAgIHJldHVybiBwYXJ0cy5qb2luKFwiLVwiKTtcclxuIH1cclxuICAgICBcclxuZXhwb3J0IGNsYXNzIEZpbHRlck9wdGlvbnMge1xyXG5cclxuXHR0b3BpY3M6IHN0cmluZ1tdID0gW107XHJcblx0c291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgIFxyXG4gICAgZnJvbURhdGU6IHN0cmluZyA9IFwiMTk4MC0wMS0wMVwiO1xyXG5cdHRvRGF0ZTogc3RyaW5nID0gXCIyMDIwLTAxLTAxXCI7IC8vIGJ1ZyAsIGJldHRlciBkZWZhdWx0cyA/IFxyXG4gICAgXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnQgZmlsdGVyIG9wdGlvbnMgdG8gdXJsIHBhcmFtZXRlciBzdHJpbmcgb2YgZm9ybWF0XHJcblx0ICogXCJwYXJhbTE9dmFsdWUxJnBhcmFtMj12YWx1ZTImcGFyYW00PXZhbHVlM1wiIGZvciB1c2UgYXMgdXJsIHBhcmFtZXRlcnMuXHJcblx0ICovXHJcblx0dG9VcmxQYXJhbSgpOiBzdHJpbmcge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50b3BpY3MubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInRvcGljcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnRvcGljcykpO1xyXG5cdFx0aWYgKHRoaXMuc291cmNlcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwic291cmNlcz1cIiArIHRoaXMuY29uY2F0TXVsdGlQYXJhbSh0aGlzLnNvdXJjZXMpKTtcclxuXHRcdGlmICh0aGlzLmZyb21EYXRlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJvbURhdGUgPSBjbGVhbih0aGlzLmZyb21EYXRlKTtcclxuICAgICAgICAgICAgcGFyYW1zLnB1c2goXCJmcm9tPVwiICsgdGhpcy5mcm9tRGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cdFx0aWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9EYXRlID0gY2xlYW4odGhpcy50b0RhdGUpO1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaChcInRvPVwiICsgdGhpcy50b0RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHRyZXR1cm4gcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBjb25jYXRNdWx0aVBhcmFtKGFycmF5OiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gYXJyYXkuam9pbihcIjtcIik7XHJcblx0fVxyXG59XHJcbiIsIiAgICAvKlxyXG4gICAgICpAYXVob3IgZGJlY2tzdGVpbiwgamZyYW56XHJcbiAgICAgKi9cclxuXHJcbiAgICAvLyB1dGlsIGZ1bmN0aW9ucyBodG1sQnVpbGRlclxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW0oZWxOYW1lOiBzdHJpbmcsIGNsc05hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIHRtcCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbE5hbWUpKTtcclxuICAgICAgICB0bXAuY2xhc3NMaXN0LmFkZChjbHNOYW1lKTtcclxuICAgICAgICByZXR1cm4gdG1wO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZFRleHQocGFyZW50OiBhbnksIHR4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHh0KSk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRtcCk7XHJcbiAgICAgICAgLy9yZXR1cm4gdG1wO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgbW9kdWxlIEh0bWxCdWlsZGVyIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZCBodG1sIGxpIGVsZW1lbnQgZnJvbSBhcnRpY2xlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBidWlsZEFydGljbGUoYXJ0aWNsZTogYW55LCBwYXJlbnQ6IGFueSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvL3ZhciB0bXBfY2xlYXJmaXggPSBjcmVhdGVFbGVtKFwiZGl2XCIsXCJjbGVhcmZpeFwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciByb290ID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInJlc3VsdFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0b3BpYyA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfdG9waWNcIik7XHJcbiAgICAgICAgICAgIHZhciB0b3BpY19idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQodG9waWNfYnV0dG9uLCBhcnRpY2xlLnRvcGljKTtcclxuICAgICAgICAgICAgdG9waWMuYXBwZW5kQ2hpbGQodG9waWNfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodG9waWMpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJ0aXRsZVwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IGFydGljbGUudXJsO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGEsIGFydGljbGUudGl0bGUpO1xyXG4gICAgICAgICAgICB0aXRsZS5hcHBlbmRDaGlsZChhKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxpbmsgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibGlua1wiKTtcclxuICAgICAgICAgICAgYWRkVGV4dChsaW5rLCBhcnRpY2xlLnVybC5zdWJzdHJpbmcoMCwgNDUpKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQobGluayk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfZGF0ZVwiKTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9kYXRlID0gY3JlYXRlRWxlbShcInNwYW5cIiwgXCJkYXRlXCIpO1xyXG4gICAgICAgICAgICB2YXIgcmF3X2RhdGUgPSBhcnRpY2xlLnB1YkRhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vYnVnIHN1YnN0ciBvdGhlciBiZWhhdmlvdXIgdGhhbiBzdWJzdHJpbmdcclxuICAgICAgICAgICAgdmFyIGRhdGVfeSA9IHJhd19kYXRlLnN1YnN0cmluZygwLCA0KTtcclxuICAgICAgICAgICAgLy8gaGVyZSBmaXJlZm94IGpzIGJyb3dzZXIgYnVnIG9uIHN1YnN0cig1LDcpXHJcbiAgICAgICAgICAgIHZhciBkYXRlX20gPSByYXdfZGF0ZS5zdWJzdHJpbmcoNSwgNykucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9kID0gcmF3X2RhdGUuc3Vic3RyaW5nKDgsIDEwKS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkX2RhdGUgPSBkYXRlX2QgKyBcIi5cIiArIGRhdGVfbSArIFwiLlwiICsgZGF0ZV95XHJcbiAgICAgICAgICAgIGFkZFRleHQoZGF0ZV9kYXRlLCBmb3JtYXR0ZWRfZGF0ZSk7XHJcbiAgICAgICAgICAgIGRhdGVfYnV0dG9uLmFwcGVuZENoaWxkKGRhdGVfZGF0ZSk7XHJcbiAgICAgICAgICAgIC8vdmFyIGRhdGVfdGltZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsXCJ0aW1lXCIpO1xyXG4gICAgICAgICAgICAvL2RhdGVfYnV0dG9uLmFwcGVuZENoaWxkKGRhdGVfdGltZSk7XHJcbiAgICAgICAgICAgIGRhdGUuYXBwZW5kQ2hpbGQoZGF0ZV9idXR0b24pO1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGRhdGUpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGVudFwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dChjb250ZW50LCBhcnRpY2xlLmV4dHJhY3RlZFRleHQuc3Vic3RyaW5nKDAsIDMwMCkpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnRfY2FjaGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGVudF9jYWNoZVwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dChjb250ZW50X2NhY2hlLCBhcnRpY2xlLmV4dHJhY3RlZFRleHQpO1xyXG4gICAgICAgICAgICB2YXIgYnJfdGFnID0gY3JlYXRlRWxlbShcImJyXCIsXCJub3RoaW5nX3NwZWNpYWxcIik7XHJcbiAgICAgICAgICAgIGNvbnRlbnRfY2FjaGUuYXBwZW5kQ2hpbGQoYnJfdGFnKTtcclxuICAgICAgICAgICAgdmFyIGJyX3RhZyA9IGNyZWF0ZUVsZW0oXCJiclwiLFwibm90aGluZ19zcGVjaWFsXCIpO1xyXG4gICAgICAgICAgICBjb250ZW50X2NhY2hlLmFwcGVuZENoaWxkKGJyX3RhZyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnRfY2FjaGUsIGFydGljbGUuc291cmNlKTtcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250ZW50X2NhY2hlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhdXRob3IgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiYXV0aG9yXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGF1dGhvciwgYXJ0aWNsZS5hdXRob3IpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gaW1nIHNyYz1cIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyX2J1dHRvbnMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX2J1dHRvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gYnVnIHJlZmFjIHRvZG8sIGhlcmUgYXVma2xhcHBlbiBsYW5nZXIgdGV4dCAhXHJcbiAgICAgICAgICAgIHZhciBjYWNoZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiNjYWNoZVwiOyAvLyArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjtcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJywgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyKTtcclxuICAgICAgICAgICAgdmFyIGltZyA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgICAgICBpbWcuc3JjID0gXCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiOy8vXCJcIjtcclxuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChpbWcpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGEsIFwiQ2FjaGVcIik7XHJcblxyXG4gICAgICAgICAgICBjYWNoZV9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKGNhY2hlX2J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2ltaWxhcl9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiNzZWFyY2hfc2ltaWxhclwiO1xyXG4gICAgICAgICAgICAvL2EuaHJlZiA9IFwiI3NpbWlsYXJfaWRfXCIgKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7IC8vMTEyMzI0M1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnLCBhcnRpY2xlLmFydGljbGVJZF9zdHIpO1xyXG4gICAgICAgICAgICAvL2Eub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJTaW1pbGFyXCIpO1xyXG4gICAgICAgICAgICBzaW1pbGFyX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKHNpbWlsYXJfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyX2J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIF90bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7IC8vOiBhbnk7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGtpYyBra1wiKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgX3RtcC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgX3RtcCk7XHJcbiAgICAgICAgICAgIC8vcGFyZW50LmFwcGVuZENoaWxkKF90bXApO1xyXG4gICAgICAgICAgICAvL3JldHVybiBlbDtcclxuICAgICAgICAgICAgLy8gdW5zYXViZXJlciBjb2RlLCBidWlsZCB1bmQgYXBwZW5kIHRyZW5uZW4gZXZlbnRsP1xyXG4gICAgICAgICAgICB2YXIgbGkgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChyb290KTtcclxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsIGxpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuXHJcblxyXG4gICAgICAgICAgdmFyIGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPCAwOyBpKyspeyAvL2J1Z1xyXG4gICAgICAgICAgICAgdmFyIGVsID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTsgLy8gYnVnIG92ZXJ3cml0dGVuIGJ5IHRzXHJcbiAgICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgIC8vamwubG9nKFwiVGhpcyBwb3N0IHdhc1xcblwiLFwiZXJyXCIpO1xyXG4gICAgICAgICAgICAgLy9qbC5sb2coaSxcIm1zZ1wiKTtcclxuICAgICAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gYnVnIGdldCBzb3VyY2VzIHRvZG8gISFcclxuICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwgMTU7IGkrKyl7XHJcbiAgICAgICAgICAgICB2YXIgZWwgPSAgKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpICApO1xyXG4gICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9waWMgXCIraSkgO1xyXG4gICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoIHRleHRfbm9kZSApO1xyXG4gICAgICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgICAgIC8vIGJ1ZyBlcnJvZiBvZiB0eXBlc2NyaXB0ID8/XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgXHJcbiAgICAgICovXHJcblxyXG4iLCIgICAgLypcclxuICAgICAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gICAgICovXHJcblxyXG4gICAgaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbiAgICBpbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuICAgIGltcG9ydCB7SHRtbEJ1aWxkZXJ9IGZyb20gXCIuL0h0bWxCdWlsZGVyXCI7XHJcblxyXG4gICAgY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgYXJ0aWNsZXM6IGFueVtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE1ldGFkYXRhUmVzdWx0IHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBzb3VyY2VzOiBzdHJpbmdbXTtcclxuICAgICAgICB0b3BpY3M6IHN0cmluZ1tdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE15Q29uc29sZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBsb2coczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgcG9zdChzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIgKyBzLCBcIm50ZlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsYXNzIEpzTG9nIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIGxvZyhzOiBzdHJpbmcsIHN0YXR1c19uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgLy8janNvbj8/IEZGOTgzOFxyXG4gICAgICAgICAgICB2YXIgc3RhdHVzID0gW1wiZXJyXCIsIFwibXNnXCIsIFwibnRmXCJdO1xyXG4gICAgICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIl07XHJcbiAgICAgICAgICAgIHZhciBjb2xvcnMgPSBbXCJGRjYxNTlcIiwgXCJGRjlGNTFcIiwgXCIyMkI4RUJcIiwgXCJcIiwgXCJcIl07IFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBvcmFuZ2UgIFxyXG4gICAgICAgICAgICB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgLy9pbiBjb25zdHJ1Y3RvciByZWluXHJcbiAgICAgICAgICAgIHZhciBjb2xfaWQgPSBzdGF0dXMuaW5kZXhPZihzdGF0dXNfbmFtZSk7XHJcbiAgICAgICAgICAgIC8vIGFsbGVydCByYXNpZSBidWcgLCBlcnJvIHJpZiBjb2xfaWQgPCAwXHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheV9uYW1lID0gc3RhdHVzX2Rpc3BsYXlbY29sX2lkXVxyXG4gICAgICAgICAgICBzID0gcy5yZXBsYWNlKFwiXFxuXCIsIFwiPGJyPlwiKTtcclxuICAgICAgICAgICAgcyA9IHN0YXR1c19kaXNwbGF5X25hbWUgKyBcIlxcblxcblwiICsgcztcclxuICAgICAgICAgICAgdmFyIHR4dCA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIC8vamwucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIrY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIgKyBjb2xvcnNbY29sX2lkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEV4Y2F0IG9yZGVyIG9mIHRoZXNlIG5leHQgY29tbWFuZHMgaXMgaW1wb3J0YW50IFxyXG4gICAgdmFyIGNzID0gbmV3IE15Q29uc29sZSgpO1xyXG4gICAgdmFyIGpsID0gbmV3IEpzTG9nKCk7XHJcbiAgICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcblxyXG4gICAgdmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zOiBhbnk7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHsgXHJcbiAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2VhcmNoX2RlbW8oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLXNlYXJjaF9kZW1vLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICBvbl9sb2FkKCk7XHJcbiAgICB9XHJcbiAgICAgICAgLy8gdG9kbyBkYXRlIGNoYW5nZWQgaXMgaW4gaHRtbFxyXG4gICAgICAgIC8vIExpc3RlbiBmb3IgY2hhbmdlcyBvZiBkYXRlXHJcbiAgICBcclxuICAgICAgICAvLyBmdWNudGlvbiBkYXRlXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gdmFyIGVsX2RhdGVfc3RhcnQgPSA8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgICAgLy8gdmFyIGVsX2RhdGVfZW5kID0gPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKTtcclxuICAgICAgICAvLyBlbF9kYXRlX3N0YXJ0Lm9uYmx1ciA9IGRhdGVfd2FzX2NoYW5nZWQoZWxfZGF0ZV9zdGFydCk7XHJcbiAgICAgICAgLy8gZWxfZGF0ZV9lbmQub25ibHVyID0gZGF0ZV93YXNfY2hhbmdlZChlbF9kYXRlX2VuZCk7XHJcbiAgICBcclxuICAgIC8vQ3JlYXRlcyBsaXN0IG9mIG1ldGFkYXRhIGxpIGVsZW1lbnRzXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHNldF9tZXRhRGF0YShyZXN1bHQ6IE1ldGFkYXRhUmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIHRvcGljX3NldDogYW55ID0gW107XHJcbiAgICAgICAgdmFyIHNvdXJjZV9zZXQ6IGFueSA9IFtdO1xyXG4gICAgICAgIC8vdG9waWNfc2V0ID0gW1widG9waWMgMVwiLCBcInRvcGljIDJcIiwgXCJ0b3BpYyAzXCJdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nIChcIi0tLW5vdy0tLVwiLHJlc3VsdC5zb3VyY2VzKTtcclxuICAgICAgICB0b3BpY19zZXQgPSByZXN1bHQudG9waWNzO1xyXG4gICAgICAgIHNvdXJjZV9zZXQgPSByZXN1bHQuc291cmNlcztcclxuXHJcbiAgICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICAgIC8vIGNoZWNrIGxlbmd0aCBcclxuICAgICAgICAvL3ZhciBjaGlsZHJlbiA9IHRvcGljX2xpc3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaVwiKTtcclxuICAgICAgICAvL2lmIGNoaWxkcmVuLmxlbmdodFxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9waWNfc2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3BpY05hbWUgPSB0b3BpY19zZXRbaV07XHJcbiAgICAgICAgICAgIHZhciBhID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3RvZ2dsZV9maWx0ZXJcIjsgLy8gdG9waWNzIHRoaXMsIGFkZCB0byBhdFxyXG4gICAgICAgICAgICAvL2EuaHJlZiA9IFwiI3NpbWlsYXJfaWRfXCIgKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7IC8vMTEyMzI0M1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScsIHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJywgXCJ0b3BpY1wiKTtcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBhLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoPEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9waWNOYW1lKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgfSAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNvdXJjZV9saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3Rfc291cmNlX2xpc3RcIik7XHJcbiAgICAgICAgLy8gY2hlY2sgbGVuZ3RoIFxyXG4gICAgICAgIC8vdmFyIGNoaWxkcmVuX3NvdXJjZSA9IHNvdXJjZV9saXN0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlcIik7XHJcbiAgICAgICAgLy9pZiBjaGlsZHJlbi5sZW5naHRcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZV9zZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZU5hbWUgPSBzb3VyY2Vfc2V0W2ldO1xyXG4gICAgICAgICAgICB2YXIgYSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiN0b2dnbGVfZmlsdGVyXCI7IC8vIHNvdXJjZXMgdGhpcywgYWRkIHRvIGF0XHJcbiAgICAgICAgICAgIC8vYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjsgLy8xMTIzMjQzXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1uYW1lJywgc291cmNlTmFtZSk7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJywgXCJzb3VyY2VcIik7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNvdXJjZU5hbWUpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgc291cmNlX2xpc3QuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgfSAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIExvYWRzIG1ldGFkYXRhXHJcblxyXG4gICAgZnVuY3Rpb24gaW5pX3NldF9tZXRhRGF0YSgpOiBhbnkge1xyXG4gICAgICAgIHZhciBjc19sb2dfYWpheF9oaW50XzEgPSBcIl9fX19uZXdfYWpheF9fX19cIjtcclxuICAgICAgICBBamF4LmdldE1ldGFkYXRhKClcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBNZXRhZGF0YVJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIFwiTmV3IHRvcGljcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQudG9waWNzKTsvLy5hcnRpY2xlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyBzb3VyY2VzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC5zb3VyY2VzKTsvLy5hcnRpY2xlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0X21ldGFEYXRhKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gcmVzdWx0OyAvL2J1ZyBhc3luY2hyb251b3MgISFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgICAgICAvKlxyXG4gICAgICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMDsgaSsrKSB7IC8vYnVnXHJcbiAgICAgICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuICAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZWxlbWVudF9zZXRfZGlzcGxheShpZDogc3RyaW5nLCB2YWw6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcclxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZWxlbWVudF9zaG93KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJibG9ja1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZWxlbWVudF9oaWRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgLy9jaGVjayBzdGF0dXM/IHJhaXNlIGVycm9yIGlmIGhpZGRlbj9cclxuICAgICAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJub25lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY3JlYXRlKGlkOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSAoPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIikpO1xyXG4gICAgICAgICAgICBlLmlkID0gXCJzcGFuX2hpZGRlbl9cIiArIGlkO1xyXG4gICAgICAgICAgICBlLmNsYXNzTmFtZSA9IFwic3Bhbl9oaWRkZW5cIjtcclxuICAgICAgICAgICAgZS5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgICAgICAgICBlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9kZWxldGUoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NoZWNrKGlkOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIHZhciBib29sID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBzcGFuX2xpc3QgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICAgICAvLyBXZW5uIGtlaW4gSGlkZGVuIFNwYW4gZGEsIGRhbm4gd2VydCBpbW1lciBmYWxzY2ghIVxyXG4gICAgICAgICAgICAvL2J1ZyBhc3N1bWVzIGp1c3Qgb25lIGNsYXMgcmFpc2Ugd2FybmlnbiBpZiBtb3JlIGNsYXNzZXMgISEgLCBjbGVhcmVkLCBieSBjaGVjayBsZW5naHQgPT0gMVxyXG4gICAgICAgICAgICBpZiAoc3Bhbl9saXN0Lmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3BhbiA9IHNwYW5fbGlzdFswXTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwYW4uaW5uZXJIVE1MLCB0ZXh0KTtcclxuICAgICAgICAgICAgICAgIGJvb2wgPSAoXCJcIiArIHRleHQgPT0gXCJcIiArIHNwYW4uaW5uZXJIVE1MKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjcy5sb2coXCJcIiArIGJvb2wpO1xyXG4gICAgICAgICAgICByZXR1cm4gYm9vbDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3Jkc19vbGQoZWw6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgZmxkX3NlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxkX3NlYXJjaFwiKTtcclxuICAgICAgICAgICAgdmFyIGZsZCA9ICg8SFRNTElucHV0RWxlbWVudD4gZmxkX3NlYXJjaCkudmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBrZXl3b3JkcyA9IGZsZDtcclxuICAgICAgICAgICAgY29ubi5wb3N0KGtleXdvcmRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gdXRpbF9lbXB0eV9ub2RlKG15Tm9kZSA6IE5vZGUpe1xyXG4gICAgICAgICAgICB3aGlsZSAobXlOb2RlLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIG15Tm9kZS5yZW1vdmVDaGlsZChteU5vZGUuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2tleXdvcmRzKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tc2VhcmNoX2RlbW8tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgICAgICAvLyBvbl9sb2FkKCk7IC8vIGJ1ZyB0b2RvICwgPC0gZG9uZVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnQgPSBcIl9fX2FqYXhfX18gXCI7XHJcbiAgICAgICAgICAgIHZhciBrZXl3b3JkcyA9ICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxkX3NlYXJjaFwiKSkudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX2tfa2V5d29yZF9fXCIgKyBcIi1cIiArIGtleXdvcmRzICsgXCItXCIpO1xyXG5cclxuICAgICAgICAgICAgQWpheC5nZXRCeVF1ZXJ5KGtleXdvcmRzLCBnbG9iYWxfZmlsdGVyT3B0aW9ucywgMCwgMTApXHJcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IEFydGljbGVSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIkFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSA8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxfZW1wdHlfbm9kZShsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIGFydGljbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgc2FtcGxlID0gKDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIikgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9maWx0ZXIoZWw6IGFueSkgeyAvLyBidWcga2V5IG5vdCB1c2VkXHJcbiAgICAgICAgICAgIHZhciBjaGVjayA9IHNwYW5faGlkZGVuX2NoZWNrKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgaWYgKGNoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50X2hpZGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBzcGFuX2hpZGRlbl9kZWxldGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIGNsb3NpbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudF9zaG93KFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgc3Bhbl9oaWRkZW5fY3JlYXRlKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgb3BlbmluZy5cIiwgXCJudGZcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9zaG93IGhpZGUsIG5vdCB0b2dnbGUgISFcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy92YXIgZGF0ZV9zdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgICAvL3ZhciBkYXRlX3N0YXJ0X3N0ciA9ICg8SFRNTElucHV0RWxlbWVudD4gZGF0ZV9zdGFydCkudmFsdWUucmVwbGFjZSgvLS9nLCBcIi9cIik7XHJcbiAgICAgICAgLy92YXIgZGF0ZV9zdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZV9zdGFydF9zdHIpO1xyXG4gICAgICAgIC8vY3MubG9nKFwiXCIgKyBkYXRlX3N0YXJ0X2RhdGUpO1xyXG4gICAgICAgIC8vY3MubG9nKGRhdGVfc3RhcnRfZGF0ZS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tfdXJsX25hbWUoZXZlbnQ6IGFueSkge1xyXG4gICAgICAgICAgICAvL3ZhciB1cmxfbmFtZSA9IHdpbmRvdy5sb2NhdGlvbjsvLy5wYXRobmFtZTtcclxuICAgICAgICAgICAgLy9jcy5sb2codXJsX25hbWUpO1xyXG4gICAgICAgICAgICB2YXIgdXJsX2hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDsvLy5wYXRobmFtZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codXJsX2hhc2gpOyAvLyBkb2VzIG5vdCB3b3JrIGluIGllPz8gISEhXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgICAgaWYgKHVybF9oYXNoLmluZGV4T2YoXCIjXCIgKyBrZXkpID09IDApIHtcclxuICAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihrZXkpO1xyXG4gICAgICAgICAgICAgICAgY3MubG9nKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9pZiAjc2VhcmNoX2ZpbHRlciBpbiB1cmxfaGFzaFxyXG4gICAgICAgICAgICAvL211bHRpZmxhZ19sYXN0X2hhc2ggPSBzZWFyY2hfZmlsdGVyLi4uXHJcbiAgICAgICAgICAgIC8vc2hvdyBmaWxldGVyLCBzZWFjaCBrZXl3b3Jkcywgc2hvdyBjYWNoZSAoZ3JleSwgYmx1ZSwgYmxhY2sgYW5kIHdoaXRlLCB0aGVtZSBhbGwgbmV3IGNhY2hlLCBkbyBwb3N0IHJlcS4pXHJcbiAgICAgICAgICAgIC8vIGlmIGtleXdvcmRzLCBwb3N0IGFjdGlvbiA9IHNlcmFjaCBzdWJhY3Rpb24gPSBrZXl3b3JkcyBkYXRhID0ga2V5d29yZHMgYXJyYXksIG9yIGNhY2hlX2lkIHJlcXVlc3QgaW5mb3MuLi4sIFxyXG4gICAgICAgICAgICAvLyB0aGVuIHNob3csIHBvc3QgdXBkYXRlIGdyZXkgYXJlIHByb2dyZXNzIGJhciwgZmlsdGVyIGluZm9zIGdldCBsb2NhbCBzdG9yYWdlIGZpbHRlcnNfXy4uLCBnZXQgZmlsdGVycyBmcm9tIHBhZ2U/IG1hcmtlZCAoc3BhbiBtYXJrZSwgcmVhbCB2YWx1ZSwgZGlzcGxheS4uLlxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9zaW1pbGFyKGVsIDogYW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1zaW1pbGFyLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIGFydGljbGVJZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGVJZCk7XHJcbiAgXHJcbiAgICAgICAgICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19zaW1pbGFyX19fXCI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBBamF4LmdldEJ5U2ltaWxhcihhcnRpY2xlSWQsIDAsIDEwKVxyXG4gICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsX2VtcHR5X25vZGUobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFydGljbGUgb2YgcmVzdWx0LmFydGljbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuYXV0aG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxCdWlsZGVyLmJ1aWxkQXJ0aWNsZShhcnRpY2xlLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfZGF0ZV9zZXRfcmFuZ2UoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgIHZhciBkYXlzX2JhY2tfZnJvbV9ub3cgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZS1yYW5nZS1kYXlzJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRheXNfYmFja19mcm9tX25vdyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2VuZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIC8vdmFyIGRzID0gXCJcIiArIGQudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZW4tVVNcIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2VuZF9zdHIgPSAoZGF0ZV9lbmQuZ2V0RnVsbFllYXIoKSApICsgXCItXCIgKyBkYXRlX2VuZC5nZXRNb250aCgpICsgXCItXCIgKyBkYXRlX2VuZC5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpICkudmFsdWUgPSBkYXRlX2VuZF9zdHI7XHJcbiAgICAgICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IGRhdGVfZW5kX3N0cjtcclxuICAgICAgICAgICAgdmFyIGRhdGVfc3RhcnQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBkYXRlX3N0YXJ0LnNldERhdGUoZGF0ZV9zdGFydC5nZXREYXRlKCkgLSBkYXlzX2JhY2tfZnJvbV9ub3cpO1xyXG4gICAgICAgICAgICAvL3ZhciBkYXRlX3N0YXJ0ID0gZGF0ZV9lbmQgLSAxO1xyXG4gICAgICAgICAgICAvL2RheXNfYmFja19mcm9tX25vd1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9zdGFydF9zdHIgPSAoZGF0ZV9zdGFydC5nZXRGdWxsWWVhcigpICkgKyBcIi1cIiArIGRhdGVfc3RhcnQuZ2V0TW9udGgoKSArIFwiLVwiICsgZGF0ZV9zdGFydC5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIikgKS52YWx1ZSA9IGRhdGVfc3RhcnRfc3RyO1xyXG4gICAgICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IGRhdGVfc3RhcnRfc3RyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBjc3NfaGlkZShlbDphbnkpe1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNzc19zaG93KGVsOmFueSl7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX3RvZ2dsZV9maWx0ZXIoZWw6YW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1maWx0ZXItLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgdHlwZSAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXR5cGUnKTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1uYW1lJyk7XHJcbiAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWRfcHJlID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyIDogYW55O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ0b3BpY1wiKXtcclxuICAgICAgICAgICAgICAgIGZpbHRlciA9IGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvcGljcztcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIgPSBnbG9iYWxfZmlsdGVyT3B0aW9ucy5zb3VyY2VzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkPT09XCJ0cnVlXCIpe1xyXG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaWx0ZXIuaW5kZXhPZihuYW1lKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9idWcgPz9cclxuICAgICAgICAgICAgICAgIGlmICggaW5kZXghPT0oLTEpICl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyLnNwbGljZShpbmRleCwgMSk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJywgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cobmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHR5cGUpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiX19maWx0ZXJfX2NvbnRlbmV0X19cIiwgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fZmlsdGVyX19jb250ZW5ldF9fXCIsIGdsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19pc19fX19fX19fXCIsIGlzU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19pc19fcHJlX19fXCIsIGlzU2VsZWN0ZWRfcHJlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9faXNfX19fX19fX1wiLCBmaWx0ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2NhY2hlX3RvZ2dsZShlbCA6IGFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tY2FjaGUtLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgaWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgICAgIHZhciBwZSA6IGFueSA9IGVsLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICB2YXIgcGlkIDogYW55ID0gcGUuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpZCk7XHJcbiAgICAgICAgICAgIHZhciBlX2NvbiA6IGFueSA9IHBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250ZW50XCIpWzBdO1xyXG4gICAgICAgICAgICB2YXIgZV9jb25fY2FjaGUgOiBhbnkgPSBwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGVudF9jYWNoZVwiKVswXTtcclxuICAgICAgICAgICAgaWYgKGVfY29uX2NhY2hlLnN0eWxlLmRpc3BsYXkgIT0gXCJibG9ja1wiKXtcclxuICAgICAgICAgICAgICAgIGNzc19zaG93KGVfY29uX2NhY2hlKTtcclxuICAgICAgICAgICAgICAgIGNzc19oaWRlKGVfY29uKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjc3NfaGlkZShlX2Nvbl9jYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBjc3Nfc2hvdyhlX2Nvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coZV9jb24pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc19jbGlja19vcl9lbnRlcihldjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcclxuICAgICAgICAgICAgdmFyIGVsID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIGJhZCBnaXZlcyBmdWxsIGhyZWYgd2l0aCBsaW5rIC8vdmFyIGhyZWYgPSBlbC5ocmVmOyBcclxuICAgICAgICAgICAgLy8gbmljZSwgZ2l2ZXMgcmF3IGhyZWYsIGZyb20gZWxlbWVudCBvbmx5ICggZS5nLiAjc2VhcmNoX2ZpbHRlciwgaW5zdGVhZCBvZiB3d3cuZ29vZ2xlLmNvbS8jc2VhY2hfZmlsdGVyKVxyXG4gICAgICAgICAgICB2YXIgaHJlZiA9ICg8YW55PmVsKS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xyXG4gICAgICAgICAgICBocmVmID0gaHJlZi5zbGljZSgxKTtcclxuICAgICAgICAgICAgLy92YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCI7XHJcbiAgICAgICAgICAgIC8va2V5ID0gXCIjXCIgKyBrZXk7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHZhciBpc19zYW1lID0gKGhyZWYgPT0ga2V5KSA7XHJcbiAgICAgICAgICAgIGlmIChpc19zYW1lKXsgLy91cmxfaGFzaC5pbmRleE9mKFwiI1wiK2tleSkgPT0gMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5mbyBocmVmIHN3aXRoYy0tXCIgKyBocmVmICsgXCItLVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJib29sXCIsIGhyZWYgPT0gXCJzZWFjaF9maWx0ZXJcIiwgaHJlZiwgXCJzZWFjaF9maWx0ZXJcIik7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaHJlZikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9maWx0ZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9rZXl3b3Jkc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX2tleXdvcmRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX3NpbWlsYXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9zaW1pbGFyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0b2dnbGVfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl90b2dnbGVfZmlsdGVyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlX3NldF9yYW5nZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfZGF0ZV9zZXRfcmFuZ2UoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImNhY2hlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9jYWNoZV90b2dnbGUoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjcy5sb2coXCIjIHNlbGVjdGlvbiB3YXMgLSBcIiArIGhyZWYpOyAgLy8gY29uc29sZS5sb2coXCJocmVmXCIsIGhyZWYpOyAgLy8gY29uc29sZS5sb2coZWwpOyAgIC8vY3MubG9nKGVsLmdldEF0dHJpYnV0ZShcImhyZWZcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICAvLyBpbnRlcnZhbGwgb25DbGljayBwcm9jZXNzaW5nXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGFkZF9hbmNob3JfdGFnc190b19vbkNsaWNrX3Byb2Nlc3NpbmcoKXtcclxuICAgICAgICAvL3JlcGVhdCB0aGlzIGVhY2ggMC4yNSBzZWNvbmQgISEgYnVnIHRvZG8gcmVmYWNcclxuICAgICAgICB2YXIgY29sX2EgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJBXCIpKTtcclxuICAgICAgICAvL3ZhciBsaXN0X2EgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggY29sX2EsIDAgKTtcclxuICAgICAgICB2YXIgbGlzdF9hOiBhbnkgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSBsaXN0X2EucHVzaChjb2xfYVtpXSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImxpXCIsIGxpc3RfYSk7IC8vY29uc29sZS5sb2coXCJsaVwiLCBjb2xfYS5sZW5ndGgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSB7IC8vIGlmIHlvdSBoYXZlIG5hbWVkIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgdmFyIGFuY2ggPSBsaXN0X2FbaV07IC8vICg8YW55PiB4KTtcclxuICAgICAgICAgICAgYW5jaC5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgLy9hbmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcm9jZXNzX2NsaWNrX29yX2VudGVyLCBmYWxzZSk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZF9zdGFydCA6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgICBkX3N0YXJ0Lm9uY2hhbmdlID0gZF9zdGFydF9jaGFuZ2U7XHJcbiAgICAgICAgdmFyIGRfZW5kIDogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKTtcclxuICAgICAgICBkX2VuZC5vbmNoYW5nZSA9IGRfZW5kX2NoYW5nZTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gZnVuY3Rpb24gc2V0X2dsb2JhbF9maWx0ZXJPcHRpb25zX2Zyb21EYXRlKGQ6c3RyaW5nKXtcclxuICAgICAgICAvLyAvL2dsb2JhbF9maWx0ZXJPcHRpb25zLmZyb21EYXRlID0gZDtcclxuICAgICAgICAvLyAvL2J1Z1xyXG4gICAgLy8gfVxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBkX3N0YXJ0X2NoYW5nZSgpe1xyXG4gICAgICAgIHZhciBkYXRlX3N0YXJ0ID0gKCA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKSApLnZhbHVlO1xyXG4gICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLmZyb21EYXRlID0gZGF0ZV9zdGFydDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrIGRhdGUgc3RhcnRcIik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkX2VuZF9jaGFuZ2UoKXtcclxuICAgICAgICB2YXIgZGF0ZV9lbmQgPSAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKSApLnZhbHVlO1xyXG4gICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IGRhdGVfZW5kO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2sgZGF0ZSBlbmRcIik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gb25fbG9hZCgpIHtcclxuICAgIFxyXG4gICAgICAgIGluaV9zZXRfbWV0YURhdGEoKTtcclxuICAgICAgICAvLyBhZGQgc291cmNlIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuXHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3MucHVzaChcInBvbGl0aWNzXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzLnB1c2goXCJidXNpbmVzc1wiKTtcclxuICAgICAgICAvL2dsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXMucHVzaChcImNublwiKTtcclxuICAgICAgICAvL2dsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IFwiMjAxNi0xMi0yNVwiO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBcIjIwMDAtMTItMjVcIjtcclxuICAgICAgICBcclxuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpeyBhZGRfYW5jaG9yX3RhZ3NfdG9fb25DbGlja19wcm9jZXNzaW5nKCk7IH0sIDUwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZl9zZWFyY2hfa2V5d29yZHMoKTtcclxuICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAvL3dpbmRvdy5vbmxvYWQgPSBvbl9sb2FkKCk7XHJcbiAgICAgICBcclxuICAgICAgIC8vI3RzYyAtLXdhdGNoIC1wIGpzXHJcbiAgICAgICBcclxuICAgICAgIC8qXHJcbiAgICAgICAgICBjbGVhbiB1cCBqcywgdHNcclxuICAgICAgICAgIC0gb24gZW50ZXIgc2VhcmNoLCBhZHZhbmNlZCBzZWFyY2hcclxuICAgICAgICAgIC0gb2ZmZXIgZGF0ZSByYW5nZVxyXG4gICAgICAgICAgLSBvZmZlciB0aGVtZXMvdG9waWNzXHJcbiAgICAgICAgICAtIG9mZmVyIGx1cGUgc2hvdywgdXNlIGJhY2tyb3VuZyBpbWFnZT8/IGJldHRlciwgYmVjYXVzZSBjc3MgY2hhbmdlYmFyXHJcbiAgICAgICAgICAtIG9uY2xpY2sgYSBocmVmIG9wZW4gY2FjaGUsIHNlYXJjaCBzaW1pbGFyIChpbnRlcnZhbGwgZ2V0IG5ldyB1cmwpLCBldmVudCBuZXcgcGFnZT8gb25wYWdlbG9hZD9cclxuICAgICAgICAgIC0gb24gXHJcbiAgICAgICAgICAtIHNlbmQgcG9zdCBjbGFzcywgYmluZCBjbGlja3MgLi4uXHJcbiAgICAgICAgICAtIEZpbHRlciBieSB0b3BpYywgYnkgZGF0ZVxyXG4gICAgICAgICAgLSBidXR0b24gLCBiYW5uZXIgLCBwcm9ncmVzcyBiYXIgZm9yIHNlYXJjaCwgc2hvdyBwb3N0IGluZm8gISFcclxuICAgICAgICAgIC0gZmF2b3JpdGUgdG9waWNzIGluIHNlcGFydGUvZmlyc3QgbGluZSAod3JpdGUgbXkgZmF2b3JpdGVzPSA/IG9yIG5vdClcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLSB0b3BpY3MgeWEgPGE+IGZvciBrZXltb3ZlXHJcbiAgICAgICAgICAtIHRlc3QgZXZlcnl0aGluZyBrZXltb3ZlXHJcbiAgICAgICAgICAtIGZpbHRlciwgbHVwZSBrZXltb3ZlIGNvbG9yXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC0gYnVnIGFkZCBzZXJhY2ggYnV0dG9uIHNlYXJjaCBidXR0b25cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLSBmaWx0ZXIgYWRkIDwgPCBeYXJyb3cgZG93biBkYXp1IGF1ZmtsYXBwIGFycm93ICEhXHJcbiAgICAgICAgICAtIGpzb24gdG8gaHRtbCBmb3IgcmVzdWx0ICEhXHJcblxyXG4gICAgICAgICAgYXBwbHkgZmlsdGVyXHJcbiAgICAgICBcclxuICAgICAgICAvLyB0b2RvIHNlYXJjaCBtb3JlIGJ1dHRvbiAhIVxyXG4gICAgICAgIC8vIHRvZG8gZG9rdSwganMgbWluaSBrbGFzc2VuZGlhZ3JhbW0gXHJcbiAgICAgICAgICBcclxuICAgICAgICAvLyBsb2FkIG1hdGFEYXRhIChzb3VyY2VzLCBhbmQgdG9waWNzKSBidWcgdG9kbyBzb3VyY2VzIFxyXG4gICAgICAgIFxyXG4gICAgICAgKi9cclxuICAgICAgIFxyXG4gICAgICAgIiwiIl19
