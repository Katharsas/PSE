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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBK0RqQjtBQS9ERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLGdEQUFnRDtJQUNuRCxJQUFNLE9BQU8sR0FBVyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsSUFBTSxnQkFBZ0IsR0FBVyxVQUFVLEdBQUcsYUFBYSxDQUFDO0lBQzVELElBQU0sZUFBZSxHQUFXLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztJQUNuRSxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUks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R0FBUyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RELEtBQUssQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0FBRWxDLENBQUM7QUFFRCx3REFBd0Q7QUFDcEQsdUNBQXVDO0FBQ3ZDLFFBQVE7QUFDWixJQUFJO0FBRUo7SUFDSSxJQUFJLFVBQVUsR0FBVSxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBRyxDQUFDLEtBQUssQ0FBQztJQUN0RSxvQkFBb0IsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0Q7SUFDSSxJQUFJLFFBQVEsR0FBVSxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBRyxDQUFDLEtBQUssQ0FBQztJQUNsRSxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBR0Q7SUFFSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ25CLGNBQWM7SUFFZCxvQkFBb0IsR0FBRyxJQUFJLDZCQUFhLEVBQUUsQ0FBQztJQUUzQywrQ0FBK0M7SUFDL0MsK0NBQStDO0lBQy9DLDJDQUEyQztJQUMzQyw2Q0FBNkM7SUFDN0MsK0NBQStDO0lBRS9DLFdBQVcsQ0FBQyxjQUFZLHFDQUFxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFekUsaUJBQWlCLEVBQUUsQ0FBQztBQUV4QixDQUFDO0FBS0UsNEJBQTRCO0FBRTVCLG9CQUFvQjtBQUVwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE2QkU7O0FDOWpCVCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgICAgLypcclxuICAgICAqQGF1aG9yIGptb3RoZXNcclxuICAgICAqL1xyXG5cclxuXHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuICAgIC8vdmFyIGNvbnRleHRVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9DV0EvXCI7XHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9tZXRhZGF0YTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0TWV0YWRhdGFcIjtcclxuXHRjb25zdCB1cmxCYXNlX3NpbWlsYXI6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NpbWlsYXJcIjtcclxuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlRdWVyeShxdWVyeTogU3RyaW5nLCBmaWx0ZXJzOiBGaWx0ZXJPcHRpb25zLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicXVlcnk9XCIgKyBxdWVyeSk7XHJcblxyXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fXCIsZmlsdGVyUGFyYW1zKTtcclxuXHRcdGlmIChmaWx0ZXJQYXJhbXMgIT09IFwiXCIpIHBhcmFtcy5wdXNoKGZpbHRlclBhcmFtcyk7XHJcblxyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUlxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKCk6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlX21ldGFkYXRhIDtcclxuXHRcdC8vIFRPRE8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSIFxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVNpbWlsYXIoYXJ0aWNsZUlkOiBTdHJpbmcsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblxyXG4gICAgICAgIGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcImlkPVwiICsgYXJ0aWNsZUlkKTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZV9zaW1pbGFyICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2dldEJ5SWRfX1wiLHVybCk7XHJcblxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcbn0iLCIgICAgLyogXHJcbiAgICAgKkBhdWhvciBqbW90aGVzXHJcbiAgICAgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBGaWx0ZXJPcHRpb25zIHtcclxuXHJcblx0dG9waWNzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdHNvdXJjZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBcclxuICAgIGZyb21EYXRlOiBzdHJpbmcgPSBcIjE5ODAtMDEtMDFcIjtcclxuXHR0b0RhdGU6IHN0cmluZyA9IFwiMjAyMC0wMS0wMVwiOyAvLyBidWcgLCBiZXR0ZXIgZGVmYXVsdHMgPyBcclxuICAgIFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0IGZpbHRlciBvcHRpb25zIHRvIHVybCBwYXJhbWV0ZXIgc3RyaW5nIG9mIGZvcm1hdFxyXG5cdCAqIFwicGFyYW0xPXZhbHVlMSZwYXJhbTI9dmFsdWUyJnBhcmFtND12YWx1ZTNcIiBmb3IgdXNlIGFzIHVybCBwYXJhbWV0ZXJzLlxyXG5cdCAqL1xyXG5cdHRvVXJsUGFyYW0oKTogc3RyaW5nIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMudG9waWNzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJ0b3BpY3M9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy50b3BpY3MpKTtcclxuXHRcdGlmICh0aGlzLnNvdXJjZXMubGVuZ3RoICE9PSAwKSBwYXJhbXMucHVzaChcInNvdXJjZXM9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy5zb3VyY2VzKSk7XHJcblx0XHRpZiAodGhpcy5mcm9tRGF0ZSAhPT0gbnVsbCkgcGFyYW1zLnB1c2goXCJmcm9tPVwiICsgdGhpcy5mcm9tRGF0ZSk7XHJcblx0XHRpZiAodGhpcy50b0RhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcblxyXG5cdFx0cmV0dXJuIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY29uY2F0TXVsdGlQYXJhbShhcnJheTogc3RyaW5nW10pOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGFycmF5LmpvaW4oXCI7XCIpO1xyXG5cdH1cclxufVxyXG4iLCIgICAgLypcclxuICAgICAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gICAgICovXHJcblxyXG4gICAgLy8gdXRpbCBmdW5jdGlvbnMgaHRtbEJ1aWxkZXJcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtKGVsTmFtZTogc3RyaW5nLCBjbHNOYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHZhciB0bXAgPSAoPEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxOYW1lKSk7XHJcbiAgICAgICAgdG1wLmNsYXNzTGlzdC5hZGQoY2xzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHRtcDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUZXh0KHBhcmVudDogYW55LCB0eHQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0bXApO1xyXG4gICAgICAgIC8vcmV0dXJuIHRtcDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IG1vZHVsZSBIdG1sQnVpbGRlciB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGQgaHRtbCBsaSBlbGVtZW50IGZyb20gYXJ0aWNsZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gYnVpbGRBcnRpY2xlKGFydGljbGU6IGFueSwgcGFyZW50OiBhbnkpIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy92YXIgdG1wX2NsZWFyZml4ID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcm9vdCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJyZXN1bHRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9waWMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX3RvcGljXCIpO1xyXG4gICAgICAgICAgICB2YXIgdG9waWNfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KHRvcGljX2J1dHRvbiwgYXJ0aWNsZS50b3BpYyk7XHJcbiAgICAgICAgICAgIHRvcGljLmFwcGVuZENoaWxkKHRvcGljX2J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHRvcGljKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwidGl0bGVcIik7XHJcbiAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBhcnRpY2xlLnVybDtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBhcnRpY2xlLnRpdGxlKTtcclxuICAgICAgICAgICAgdGl0bGUuYXBwZW5kQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsaW5rID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImxpbmtcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQobGluaywgYXJ0aWNsZS51cmwuc3Vic3RyaW5nKDAsIDQ1KSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX2RhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfZGF0ZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsIFwiZGF0ZVwiKTtcclxuICAgICAgICAgICAgdmFyIHJhd19kYXRlID0gYXJ0aWNsZS5wdWJEYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2J1ZyBzdWJzdHIgb3RoZXIgYmVoYXZpb3VyIHRoYW4gc3Vic3RyaW5nXHJcbiAgICAgICAgICAgIHZhciBkYXRlX3kgPSByYXdfZGF0ZS5zdWJzdHJpbmcoMCwgNCk7XHJcbiAgICAgICAgICAgIC8vIGhlcmUgZmlyZWZveCBqcyBicm93c2VyIGJ1ZyBvbiBzdWJzdHIoNSw3KVxyXG4gICAgICAgICAgICB2YXIgZGF0ZV9tID0gcmF3X2RhdGUuc3Vic3RyaW5nKDUsIDcpLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfZCA9IHJhd19kYXRlLnN1YnN0cmluZyg4LCAxMCkucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZF9kYXRlID0gZGF0ZV9kICsgXCIuXCIgKyBkYXRlX20gKyBcIi5cIiArIGRhdGVfeVxyXG4gICAgICAgICAgICBhZGRUZXh0KGRhdGVfZGF0ZSwgZm9ybWF0dGVkX2RhdGUpO1xyXG4gICAgICAgICAgICBkYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX2RhdGUpO1xyXG4gICAgICAgICAgICAvL3ZhciBkYXRlX3RpbWUgPSBjcmVhdGVFbGVtKFwic3BhblwiLFwidGltZVwiKTtcclxuICAgICAgICAgICAgLy9kYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX3RpbWUpO1xyXG4gICAgICAgICAgICBkYXRlLmFwcGVuZENoaWxkKGRhdGVfYnV0dG9uKTtcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChkYXRlKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudCwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0LnN1YnN0cmluZygwLCAzMDApKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50X2NhY2hlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRfY2FjaGVcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0KTtcclxuICAgICAgICAgICAgdmFyIGJyX3RhZyA9IGNyZWF0ZUVsZW0oXCJiclwiLFwibm90aGluZ19zcGVjaWFsXCIpO1xyXG4gICAgICAgICAgICBjb250ZW50X2NhY2hlLmFwcGVuZENoaWxkKGJyX3RhZyk7XHJcbiAgICAgICAgICAgIHZhciBicl90YWcgPSBjcmVhdGVFbGVtKFwiYnJcIixcIm5vdGhpbmdfc3BlY2lhbFwiKTtcclxuICAgICAgICAgICAgY29udGVudF9jYWNoZS5hcHBlbmRDaGlsZChicl90YWcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYWRkVGV4dChjb250ZW50X2NhY2hlLCBhcnRpY2xlLnNvdXJjZSk7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGVudF9jYWNoZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXV0aG9yID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImF1dGhvclwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dChhdXRob3IsIGFydGljbGUuYXV0aG9yKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoYXV0aG9yKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGltZyBzcmM9XCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcl9idXR0b25zID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9idXR0b25zXCIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGJ1ZyByZWZhYyB0b2RvLCBoZXJlIGF1ZmtsYXBwZW4gbGFuZ2VyIHRleHQgIVxyXG4gICAgICAgICAgICB2YXIgY2FjaGVfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gXCIjY2FjaGVcIjsgLy8gKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcsIGFydGljbGUuYXJ0aWNsZUlkX3N0cik7XHJcbiAgICAgICAgICAgIHZhciBpbWcgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgICAgICAgaW1nLnNyYyA9IFwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjsvL1wiXCI7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBcIkNhY2hlXCIpO1xyXG5cclxuICAgICAgICAgICAgY2FjaGVfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICBjb250YWluZXJfYnV0dG9ucy5hcHBlbmRDaGlsZChjYWNoZV9idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNpbWlsYXJfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gXCIjc2VhcmNoX3NpbWlsYXJcIjtcclxuICAgICAgICAgICAgLy9hLmhyZWYgPSBcIiNzaW1pbGFyX2lkX1wiICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyOyAvLzExMjMyNDNcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJywgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyKTtcclxuICAgICAgICAgICAgLy9hLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGEsIFwiU2ltaWxhclwiKTtcclxuICAgICAgICAgICAgc2ltaWxhcl9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXJfYnV0dG9ucy5hcHBlbmRDaGlsZChzaW1pbGFyX2J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRhaW5lcl9idXR0b25zKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciBfdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpOyAvLzogYW55O1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUb3BraWMga2tcIik7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XHJcbiAgICAgICAgICAgIF90bXAuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsIF90bXApO1xyXG4gICAgICAgICAgICAvL3BhcmVudC5hcHBlbmRDaGlsZChfdG1wKTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gZWw7XHJcbiAgICAgICAgICAgIC8vIHVuc2F1YmVyZXIgY29kZSwgYnVpbGQgdW5kIGFwcGVuZCB0cmVubmVuIGV2ZW50bD9cclxuICAgICAgICAgICAgdmFyIGxpID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQocm9vdCk7XHJcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLHJvb3QsIHRvcGljKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLCBsaSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcblxyXG5cclxuICAgICAgICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB2YXIgdG9waWNfbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0X3RvcGljX2xpc3RcIik7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGZvciAodmFyIGk9MDsgaTwgMDsgaSsrKXsgLy9idWdcclxuICAgICAgICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgICAvL2psLmxvZyhcIlRoaXMgcG9zdCB3YXNcXG5cIixcImVyclwiKTtcclxuICAgICAgICAgICAgIC8vamwubG9nKGksXCJtc2dcIik7XHJcbiAgICAgICAgICAgICAvL2NzLmxvZyhpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGJ1ZyBnZXQgc291cmNlcyB0b2RvICEhXHJcbiAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8IDE1OyBpKyspe1xyXG4gICAgICAgICAgICAgdmFyIGVsID0gICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSAgKTtcclxuICAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGljIFwiK2kpIDtcclxuICAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKCB0ZXh0X25vZGUgKTtcclxuICAgICAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgICAgICAgICAvLyBidWcgZXJyb2Ygb2YgdHlwZXNjcmlwdCA/P1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9cclxuICAgICAgICAgIFxyXG4gICAgICAqL1xyXG5cclxuIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBkYmVja3N0ZWluLCBqZnJhbnpcclxuICAgICAqL1xyXG5cclxuICAgIGltcG9ydCB7QWpheH0gZnJvbSBcIi4vQWpheFwiO1xyXG4gICAgaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcbiAgICBpbXBvcnQge0h0bWxCdWlsZGVyfSBmcm9tIFwiLi9IdG1sQnVpbGRlclwiO1xyXG5cclxuICAgIGNsYXNzIEFydGljbGVSZXN1bHQge1xyXG4gICAgICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgIGFydGljbGVzOiBhbnlbXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNZXRhZGF0YVJlc3VsdCB7XHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgc291cmNlczogc3RyaW5nW107XHJcbiAgICAgICAgdG9waWNzOiBzdHJpbmdbXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNeUNvbnNvbGUge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgbG9nKHM6IHN0cmluZykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiICsgcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjbGFzcyBTZXJ2ZXJDb25uZWN0aW9uIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGNzLmxvZyhcIlwiICsgcyk7XHJcbiAgICAgICAgICAgIGpsLmxvZyhcInBvc3Q6IFwiICsgcywgXCJudGZcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjbGFzcyBKc0xvZyB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBsb2coczogc3RyaW5nLCBzdGF0dXNfbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vI2pzb24/PyBGRjk4MzhcclxuICAgICAgICAgICAgdmFyIHN0YXR1cyA9IFtcImVyclwiLCBcIm1zZ1wiLCBcIm50ZlwiXTtcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5ID0gW1wiRXJyb3JcIiwgXCJNZXNzYWdlXCIsIFwiTm90aWZpY2F0aW9uXCJdO1xyXG4gICAgICAgICAgICB2YXIgY29sb3JzID0gW1wiRkY2MTU5XCIsIFwiRkY5RjUxXCIsIFwiMjJCOEVCXCIsIFwiXCIsIFwiXCJdOyBcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgb3JhbmdlICBcclxuICAgICAgICAgICAgdmFyIGpsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc19sb2dcIik7IC8vaW4gY29uc3RydWN0b3IgcmVpblxyXG4gICAgICAgICAgICB2YXIgY29sX2lkID0gc3RhdHVzLmluZGV4T2Yoc3RhdHVzX25hbWUpO1xyXG4gICAgICAgICAgICAvLyBhbGxlcnQgcmFzaWUgYnVnICwgZXJybyByaWYgY29sX2lkIDwgMFxyXG4gICAgICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXlfbmFtZSA9IHN0YXR1c19kaXNwbGF5W2NvbF9pZF1cclxuICAgICAgICAgICAgcyA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj5cIik7XHJcbiAgICAgICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSBzLnJlcGxhY2UoXCJcXG5cIiwgXCI8YnI+PGJyPlwiKTtcclxuICAgICAgICAgICAgamwuaW5uZXJIVE1MID0gdHh0O1xyXG4gICAgICAgICAgICAvL2psLnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI1wiK2NvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgICAgICBqbC5zdHlsZS5ib3JkZXJDb2xvciA9IFwiI1wiICsgY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBFeGNhdCBvcmRlciBvZiB0aGVzZSBuZXh0IGNvbW1hbmRzIGlzIGltcG9ydGFudCBcclxuICAgIHZhciBjcyA9IG5ldyBNeUNvbnNvbGUoKTtcclxuICAgIHZhciBqbCA9IG5ldyBKc0xvZygpO1xyXG4gICAgdmFyIGNvbm4gPSBuZXcgU2VydmVyQ29ubmVjdGlvbigpO1xyXG5cclxuICAgIHZhciBnbG9iYWxfZmlsdGVyT3B0aW9uczogYW55O1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IFxyXG4gICAgICAgIG9uX2xvYWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaF9kZW1vKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS1zZWFyY2hfZGVtby0tLS0tLS0tLS1cIik7XHJcbiAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgfVxyXG4gICAgICAgIC8vIHRvZG8gZGF0ZSBjaGFuZ2VkIGlzIGluIGh0bWxcclxuICAgICAgICAvLyBMaXN0ZW4gZm9yIGNoYW5nZXMgb2YgZGF0ZVxyXG4gICAgXHJcbiAgICAgICAgLy8gZnVjbnRpb24gZGF0ZVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHZhciBlbF9kYXRlX3N0YXJ0ID0gPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgICAgIC8vIHZhciBlbF9kYXRlX2VuZCA9IDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9lbmRcIik7XHJcbiAgICAgICAgLy8gZWxfZGF0ZV9zdGFydC5vbmJsdXIgPSBkYXRlX3dhc19jaGFuZ2VkKGVsX2RhdGVfc3RhcnQpO1xyXG4gICAgICAgIC8vIGVsX2RhdGVfZW5kLm9uYmx1ciA9IGRhdGVfd2FzX2NoYW5nZWQoZWxfZGF0ZV9lbmQpO1xyXG4gICAgXHJcbiAgICAvL0NyZWF0ZXMgbGlzdCBvZiBtZXRhZGF0YSBsaSBlbGVtZW50c1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBzZXRfbWV0YURhdGEocmVzdWx0OiBNZXRhZGF0YVJlc3VsdCkge1xyXG4gICAgICAgIHZhciB0b3BpY19zZXQ6IGFueSA9IFtdO1xyXG4gICAgICAgIHZhciBzb3VyY2Vfc2V0OiBhbnkgPSBbXTtcclxuICAgICAgICAvL3RvcGljX3NldCA9IFtcInRvcGljIDFcIiwgXCJ0b3BpYyAyXCIsIFwidG9waWMgM1wiXTtcclxuICAgICAgICBjb25zb2xlLmxvZyAoXCItLS1ub3ctLS1cIixyZXN1bHQuc291cmNlcyk7XHJcbiAgICAgICAgdG9waWNfc2V0ID0gcmVzdWx0LnRvcGljcztcclxuICAgICAgICBzb3VyY2Vfc2V0ID0gcmVzdWx0LnNvdXJjZXM7XHJcblxyXG4gICAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuICAgICAgICAvLyBjaGVjayBsZW5ndGggXHJcbiAgICAgICAgLy92YXIgY2hpbGRyZW4gPSB0b3BpY19saXN0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlcIik7XHJcbiAgICAgICAgLy9pZiBjaGlsZHJlbi5sZW5naHRcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcGljX3NldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdG9waWNOYW1lID0gdG9waWNfc2V0W2ldO1xyXG4gICAgICAgICAgICB2YXIgYSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiN0b2dnbGVfZmlsdGVyXCI7IC8vIHRvcGljcyB0aGlzLCBhZGQgdG8gYXRcclxuICAgICAgICAgICAgLy9hLmhyZWYgPSBcIiNzaW1pbGFyX2lkX1wiICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyOyAvLzExMjMyNDNcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLW5hbWUnLCB0b3BpY05hbWUpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScsIFwidG9waWNcIik7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzb3VyY2VfbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0X3NvdXJjZV9saXN0XCIpO1xyXG4gICAgICAgIC8vIGNoZWNrIGxlbmd0aCBcclxuICAgICAgICAvL3ZhciBjaGlsZHJlbl9zb3VyY2UgPSBzb3VyY2VfbGlzdC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpXCIpO1xyXG4gICAgICAgIC8vaWYgY2hpbGRyZW4ubGVuZ2h0XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2Vfc2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2VOYW1lID0gc291cmNlX3NldFtpXTtcclxuICAgICAgICAgICAgdmFyIGEgPSAoPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gXCIjdG9nZ2xlX2ZpbHRlclwiOyAvLyBzb3VyY2VzIHRoaXMsIGFkZCB0byBhdFxyXG4gICAgICAgICAgICAvL2EuaHJlZiA9IFwiI3NpbWlsYXJfaWRfXCIgKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7IC8vMTEyMzI0M1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScsIHNvdXJjZU5hbWUpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScsIFwic291cmNlXCIpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGEub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzb3VyY2VOYW1lKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIHNvdXJjZV9saXN0LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBMb2FkcyBtZXRhZGF0YVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaV9zZXRfbWV0YURhdGEoKTogYW55IHtcclxuICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICAgICAgQWpheC5nZXRNZXRhZGF0YSgpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyB0b3BpY3MgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LnRvcGljcyk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJOZXcgc291cmNlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQuc291cmNlcyk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNldF9tZXRhRGF0YShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHJlc3VsdDsgLy9idWcgYXN5bmNocm9udW9zICEhXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICAgICAgLypcclxuICAgICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDA7IGkrKykgeyAvL2J1Z1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2hvdyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfaGlkZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vY2hlY2sgc3RhdHVzPyByYWlzZSBlcnJvciBpZiBoaWRkZW4/XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpKTtcclxuICAgICAgICAgICAgZS5pZCA9IFwic3Bhbl9oaWRkZW5fXCIgKyBpZDtcclxuICAgICAgICAgICAgZS5jbGFzc05hbWUgPSBcInNwYW5faGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fZGVsZXRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2VubiBrZWluIEhpZGRlbiBTcGFuIGRhLCBkYW5uIHdlcnQgaW1tZXIgZmFsc2NoISFcclxuICAgICAgICAgICAgLy9idWcgYXNzdW1lcyBqdXN0IG9uZSBjbGFzIHJhaXNlIHdhcm5pZ24gaWYgbW9yZSBjbGFzc2VzICEhICwgY2xlYXJlZCwgYnkgY2hlY2sgbGVuZ2h0ID09IDFcclxuICAgICAgICAgICAgaWYgKHNwYW5fbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwYW4gPSBzcGFuX2xpc3RbMF07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFuLmlubmVySFRNTCwgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICBib29sID0gKFwiXCIgKyB0ZXh0ID09IFwiXCIgKyBzcGFuLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBib29sKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJvb2w7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHNfb2xkKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGZsZF9zZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIik7XHJcbiAgICAgICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgICAgIGNvbm4ucG9zdChrZXl3b3Jkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHV0aWxfZW1wdHlfbm9kZShteU5vZGUgOiBOb2RlKXtcclxuICAgICAgICAgICAgd2hpbGUgKG15Tm9kZS5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBteU5vZGUucmVtb3ZlQ2hpbGQobXlOb2RlLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcygpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLXNlYXJjaF9kZW1vLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICAgICAgLy8gb25fbG9hZCgpOyAvLyBidWcgdG9kbyAsIDwtIGRvbmVcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSAoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIikpLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9rX2tleXdvcmRfX1wiICsgXCItXCIgKyBrZXl3b3JkcyArIFwiLVwiKTtcclxuXHJcbiAgICAgICAgICAgIEFqYXguZ2V0QnlRdWVyeShrZXl3b3JkcywgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsX2VtcHR5X25vZGUobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFydGljbGUgb2YgcmVzdWx0LmFydGljbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuYXV0aG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxCdWlsZGVyLmJ1aWxkQXJ0aWNsZShhcnRpY2xlLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfZmlsdGVyKGVsOiBhbnkpIHsgLy8gYnVnIGtleSBub3QgdXNlZFxyXG4gICAgICAgICAgICB2YXIgY2hlY2sgPSBzcGFuX2hpZGRlbl9jaGVjayhcImZpbHRlcl9zZXR0aW5nc1wiLCBcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgIGlmIChjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudF9oaWRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgc3Bhbl9oaWRkZW5fZGVsZXRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBjbG9zaW5nLlwiLCBcIm50ZlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRfc2hvdyhcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIHNwYW5faGlkZGVuX2NyZWF0ZShcImZpbHRlcl9zZXR0aW5nc1wiLCBcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIG9wZW5pbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vc2hvdyBoaWRlLCBub3QgdG9nZ2xlICEhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vdmFyIGRhdGVfc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgICAgLy92YXIgZGF0ZV9zdGFydF9zdHIgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGRhdGVfc3RhcnQpLnZhbHVlLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgICAgIC8vdmFyIGRhdGVfc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGVfc3RhcnRfc3RyKTtcclxuICAgICAgICAvL2NzLmxvZyhcIlwiICsgZGF0ZV9zdGFydF9kYXRlKTtcclxuICAgICAgICAvL2NzLmxvZyhkYXRlX3N0YXJ0X2RhdGUudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrX3VybF9uYW1lKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICAgICAgLy92YXIgdXJsX25hbWUgPSB3aW5kb3cubG9jYXRpb247Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgICAgIC8vY3MubG9nKHVybF9uYW1lKTtcclxuICAgICAgICAgICAgdmFyIHVybF9oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybF9oYXNoKTsgLy8gZG9lcyBub3Qgd29yayBpbiBpZT8/ICEhIVxyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCI7XHJcbiAgICAgICAgICAgIGlmICh1cmxfaGFzaC5pbmRleE9mKFwiI1wiICsga2V5KSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoa2V5KTtcclxuICAgICAgICAgICAgICAgIGNzLmxvZyhrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vaWYgI3NlYXJjaF9maWx0ZXIgaW4gdXJsX2hhc2hcclxuICAgICAgICAgICAgLy9tdWx0aWZsYWdfbGFzdF9oYXNoID0gc2VhcmNoX2ZpbHRlci4uLlxyXG4gICAgICAgICAgICAvL3Nob3cgZmlsZXRlciwgc2VhY2gga2V5d29yZHMsIHNob3cgY2FjaGUgKGdyZXksIGJsdWUsIGJsYWNrIGFuZCB3aGl0ZSwgdGhlbWUgYWxsIG5ldyBjYWNoZSwgZG8gcG9zdCByZXEuKVxyXG4gICAgICAgICAgICAvLyBpZiBrZXl3b3JkcywgcG9zdCBhY3Rpb24gPSBzZXJhY2ggc3ViYWN0aW9uID0ga2V5d29yZHMgZGF0YSA9IGtleXdvcmRzIGFycmF5LCBvciBjYWNoZV9pZCByZXF1ZXN0IGluZm9zLi4uLCBcclxuICAgICAgICAgICAgLy8gdGhlbiBzaG93LCBwb3N0IHVwZGF0ZSBncmV5IGFyZSBwcm9ncmVzcyBiYXIsIGZpbHRlciBpbmZvcyBnZXQgbG9jYWwgc3RvcmFnZSBmaWx0ZXJzX18uLiwgZ2V0IGZpbHRlcnMgZnJvbSBwYWdlPyBtYXJrZWQgKHNwYW4gbWFya2UsIHJlYWwgdmFsdWUsIGRpc3BsYXkuLi5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfc2ltaWxhcihlbCA6IGFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tc2ltaWxhci0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciBhcnRpY2xlSWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlSWQpO1xyXG4gIFxyXG4gICAgICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludCA9IFwiX19fc2ltaWxhcl9fX1wiO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgQWpheC5nZXRCeVNpbWlsYXIoYXJ0aWNsZUlkLCAwLCAxMClcclxuICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbF9lbXB0eV9ub2RlKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlLmF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBzYW1wbGUgPSAoPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIdG1sQnVpbGRlci5idWlsZEFydGljbGUoYXJ0aWNsZSwgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2RhdGVfc2V0X3JhbmdlKGVsIDogYW55KXtcclxuICAgICAgICAgICB2YXIgZGF5c19iYWNrX2Zyb21fbm93ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUtcmFuZ2UtZGF5cycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXlzX2JhY2tfZnJvbV9ub3cpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAvL3ZhciBkcyA9IFwiXCIgKyBkLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmRfc3RyID0gKGRhdGVfZW5kLmdldEZ1bGxZZWFyKCkgKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0TW9udGgoKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKSApLnZhbHVlID0gZGF0ZV9lbmRfc3RyO1xyXG4gICAgICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b0RhdGUgPSBkYXRlX2VuZF9zdHI7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX3N0YXJ0ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZGF0ZV9zdGFydC5zZXREYXRlKGRhdGVfc3RhcnQuZ2V0RGF0ZSgpIC0gZGF5c19iYWNrX2Zyb21fbm93KTtcclxuICAgICAgICAgICAgLy92YXIgZGF0ZV9zdGFydCA9IGRhdGVfZW5kIC0gMTtcclxuICAgICAgICAgICAgLy9kYXlzX2JhY2tfZnJvbV9ub3dcclxuICAgICAgICAgICAgdmFyIGRhdGVfc3RhcnRfc3RyID0gKGRhdGVfc3RhcnQuZ2V0RnVsbFllYXIoKSApICsgXCItXCIgKyBkYXRlX3N0YXJ0LmdldE1vbnRoKCkgKyBcIi1cIiArIGRhdGVfc3RhcnQuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpICkudmFsdWUgPSBkYXRlX3N0YXJ0X3N0cjtcclxuICAgICAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBkYXRlX3N0YXJ0X3N0cjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY3NzX2hpZGUoZWw6YW55KXtcclxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBjc3Nfc2hvdyhlbDphbnkpe1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl90b2dnbGVfZmlsdGVyKGVsOmFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tZmlsdGVyLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIHR5cGUgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJyk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScpO1xyXG4gICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkX3ByZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdmFyIGZpbHRlciA6IGFueTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidG9waWNcIil7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIgPSBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3M7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyID0gZ2xvYmFsX2ZpbHRlck9wdGlvbnMuc291cmNlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNTZWxlY3RlZD09PVwidHJ1ZVwiKXtcclxuICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmlsdGVyLmluZGV4T2YobmFtZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vYnVnID8/XHJcbiAgICAgICAgICAgICAgICBpZiAoIGluZGV4IT09KC0xKSApe1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlci5zcGxpY2UoaW5kZXgsIDEpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgIGZpbHRlci5wdXNoKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5hbWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fZmlsdGVyX19jb250ZW5ldF9fXCIsIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvcGljcyk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fY29udGVuZXRfX1wiLCBnbG9iYWxfZmlsdGVyT3B0aW9ucy5zb3VyY2VzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9faXNfX19fX19fX1wiLCBpc1NlbGVjdGVkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9faXNfX3ByZV9fX1wiLCBpc1NlbGVjdGVkX3ByZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX2lzX19fX19fX19cIiwgZmlsdGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl9jYWNoZV90b2dnbGUoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLWNhY2hlLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIGlkICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgICAgICB2YXIgcGUgOiBhbnkgPSBlbC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgdmFyIHBpZCA6IGFueSA9IHBlLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaWQpO1xyXG4gICAgICAgICAgICB2YXIgZV9jb24gOiBhbnkgPSBwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGVudFwiKVswXTtcclxuICAgICAgICAgICAgdmFyIGVfY29uX2NhY2hlIDogYW55ID0gcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRlbnRfY2FjaGVcIilbMF07XHJcbiAgICAgICAgICAgIGlmIChlX2Nvbl9jYWNoZS5zdHlsZS5kaXNwbGF5ICE9IFwiYmxvY2tcIil7XHJcbiAgICAgICAgICAgICAgICBjc3Nfc2hvdyhlX2Nvbl9jYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBjc3NfaGlkZShlX2Nvbik7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY3NzX2hpZGUoZV9jb25fY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgY3NzX3Nob3coZV9jb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVfY29uKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NfY2xpY2tfb3JfZW50ZXIoZXY6IGFueSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldik7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAvLyBiYWQgZ2l2ZXMgZnVsbCBocmVmIHdpdGggbGluayAvL3ZhciBocmVmID0gZWwuaHJlZjsgXHJcbiAgICAgICAgICAgIC8vIG5pY2UsIGdpdmVzIHJhdyBocmVmLCBmcm9tIGVsZW1lbnQgb25seSAoIGUuZy4gI3NlYXJjaF9maWx0ZXIsIGluc3RlYWQgb2Ygd3d3Lmdvb2dsZS5jb20vI3NlYWNoX2ZpbHRlcilcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAoPGFueT5lbCkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcclxuICAgICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIC8vdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgICAgICAvL2tleSA9IFwiI1wiICsga2V5O1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICB2YXIgaXNfc2FtZSA9IChocmVmID09IGtleSkgO1xyXG4gICAgICAgICAgICBpZiAoaXNfc2FtZSl7IC8vdXJsX2hhc2guaW5kZXhPZihcIiNcIitrZXkpID09IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluZm8gaHJlZiBzd2l0aGMtLVwiICsgaHJlZiArIFwiLS1cIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYm9vbFwiLCBocmVmID09IFwic2VhY2hfZmlsdGVyXCIsIGhyZWYsIFwic2VhY2hfZmlsdGVyXCIpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGhyZWYpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfa2V5d29yZHNcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9zaW1pbGFyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfc2ltaWxhcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidG9nZ2xlX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfdG9nZ2xlX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZV9zZXRfcmFuZ2VcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX2RhdGVfc2V0X3JhbmdlKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJjYWNoZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfY2FjaGVfdG9nZ2xlKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY3MubG9nKFwiIyBzZWxlY3Rpb24gd2FzIC0gXCIgKyBocmVmKTsgIC8vIGNvbnNvbGUubG9nKFwiaHJlZlwiLCBocmVmKTsgIC8vIGNvbnNvbGUubG9nKGVsKTsgICAvL2NzLmxvZyhlbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgLy8gaW50ZXJ2YWxsIG9uQ2xpY2sgcHJvY2Vzc2luZ1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBhZGRfYW5jaG9yX3RhZ3NfdG9fb25DbGlja19wcm9jZXNzaW5nKCl7XHJcbiAgICAgICAgLy9yZXBlYXQgdGhpcyBlYWNoIDAuMjUgc2Vjb25kICEhIGJ1ZyB0b2RvIHJlZmFjXHJcbiAgICAgICAgdmFyIGNvbF9hID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiQVwiKSk7XHJcbiAgICAgICAgLy92YXIgbGlzdF9hID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGNvbF9hLCAwICk7XHJcbiAgICAgICAgdmFyIGxpc3RfYTogYW55ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgbGlzdF9hLnB1c2goY29sX2FbaV0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJsaVwiLCBsaXN0X2EpOyAvL2NvbnNvbGUubG9nKFwibGlcIiwgY29sX2EubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIHZhciBhbmNoID0gbGlzdF9hW2ldOyAvLyAoPGFueT4geCk7XHJcbiAgICAgICAgICAgIGFuY2gub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIC8vYW5jaC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHJvY2Vzc19jbGlja19vcl9lbnRlciwgZmFsc2UpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRfc3RhcnQgOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgICAgZF9zdGFydC5vbmNoYW5nZSA9IGRfc3RhcnRfY2hhbmdlO1xyXG4gICAgICAgIHZhciBkX2VuZCA6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9lbmRcIik7XHJcbiAgICAgICAgZF9lbmQub25jaGFuZ2UgPSBkX2VuZF9jaGFuZ2U7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIGZ1bmN0aW9uIHNldF9nbG9iYWxfZmlsdGVyT3B0aW9uc19mcm9tRGF0ZShkOnN0cmluZyl7XHJcbiAgICAgICAgLy8gLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IGQ7XHJcbiAgICAgICAgLy8gLy9idWdcclxuICAgIC8vIH1cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gZF9zdGFydF9jaGFuZ2UoKXtcclxuICAgICAgICB2YXIgZGF0ZV9zdGFydCA9ICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIikgKS52YWx1ZTtcclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IGRhdGVfc3RhcnQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGljayBkYXRlIHN0YXJ0XCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZF9lbmRfY2hhbmdlKCl7XHJcbiAgICAgICAgdmFyIGRhdGVfZW5kID0gKCA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9lbmRcIikgKS52YWx1ZTtcclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b0RhdGUgPSBkYXRlX2VuZDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrIGRhdGUgZW5kXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIG9uX2xvYWQoKSB7XHJcbiAgICBcclxuICAgICAgICBpbmlfc2V0X21ldGFEYXRhKCk7XHJcbiAgICAgICAgLy8gYWRkIHNvdXJjZSBcclxuICAgICAgICBcclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucyA9IG5ldyBGaWx0ZXJPcHRpb25zKCk7XHJcblxyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzLnB1c2goXCJwb2xpdGljc1wiKTtcclxuICAgICAgICAvL2dsb2JhbF9maWx0ZXJPcHRpb25zLnRvcGljcy5wdXNoKFwiYnVzaW5lc3NcIik7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5zb3VyY2VzLnB1c2goXCJjbm5cIik7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy50b0RhdGUgPSBcIjIwMTYtMTItMjVcIjtcclxuICAgICAgICAvL2dsb2JhbF9maWx0ZXJPcHRpb25zLmZyb21EYXRlID0gXCIyMDAwLTEyLTI1XCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgYWRkX2FuY2hvcl90YWdzX3RvX29uQ2xpY2tfcHJvY2Vzc2luZygpOyB9LCA1MDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZfc2VhcmNoX2tleXdvcmRzKCk7XHJcbiAgICAgICBcclxuICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgLy93aW5kb3cub25sb2FkID0gb25fbG9hZCgpO1xyXG4gICAgICAgXHJcbiAgICAgICAvLyN0c2MgLS13YXRjaCAtcCBqc1xyXG4gICAgICAgXHJcbiAgICAgICAvKlxyXG4gICAgICAgICAgY2xlYW4gdXAganMsIHRzXHJcbiAgICAgICAgICAtIG9uIGVudGVyIHNlYXJjaCwgYWR2YW5jZWQgc2VhcmNoXHJcbiAgICAgICAgICAtIG9mZmVyIGRhdGUgcmFuZ2VcclxuICAgICAgICAgIC0gb2ZmZXIgdGhlbWVzL3RvcGljc1xyXG4gICAgICAgICAgLSBvZmZlciBsdXBlIHNob3csIHVzZSBiYWNrcm91bmcgaW1hZ2U/PyBiZXR0ZXIsIGJlY2F1c2UgY3NzIGNoYW5nZWJhclxyXG4gICAgICAgICAgLSBvbmNsaWNrIGEgaHJlZiBvcGVuIGNhY2hlLCBzZWFyY2ggc2ltaWxhciAoaW50ZXJ2YWxsIGdldCBuZXcgdXJsKSwgZXZlbnQgbmV3IHBhZ2U/IG9ucGFnZWxvYWQ/XHJcbiAgICAgICAgICAtIG9uIFxyXG4gICAgICAgICAgLSBzZW5kIHBvc3QgY2xhc3MsIGJpbmQgY2xpY2tzIC4uLlxyXG4gICAgICAgICAgLSBGaWx0ZXIgYnkgdG9waWMsIGJ5IGRhdGVcclxuICAgICAgICAgIC0gYnV0dG9uICwgYmFubmVyICwgcHJvZ3Jlc3MgYmFyIGZvciBzZWFyY2gsIHNob3cgcG9zdCBpbmZvICEhXHJcbiAgICAgICAgICAtIGZhdm9yaXRlIHRvcGljcyBpbiBzZXBhcnRlL2ZpcnN0IGxpbmUgKHdyaXRlIG15IGZhdm9yaXRlcz0gPyBvciBub3QpXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC0gdG9waWNzIHlhIDxhPiBmb3Iga2V5bW92ZVxyXG4gICAgICAgICAgLSB0ZXN0IGV2ZXJ5dGhpbmcga2V5bW92ZVxyXG4gICAgICAgICAgLSBmaWx0ZXIsIGx1cGUga2V5bW92ZSBjb2xvclxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIGJ1ZyBhZGQgc2VyYWNoIGJ1dHRvbiBzZWFyY2ggYnV0dG9uXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC0gZmlsdGVyIGFkZCA8IDwgXmFycm93IGRvd24gZGF6dSBhdWZrbGFwcCBhcnJvdyAhIVxyXG4gICAgICAgICAgLSBqc29uIHRvIGh0bWwgZm9yIHJlc3VsdCAhIVxyXG5cclxuICAgICAgICAgIGFwcGx5IGZpbHRlclxyXG4gICAgICAgXHJcbiAgICAgICAgLy8gdG9kbyBzZWFyY2ggbW9yZSBidXR0b24gISFcclxuICAgICAgICAvLyB0b2RvIGRva3UsIGpzIG1pbmkga2xhc3NlbmRpYWdyYW1tIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgLy8gbG9hZCBtYXRhRGF0YSAoc291cmNlcywgYW5kIHRvcGljcykgYnVnIHRvZG8gc291cmNlcyBcclxuICAgICAgICBcclxuICAgICAgICovXHJcbiAgICAgICBcclxuICAgICAgICIsIiJdfQ==
