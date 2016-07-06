(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 *@auhor jmothes
 */
"use strict";
var Ajax;
(function (Ajax) {
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
        // make xhr request, return jqXHR 
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
    //return "1980-01-01";
    return parts.join("-");
}
var FilterOptions = (function () {
    function FilterOptions() {
        this.topics = [];
        this.sources = [];
        this.fromDate = "1980-01-01";
        this.toDate = "2020-01-01";
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
        addText(a, "Similar2");
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
        var li = document.createElement('li');
        li.appendChild(root);
        parent.appendChild(li);
        //console.log("__builder__",root, topic);
        console.log("__builder__", li);
    }
    HtmlBuilder.buildArticle = buildArticle;
})(HtmlBuilder = exports.HtmlBuilder || (exports.HtmlBuilder = {}));
},{}],4:[function(require,module,exports){
/*
 *@auhor dbeckstein, jfranz
 */
"use strict";
// Import typescript - classes
var Ajax_1 = require("./Ajax");
var FilterOptions_1 = require("./FilterOptions");
var HtmlBuilder_1 = require("./HtmlBuilder");
// Create local typescript - classes
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
// JS-Logger for debugging
var JsLog = (function () {
    function JsLog() {
    }
    JsLog.prototype.log = function (s, status_name) {
        var status = ["err", "msg", "ntf"];
        var status_display = ["Error", "Message", "Notification"];
        var colors = ["FF6159", "FF9F51", "22B8EB", "", ""];
        var jl = document.getElementById("js_log");
        var col_id = status.indexOf(status_name);
        var status_display_name = status_display[col_id];
        s = s.replace("\n", "<br>");
        s = status_display_name + "\n\n" + s;
        var txt = s.replace("\n", "<br><br>");
        jl.innerHTML = txt;
        jl.style.borderColor = "#" + colors[col_id];
    };
    JsLog.prototype.get = function (id) {
        return document.getElementById(id);
    };
    return JsLog;
}());
;
// Exact order of these next commands is important 
var cs = new MyConsole();
var jl = new JsLog();
var conn = new ServerConnection();
var global_filterOptions;
// Add event listener for DOMContentLoaded event - fires when all pages content is loaded
document.addEventListener("DOMContentLoaded", function (event) {
    on_load();
});
//Create list of metadata li elements
function set_metaData(result) {
    var topic_set = [];
    var source_set = [];
    console.log("---now---", result.sources);
    topic_set = result.topics;
    source_set = result.sources;
    var topic_list = document.getElementById("select_topic_list");
    for (var i = 0; i < topic_set.length; i++) {
        var topicName = topic_set[i];
        var a = document.createElement('a');
        a.href = "#toggle_filter";
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
    for (var i = 0; i < source_set.length; i++) {
        var sourceName = source_set[i];
        var a = document.createElement('a');
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
// Loads results of metadata-request and displays them as tags
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
// GUI functions hide, display multiple elements
function element_set_display(id, val) {
    var el = document.getElementById(id);
    el.style.display = val;
}
function element_show(id) {
    element_set_display(id, "block");
}
function element_hide(id) {
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
// Multiple functions trigger on onclick
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
    console.log("--------------search----------");
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
                console.log(list);
                HtmlBuilder_1.HtmlBuilder.buildArticle(article, list);
            }
            if (result.articles.length <= 0) {
                var tmp = document.createTextNode("No results found");
                list.appendChild(tmp);
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
}
function check_url_name(event) {
    var url_hash = window.location.hash; //.pathname;
    console.log(url_hash); // does not work in ie?? !!!
    var key = "search_filter";
    if (url_hash.indexOf("#" + key) == 0) {
        f_search_filter(key);
        cs.log(key);
    }
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
                console.log(list);
                HtmlBuilder_1.HtmlBuilder.buildArticle(article, list);
            }
            if (result.articles.length <= 0) {
                var tmp = document.createTextNode("No results found");
                list.appendChild(tmp);
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
    var date_end_str = (date_end.getFullYear()) + "-" + date_end.getMonth() + "-" + date_end.getDate();
    document.getElementById("date_end").value = date_end_str;
    global_filterOptions.toDate = date_end_str;
    var date_start = new Date();
    date_start.setDate(date_start.getDate() - days_back_from_now);
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
function f_cache_toggle_old(el) {
    console.log("------cache----", el);
    var id = el.getAttribute('data-articleId');
    console.log(id);
    var pe = el.parentElement.parentElement.parentElement;
    var pid = pe.className;
    console.log(pe);
    console.log(pid);
}
function process_click_or_enter(ev) {
    console.log(ev);
    var el = this;
    var href = el.getAttribute("href");
    href = href.slice(1);
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
}
// intervall onClick processing
function add_anchor_tags_to_onClick_processing() {
    //repeat this each 0.500 second
    var col_a = document.getElementsByTagName("A");
    var list_a = [];
    for (var i = 0; i < col_a.length; i++)
        list_a.push(col_a[i]);
    for (var i = 0; i < col_a.length; i++) {
        var anch = list_a[i];
        anch.onclick = process_click_or_enter;
    }
    var d_start = document.getElementById("date_start");
    d_start.onchange = d_start_change;
    var d_end = document.getElementById("date_end");
    d_end.onchange = d_end_change;
}
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
// trigger functions on page load
function on_load() {
    ini_set_metaData();
    global_filterOptions = new FilterOptions_1.FilterOptions();
    setInterval(function () { add_anchor_tags_to_onClick_processing(); }, 500);
    f_search_keywords();
}
},{"./Ajax":1,"./FilterOptions":2,"./HtmlBuilder":3}],5:[function(require,module,exports){

},{}]},{},[4,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBOERqQjtBQTlERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBRW5CLElBQU0sT0FBTyxHQUFXLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUMxRCxJQUFNLGdCQUFnQixHQUFXLFVBQVUsR0FBRyxhQUFhLENBQUM7SUFDNUQsSUFBTSxlQUFlLEdBQVcsVUFBVSxHQUFHLHFCQUFxQixDQUFDO0lBQ25FLElBQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFFLENBQUM7SUFFekQsb0JBQTJCLEtBQWEsRUFBRSxPQUFzQixFQUFFLElBQVksRUFBRSxLQUFhO1FBQzVGLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUU5QixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FB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LENBQUM7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFDRDtJQUNJLElBQUksUUFBUSxHQUFVLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFHLENBQUMsS0FBSyxDQUFDO0lBQ2xFLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRCxpQ0FBaUM7QUFDakM7SUFFSSxnQkFBZ0IsRUFBRSxDQUFDO0lBRW5CLG9CQUFvQixHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO0lBRTNDLFdBQVcsQ0FBQyxjQUFZLHFDQUFxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFekUsaUJBQWlCLEVBQUUsQ0FBQztBQUV4QixDQUFDOztBQ25lTCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgICAgLypcclxuICAgICAqQGF1aG9yIGptb3RoZXNcclxuICAgICAqL1xyXG5cclxuXHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuXHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9tZXRhZGF0YTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0TWV0YWRhdGFcIjtcclxuXHRjb25zdCB1cmxCYXNlX3NpbWlsYXI6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NpbWlsYXJcIjtcclxuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlRdWVyeShxdWVyeTogU3RyaW5nLCBmaWx0ZXJzOiBGaWx0ZXJPcHRpb25zLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicXVlcnk9XCIgKyBxdWVyeSk7XHJcblxyXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fXCIsZmlsdGVyUGFyYW1zKTtcclxuXHRcdGlmIChmaWx0ZXJQYXJhbXMgIT09IFwiXCIpIHBhcmFtcy5wdXNoKGZpbHRlclBhcmFtcyk7XHJcblxyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEoKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2VfbWV0YWRhdGEgO1xyXG5cdFx0Ly8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSIFxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVNpbWlsYXIoYXJ0aWNsZUlkOiBTdHJpbmcsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblxyXG4gICAgICAgIGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcImlkPVwiICsgYXJ0aWNsZUlkKTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZV9zaW1pbGFyICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2dldEJ5SWRfX1wiLHVybCk7XHJcblxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcbn0iLCIgICAgLyogXHJcbiAgICAgKkBhdWhvciBqbW90aGVzXHJcbiAgICAgKi9cclxuXHJcbiAgLy8gdXRpbCBmdW5jdGlvbiBmb3IgY2xlYW4gXHJcbiAgZnVuY3Rpb24gcGFkKG4gOiBzdHJpbmcsIHdpZHRoIDogbnVtYmVyICkge1xyXG4gIC8vdmFyIHogPSB6IHx8ICcwJztcclxuICB2YXIgeiA9ICcwJztcclxuICBuID0gbiArICcnO1xyXG4gIHJldHVybiBuLmxlbmd0aCA+PSB3aWR0aCA/IG4gOiBuZXcgQXJyYXkod2lkdGggLSBuLmxlbmd0aCArIDEpLmpvaW4oeikgKyBuO1xyXG59XHJcbiAgICAgXHJcbiAvLyBfX2ZpbHRlcl9fIGZyb209MTk4MC0wMS0wMSZ0bz0yMDIwLTAxLTAxXHJcbiAvLyBfX2ZpbHRlcl9fIGZyb209MjAxNS04LTcmdG89MjAxNi02LTNcclxuIGZ1bmN0aW9uIGNsZWFuKGRhdGUgOiBzdHJpbmcpe1xyXG4gICAgdmFyIHBhcnRzID0gZGF0ZS5zcGxpdChcIi1cIik7XHJcbiAgICBwYXJ0c1swXSA9IHBhZCggcGFydHNbMF0sIDQgKTtcclxuICAgIHBhcnRzWzFdID0gcGFkKCBwYXJ0c1sxXSwgMiApO1xyXG4gICAgcGFydHNbMl0gPSBwYWQoIHBhcnRzWzJdLCAyICk7XHJcbiAgICAvL3JldHVybiBcIjE5ODAtMDEtMDFcIjtcclxuICAgIHJldHVybiBwYXJ0cy5qb2luKFwiLVwiKTtcclxuIH1cclxuICAgICBcclxuZXhwb3J0IGNsYXNzIEZpbHRlck9wdGlvbnMge1xyXG5cclxuXHR0b3BpY3M6IHN0cmluZ1tdID0gW107XHJcblx0c291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgIFxyXG4gICAgZnJvbURhdGU6IHN0cmluZyA9IFwiMTk4MC0wMS0wMVwiO1xyXG5cdHRvRGF0ZTogc3RyaW5nID0gXCIyMDIwLTAxLTAxXCI7XHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5mcm9tRGF0ZSA9IGNsZWFuKHRoaXMuZnJvbURhdGUpO1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaChcImZyb209XCIgKyB0aGlzLmZyb21EYXRlKTtcclxuICAgICAgICB9XHJcblx0XHRpZiAodGhpcy50b0RhdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50b0RhdGUgPSBjbGVhbih0aGlzLnRvRGF0ZSk7XHJcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBkYmVja3N0ZWluLCBqZnJhbnpcclxuICAgICAqL1xyXG5cclxuICAgIC8vIHV0aWwgZnVuY3Rpb25zIGh0bWxCdWlsZGVyXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbShlbE5hbWU6IHN0cmluZywgY2xzTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgdG1wID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsTmFtZSkpO1xyXG4gICAgICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVGV4dChwYXJlbnQ6IGFueSwgdHh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgICAgICAvL3JldHVybiB0bXA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBtb2R1bGUgSHRtbEJ1aWxkZXIge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkIGh0bWwgbGkgZWxlbWVudCBmcm9tIGFydGljbGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQXJ0aWNsZShhcnRpY2xlOiBhbnksIHBhcmVudDogYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdmFyIHRtcF9jbGVhcmZpeCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHJvb3QgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwicmVzdWx0XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl90b3BpY1wiKTtcclxuICAgICAgICAgICAgdmFyIHRvcGljX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dCh0b3BpY19idXR0b24sIGFydGljbGUudG9waWMpO1xyXG4gICAgICAgICAgICB0b3BpYy5hcHBlbmRDaGlsZCh0b3BpY19idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0b3BpYyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInRpdGxlXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgYXJ0aWNsZS50aXRsZSk7XHJcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGluayA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJsaW5rXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGxpbmssIGFydGljbGUudXJsLnN1YnN0cmluZygwLCA0NSkpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9kYXRlXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLCBcImRhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV95ID0gcmF3X2RhdGUuc3Vic3RyaW5nKDAsIDQpO1xyXG4gICAgICAgICAgICAvLyBoZXJlIGZpcmVmb3gganMgYnJvd3NlciBidWcgb24gc3Vic3RyKDUsNylcclxuICAgICAgICAgICAgdmFyIGRhdGVfbSA9IHJhd19kYXRlLnN1YnN0cmluZyg1LCA3KS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2QgPSByYXdfZGF0ZS5zdWJzdHJpbmcoOCwgMTApLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRfZGF0ZSA9IGRhdGVfZCArIFwiLlwiICsgZGF0ZV9tICsgXCIuXCIgKyBkYXRlX3lcclxuICAgICAgICAgICAgYWRkVGV4dChkYXRlX2RhdGUsIGZvcm1hdHRlZF9kYXRlKTtcclxuICAgICAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAgICAgLy92YXIgZGF0ZV90aW1lID0gY3JlYXRlRWxlbShcInNwYW5cIixcInRpbWVcIik7XHJcbiAgICAgICAgICAgIC8vZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV90aW1lKTtcclxuICAgICAgICAgICAgZGF0ZS5hcHBlbmRDaGlsZChkYXRlX2J1dHRvbik7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50XCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnQsIGFydGljbGUuZXh0cmFjdGVkVGV4dC5zdWJzdHJpbmcoMCwgMzAwKSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudF9jYWNoZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50X2NhY2hlXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnRfY2FjaGUsIGFydGljbGUuZXh0cmFjdGVkVGV4dCk7XHJcbiAgICAgICAgICAgIHZhciBicl90YWcgPSBjcmVhdGVFbGVtKFwiYnJcIixcIm5vdGhpbmdfc3BlY2lhbFwiKTtcclxuICAgICAgICAgICAgY29udGVudF9jYWNoZS5hcHBlbmRDaGlsZChicl90YWcpO1xyXG4gICAgICAgICAgICB2YXIgYnJfdGFnID0gY3JlYXRlRWxlbShcImJyXCIsXCJub3RoaW5nX3NwZWNpYWxcIik7XHJcbiAgICAgICAgICAgIGNvbnRlbnRfY2FjaGUuYXBwZW5kQ2hpbGQoYnJfdGFnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5zb3VyY2UpO1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnRfY2FjaGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJhdXRob3JcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYXV0aG9yLCBhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpbWcgc3JjPVwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfYnV0dG9uc1wiKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBidWcgcmVmYWMgdG9kbywgaGVyZSBhdWZrbGFwcGVuIGxhbmdlciB0ZXh0ICFcclxuICAgICAgICAgICAgdmFyIGNhY2hlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI2NhY2hlXCI7IC8vICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnLCBhcnRpY2xlLmFydGljbGVJZF9zdHIpO1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBcIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7Ly9cIlwiO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJDYWNoZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoY2FjaGVfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaW1pbGFyX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NlYXJjaF9zaW1pbGFyXCI7XHJcbiAgICAgICAgICAgIC8vYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjsgLy8xMTIzMjQzXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcsIGFydGljbGUuYXJ0aWNsZUlkX3N0cik7XHJcbiAgICAgICAgICAgIC8vYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBcIlNpbWlsYXIyXCIpO1xyXG4gICAgICAgICAgICBzaW1pbGFyX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lcl9idXR0b25zLmFwcGVuZENoaWxkKHNpbWlsYXJfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyX2J1dHRvbnMpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY2xlYXJmaXhcIikpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBfdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpOyAvLzogYW55O1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUb3BraWMga2tcIik7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XHJcbiAgICAgICAgICAgIF90bXAuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsIF90bXApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGxpID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQocm9vdCk7XHJcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLHJvb3QsIHRvcGljKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLCBsaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgICIsIiAgICAvKlxyXG4gICAgICpAYXVob3IgZGJlY2tzdGVpbiwgamZyYW56XHJcbiAgICAgKi9cclxuICAgICBcclxuICAgICBcclxuICAgIC8vIEltcG9ydCB0eXBlc2NyaXB0IC0gY2xhc3Nlc1xyXG4gICAgXHJcbiAgICBpbXBvcnQge0FqYXh9IGZyb20gXCIuL0FqYXhcIjtcclxuICAgIGltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG4gICAgaW1wb3J0IHtIdG1sQnVpbGRlcn0gZnJvbSBcIi4vSHRtbEJ1aWxkZXJcIjtcclxuXHJcbiAgICBcclxuICAgIC8vIENyZWF0ZSBsb2NhbCB0eXBlc2NyaXB0IC0gY2xhc3Nlc1xyXG4gICAgXHJcbiAgICBjbGFzcyBBcnRpY2xlUmVzdWx0IHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBhcnRpY2xlczogYW55W107XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTWV0YWRhdGFSZXN1bHQge1xyXG4gICAgICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgIHNvdXJjZXM6IHN0cmluZ1tdO1xyXG4gICAgICAgIHRvcGljczogc3RyaW5nW107XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTXlDb25zb2xlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIGxvZyhzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIiArIHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2xhc3MgU2VydmVyQ29ubmVjdGlvbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBwb3N0KHM6IHN0cmluZykge1xyXG4gICAgICAgICAgICBjcy5sb2coXCJcIiArIHMpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJwb3N0OiBcIiArIHMsIFwibnRmXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSlMtTG9nZ2VyIGZvciBkZWJ1Z2dpbmdcclxuICAgIFxyXG4gICAgY2xhc3MgSnNMb2cge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgbG9nKHM6IHN0cmluZywgc3RhdHVzX25hbWU6IHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXR1cyA9IFtcImVyclwiLCBcIm1zZ1wiLCBcIm50ZlwiXTtcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5ID0gW1wiRXJyb3JcIiwgXCJNZXNzYWdlXCIsIFwiTm90aWZpY2F0aW9uXCJdO1xyXG4gICAgICAgICAgICB2YXIgY29sb3JzID0gW1wiRkY2MTU5XCIsIFwiRkY5RjUxXCIsIFwiMjJCOEVCXCIsIFwiXCIsIFwiXCJdOyBcclxuXHJcbiAgICAgICAgICAgIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyBcclxuICAgICAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheV9uYW1lID0gc3RhdHVzX2Rpc3BsYXlbY29sX2lkXVxyXG4gICAgICAgICAgICBzID0gcy5yZXBsYWNlKFwiXFxuXCIsIFwiPGJyPlwiKTtcclxuICAgICAgICAgICAgcyA9IHN0YXR1c19kaXNwbGF5X25hbWUgKyBcIlxcblxcblwiICsgcztcclxuICAgICAgICAgICAgdmFyIHR4dCA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj48YnI+XCIpO1xyXG4gICAgICAgICAgICBqbC5pbm5lckhUTUwgPSB0eHQ7XHJcbiAgICAgICAgICAgIGpsLnN0eWxlLmJvcmRlckNvbG9yID0gXCIjXCIgKyBjb2xvcnNbY29sX2lkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEV4YWN0IG9yZGVyIG9mIHRoZXNlIG5leHQgY29tbWFuZHMgaXMgaW1wb3J0YW50IFxyXG4gICAgdmFyIGNzID0gbmV3IE15Q29uc29sZSgpO1xyXG4gICAgdmFyIGpsID0gbmV3IEpzTG9nKCk7XHJcbiAgICB2YXIgY29ubiA9IG5ldyBTZXJ2ZXJDb25uZWN0aW9uKCk7XHJcbiAgICBcclxuICAgIHZhciBnbG9iYWxfZmlsdGVyT3B0aW9uczogYW55O1xyXG5cclxuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgRE9NQ29udGVudExvYWRlZCBldmVudCAtIGZpcmVzIHdoZW4gYWxsIHBhZ2VzIGNvbnRlbnQgaXMgbG9hZGVkXHJcbiAgICBcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IFxyXG4gICAgICAgIG9uX2xvYWQoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvL0NyZWF0ZSBsaXN0IG9mIG1ldGFkYXRhIGxpIGVsZW1lbnRzXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHNldF9tZXRhRGF0YShyZXN1bHQ6IE1ldGFkYXRhUmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIHRvcGljX3NldDogYW55ID0gW107XHJcbiAgICAgICAgdmFyIHNvdXJjZV9zZXQ6IGFueSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyAoXCItLS1ub3ctLS1cIixyZXN1bHQuc291cmNlcyk7XHJcbiAgICAgICAgdG9waWNfc2V0ID0gcmVzdWx0LnRvcGljcztcclxuICAgICAgICBzb3VyY2Vfc2V0ID0gcmVzdWx0LnNvdXJjZXM7XHJcblxyXG4gICAgICAgIHZhciB0b3BpY19saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RfdG9waWNfbGlzdFwiKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3BpY19zZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRvcGljTmFtZSA9IHRvcGljX3NldFtpXTtcclxuICAgICAgICAgICAgdmFyIGEgPSAoPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gXCIjdG9nZ2xlX2ZpbHRlclwiOyBcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLW5hbWUnLCB0b3BpY05hbWUpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScsIFwidG9waWNcIik7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzb3VyY2VfbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0X3NvdXJjZV9saXN0XCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZV9zZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZU5hbWUgPSBzb3VyY2Vfc2V0W2ldO1xyXG4gICAgICAgICAgICB2YXIgYSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLW5hbWUnLCBzb3VyY2VOYW1lKTtcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXR5cGUnLCBcInNvdXJjZVwiKTtcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBhLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoPEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc291cmNlTmFtZSk7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBzb3VyY2VfbGlzdC5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICB9ICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gTG9hZHMgcmVzdWx0cyBvZiBtZXRhZGF0YS1yZXF1ZXN0IGFuZCBkaXNwbGF5cyB0aGVtIGFzIHRhZ3NcclxuXHJcbiAgICBmdW5jdGlvbiBpbmlfc2V0X21ldGFEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnRfMSA9IFwiX19fX25ld19hamF4X19fX1wiO1xyXG4gICAgICAgIEFqYXguZ2V0TWV0YWRhdGEoKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IE1ldGFkYXRhUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJOZXcgdG9waWNzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC50b3BpY3MpOy8vLmFydGljbGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIFwiTmV3IHNvdXJjZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LnNvdXJjZXMpOy8vLmFydGljbGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBzZXRfbWV0YURhdGEocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiByZXN1bHQ7IC8vYnVnIGFzeW5jaHJvbnVvcyAhIVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgICAgICAvLyBHVUkgZnVuY3Rpb25zIGhpZGUsIGRpc3BsYXkgbXVsdGlwbGUgZWxlbWVudHNcclxuICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2hvdyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfaGlkZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpKTtcclxuICAgICAgICAgICAgZS5pZCA9IFwic3Bhbl9oaWRkZW5fXCIgKyBpZDtcclxuICAgICAgICAgICAgZS5jbGFzc05hbWUgPSBcInNwYW5faGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fZGVsZXRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2VubiBrZWluIEhpZGRlbiBTcGFuIGRhLCBkYW5uIHdlcnQgaW1tZXIgZmFsc2NoISFcclxuICAgICAgICAgICAgLy9idWcgYXNzdW1lcyBqdXN0IG9uZSBjbGFzIHJhaXNlIHdhcm5pZ24gaWYgbW9yZSBjbGFzc2VzICEhICwgY2xlYXJlZCwgYnkgY2hlY2sgbGVuZ2h0ID09IDFcclxuICAgICAgICAgICAgaWYgKHNwYW5fbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwYW4gPSBzcGFuX2xpc3RbMF07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFuLmlubmVySFRNTCwgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICBib29sID0gKFwiXCIgKyB0ZXh0ID09IFwiXCIgKyBzcGFuLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBib29sKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJvb2w7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBNdWx0aXBsZSBmdW5jdGlvbnMgdHJpZ2dlciBvbiBvbmNsaWNrXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2tleXdvcmRzX29sZChlbDogYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBmbGRfc2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpO1xyXG4gICAgICAgICAgICB2YXIgZmxkID0gKDxIVE1MSW5wdXRFbGVtZW50PiBmbGRfc2VhcmNoKS52YWx1ZTtcclxuICAgICAgICAgICAgdmFyIGtleXdvcmRzID0gZmxkO1xyXG4gICAgICAgICAgICBjb25uLnBvc3Qoa2V5d29yZHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiB1dGlsX2VtcHR5X25vZGUobXlOb2RlIDogTm9kZSl7XHJcbiAgICAgICAgICAgIHdoaWxlIChteU5vZGUuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgbXlOb2RlLnJlbW92ZUNoaWxkKG15Tm9kZS5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHMoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS1zZWFyY2gtLS0tLS0tLS0tXCIpXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludCA9IFwiX19fYWpheF9fXyBcIjtcclxuICAgICAgICAgICAgdmFyIGtleXdvcmRzID0gKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpKS52YWx1ZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfa19rZXl3b3JkX19cIiArIFwiLVwiICsga2V5d29yZHMgKyBcIi1cIik7XHJcblxyXG4gICAgICAgICAgICBBamF4LmdldEJ5UXVlcnkoa2V5d29yZHMsIGdsb2JhbF9maWx0ZXJPcHRpb25zLCAwLCAxMClcclxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbF9lbXB0eV9ub2RlKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlLmF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxCdWlsZGVyLmJ1aWxkQXJ0aWNsZShhcnRpY2xlLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5hcnRpY2xlcy5sZW5ndGggPD0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIk5vIHJlc3VsdHMgZm91bmRcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZCh0bXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfZmlsdGVyKGVsOiBhbnkpIHsgXHJcbiAgICAgICAgICAgIHZhciBjaGVjayA9IHNwYW5faGlkZGVuX2NoZWNrKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgaWYgKGNoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50X2hpZGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBzcGFuX2hpZGRlbl9kZWxldGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIGNsb3NpbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudF9zaG93KFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgc3Bhbl9oaWRkZW5fY3JlYXRlKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgb3BlbmluZy5cIiwgXCJudGZcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tfdXJsX25hbWUoZXZlbnQ6IGFueSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybF9oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybF9oYXNoKTsgLy8gZG9lcyBub3Qgd29yayBpbiBpZT8/ICEhIVxyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCI7XHJcbiAgICAgICAgICAgIGlmICh1cmxfaGFzaC5pbmRleE9mKFwiI1wiICsga2V5KSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoa2V5KTtcclxuICAgICAgICAgICAgICAgIGNzLmxvZyhrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX3NpbWlsYXIoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLXNpbWlsYXItLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgYXJ0aWNsZUlkICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZUlkKTtcclxuICBcclxuICAgICAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnQgPSBcIl9fX3NpbWlsYXJfX19cIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIEFqYXguZ2V0QnlTaW1pbGFyKGFydGljbGVJZCwgMCwgMTApXHJcbiAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IEFydGljbGVSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIkFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSA8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxfZW1wdHlfbm9kZShsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIGFydGljbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIdG1sQnVpbGRlci5idWlsZEFydGljbGUoYXJ0aWNsZSwgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5hcnRpY2xlcy5sZW5ndGggPD0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIk5vIHJlc3VsdHMgZm91bmRcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZCh0bXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl9kYXRlX3NldF9yYW5nZShlbCA6IGFueSl7XHJcbiAgICAgICAgICAgdmFyIGRheXNfYmFja19mcm9tX25vdyA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kYXRlLXJhbmdlLWRheXMnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF5c19iYWNrX2Zyb21fbm93KTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfZW5kID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlX2VuZF9zdHIgPSAoZGF0ZV9lbmQuZ2V0RnVsbFllYXIoKSApICsgXCItXCIgKyBkYXRlX2VuZC5nZXRNb250aCgpICsgXCItXCIgKyBkYXRlX2VuZC5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpICkudmFsdWUgPSBkYXRlX2VuZF9zdHI7XHJcbiAgICAgICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IGRhdGVfZW5kX3N0cjtcclxuICAgICAgICAgICAgdmFyIGRhdGVfc3RhcnQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBkYXRlX3N0YXJ0LnNldERhdGUoZGF0ZV9zdGFydC5nZXREYXRlKCkgLSBkYXlzX2JhY2tfZnJvbV9ub3cpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGVfc3RhcnRfc3RyID0gKGRhdGVfc3RhcnQuZ2V0RnVsbFllYXIoKSApICsgXCItXCIgKyBkYXRlX3N0YXJ0LmdldE1vbnRoKCkgKyBcIi1cIiArIGRhdGVfc3RhcnQuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpICkudmFsdWUgPSBkYXRlX3N0YXJ0X3N0cjtcclxuICAgICAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBkYXRlX3N0YXJ0X3N0cjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY3NzX2hpZGUoZWw6YW55KXtcclxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBjc3Nfc2hvdyhlbDphbnkpe1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl90b2dnbGVfZmlsdGVyKGVsOmFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tZmlsdGVyLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIHR5cGUgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJyk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScpO1xyXG4gICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkX3ByZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdmFyIGZpbHRlciA6IGFueTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidG9waWNcIil7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIgPSBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3M7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyID0gZ2xvYmFsX2ZpbHRlck9wdGlvbnMuc291cmNlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNTZWxlY3RlZD09PVwidHJ1ZVwiKXtcclxuICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmlsdGVyLmluZGV4T2YobmFtZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICggaW5kZXghPT0oLTEpICl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyLnNwbGljZShpbmRleCwgMSk7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJywgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cobmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHR5cGUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9faXNfX19fX19fX1wiLCBpc1NlbGVjdGVkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9faXNfX3ByZV9fX1wiLCBpc1NlbGVjdGVkX3ByZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX2lzX19fX19fX19cIiwgZmlsdGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl9jYWNoZV90b2dnbGUoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLWNhY2hlLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIGlkICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgICAgICB2YXIgcGUgOiBhbnkgPSBlbC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgdmFyIHBpZCA6IGFueSA9IHBlLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaWQpO1xyXG4gICAgICAgICAgICB2YXIgZV9jb24gOiBhbnkgPSBwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGVudFwiKVswXTtcclxuICAgICAgICAgICAgdmFyIGVfY29uX2NhY2hlIDogYW55ID0gcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRlbnRfY2FjaGVcIilbMF07XHJcbiAgICAgICAgICAgIGlmIChlX2Nvbl9jYWNoZS5zdHlsZS5kaXNwbGF5ICE9IFwiYmxvY2tcIil7XHJcbiAgICAgICAgICAgICAgICBjc3Nfc2hvdyhlX2Nvbl9jYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBjc3NfaGlkZShlX2Nvbik7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY3NzX2hpZGUoZV9jb25fY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgY3NzX3Nob3coZV9jb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVfY29uKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfY2FjaGVfdG9nZ2xlX29sZChlbCA6IGFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tY2FjaGUtLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgaWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgICAgIHZhciBwZSA6IGFueSA9IGVsLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICB2YXIgcGlkIDogYW55ID0gcGUuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NfY2xpY2tfb3JfZW50ZXIoZXY6IGFueSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldik7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBocmVmID0gKDxhbnk+ZWwpLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XHJcbiAgICAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbmZvIGhyZWYgc3dpdGhjLS1cIiArIGhyZWYgKyBcIi0tXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJvb2xcIiwgaHJlZiA9PSBcInNlYWNoX2ZpbHRlclwiLCBocmVmLCBcInNlYWNoX2ZpbHRlclwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHN3aXRjaCAoaHJlZikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9maWx0ZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9rZXl3b3Jkc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX2tleXdvcmRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX3NpbWlsYXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9zaW1pbGFyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0b2dnbGVfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl90b2dnbGVfZmlsdGVyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlX3NldF9yYW5nZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfZGF0ZV9zZXRfcmFuZ2UoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImNhY2hlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9jYWNoZV90b2dnbGUoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIC8vIGludGVydmFsbCBvbkNsaWNrIHByb2Nlc3NpbmdcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gYWRkX2FuY2hvcl90YWdzX3RvX29uQ2xpY2tfcHJvY2Vzc2luZygpe1xyXG4gICAgICAgIC8vcmVwZWF0IHRoaXMgZWFjaCAwLjUwMCBzZWNvbmRcclxuICAgICAgICB2YXIgY29sX2EgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJBXCIpKTtcclxuICAgICAgICB2YXIgbGlzdF9hOiBhbnkgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSBsaXN0X2EucHVzaChjb2xfYVtpXSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgeyBcclxuICAgICAgICAgICAgdmFyIGFuY2ggPSBsaXN0X2FbaV07IFxyXG4gICAgICAgICAgICBhbmNoLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZF9zdGFydCA6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgICBkX3N0YXJ0Lm9uY2hhbmdlID0gZF9zdGFydF9jaGFuZ2U7XHJcbiAgICAgICAgdmFyIGRfZW5kIDogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKTtcclxuICAgICAgICBkX2VuZC5vbmNoYW5nZSA9IGRfZW5kX2NoYW5nZTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gZF9zdGFydF9jaGFuZ2UoKXtcclxuICAgICAgICB2YXIgZGF0ZV9zdGFydCA9ICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIikgKS52YWx1ZTtcclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IGRhdGVfc3RhcnQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGljayBkYXRlIHN0YXJ0XCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZF9lbmRfY2hhbmdlKCl7XHJcbiAgICAgICAgdmFyIGRhdGVfZW5kID0gKCA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9lbmRcIikgKS52YWx1ZTtcclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b0RhdGUgPSBkYXRlX2VuZDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrIGRhdGUgZW5kXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyB0cmlnZ2VyIGZ1bmN0aW9ucyBvbiBwYWdlIGxvYWRcclxuICAgIGZ1bmN0aW9uIG9uX2xvYWQoKSB7XHJcbiAgICBcclxuICAgICAgICBpbmlfc2V0X21ldGFEYXRhKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMgPSBuZXcgRmlsdGVyT3B0aW9ucygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7IGFkZF9hbmNob3JfdGFnc190b19vbkNsaWNrX3Byb2Nlc3NpbmcoKTsgfSwgNTAwKTtcclxuICAgICAgICBcclxuICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcygpO1xyXG4gICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgICAiLCIiXX0=
