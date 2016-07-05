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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBOERqQjtBQTlERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBRW5CLElBQU0sT0FBTyxHQUFXLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUMxRCxJQUFNLGdCQUFnQixHQUFXLFVBQVUsR0FBRyxhQUFhLENBQUM7SUFDNUQsSUFBTSxlQUFlLEdBQVcsVUFBVSxHQUFHLHFCQUFxQixDQUFDO0lBQ25FLElBQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFFLENBQUM7SUFFekQsb0JBQTJCLEtBQWEsRUFBRSxPQUFzQixFQUFFLElBQVksRUFBRSxLQUFhO1FBQzVGLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUU5QixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FB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LENBQUM7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFDRDtJQUNJLElBQUksUUFBUSxHQUFVLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFHLENBQUMsS0FBSyxDQUFDO0lBQ2xFLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRCxpQ0FBaUM7QUFDakM7SUFFSSxnQkFBZ0IsRUFBRSxDQUFDO0lBRW5CLG9CQUFvQixHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO0lBRTNDLFdBQVcsQ0FBQyxjQUFZLHFDQUFxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFekUsaUJBQWlCLEVBQUUsQ0FBQztBQUV4QixDQUFDOztBQ25lTCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgICAgLypcclxuICAgICAqQGF1aG9yIGptb3RoZXNcclxuICAgICAqL1xyXG5cclxuXHJcbmltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG5cclxuZGVjbGFyZSB2YXIgY29udGV4dFVybDogc3RyaW5nO1xyXG5cclxuZXhwb3J0IG1vZHVsZSBBamF4IHtcclxuXHJcblx0Y29uc3QgdXJsQmFzZTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0QXJ0aWNsZXMvc2VhcmNoXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9tZXRhZGF0YTogc3RyaW5nID0gY29udGV4dFVybCArIFwiZ2V0TWV0YWRhdGFcIjtcclxuXHRjb25zdCB1cmxCYXNlX3NpbWlsYXI6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NpbWlsYXJcIjtcclxuXHRjb25zdCBoZWFkZXJzID0geyBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvbiwqLyo7cT0wLjhcIiB9O1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlRdWVyeShxdWVyeTogU3RyaW5nLCBmaWx0ZXJzOiBGaWx0ZXJPcHRpb25zLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicXVlcnk9XCIgKyBxdWVyeSk7XHJcblxyXG5cdFx0bGV0IGZpbHRlclBhcmFtczogc3RyaW5nID0gZmlsdGVycy50b1VybFBhcmFtKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9fXCIsZmlsdGVyUGFyYW1zKTtcclxuXHRcdGlmIChmaWx0ZXJQYXJhbXMgIT09IFwiXCIpIHBhcmFtcy5wdXNoKGZpbHRlclBhcmFtcyk7XHJcblxyXG5cdFx0cGFyYW1zLnB1c2goXCJyYW5nZT1cIiArIHNraXAgKyBcIi1cIiArIGxpbWl0KTtcclxuXHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0XHRcclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YWRhdGEoKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2VfbWV0YWRhdGEgO1xyXG5cdFx0Ly8gbWFrZSB4aHIgcmVxdWVzdCwgcmV0dXJuIGpxWEhSIFxyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRCeVNpbWlsYXIoYXJ0aWNsZUlkOiBTdHJpbmcsIHNraXA6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IEpRdWVyeVhIUiB7XHJcblxyXG4gICAgICAgIGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcImlkPVwiICsgYXJ0aWNsZUlkKTtcclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZV9zaW1pbGFyICsgXCI/XCIgKyBwYXJhbXMuam9pbihcIiZcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJfX2dldEJ5SWRfX1wiLHVybCk7XHJcblxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcbn0iLCIgICAgLyogXHJcbiAgICAgKkBhdWhvciBqbW90aGVzXHJcbiAgICAgKi9cclxuXHJcbiAgLy8gdXRpbCBmdW5jdGlvbiBmb3IgY2xlYW4gXHJcbiAgZnVuY3Rpb24gcGFkKG4gOiBzdHJpbmcsIHdpZHRoIDogbnVtYmVyICkge1xyXG4gIC8vdmFyIHogPSB6IHx8ICcwJztcclxuICB2YXIgeiA9ICcwJztcclxuICBuID0gbiArICcnO1xyXG4gIHJldHVybiBuLmxlbmd0aCA+PSB3aWR0aCA/IG4gOiBuZXcgQXJyYXkod2lkdGggLSBuLmxlbmd0aCArIDEpLmpvaW4oeikgKyBuO1xyXG59XHJcbiAgICAgXHJcbiAvLyBfX2ZpbHRlcl9fIGZyb209MTk4MC0wMS0wMSZ0bz0yMDIwLTAxLTAxXHJcbiAvLyBfX2ZpbHRlcl9fIGZyb209MjAxNS04LTcmdG89MjAxNi02LTNcclxuIGZ1bmN0aW9uIGNsZWFuKGRhdGUgOiBzdHJpbmcpe1xyXG4gICAgdmFyIHBhcnRzID0gZGF0ZS5zcGxpdChcIi1cIik7XHJcbiAgICBwYXJ0c1swXSA9IHBhZCggcGFydHNbMF0sIDQgKTtcclxuICAgIHBhcnRzWzFdID0gcGFkKCBwYXJ0c1sxXSwgMiApO1xyXG4gICAgcGFydHNbMl0gPSBwYWQoIHBhcnRzWzJdLCAyICk7XHJcbiAgICAvL3JldHVybiBcIjE5ODAtMDEtMDFcIjtcclxuICAgIHJldHVybiBwYXJ0cy5qb2luKFwiLVwiKTtcclxuIH1cclxuICAgICBcclxuZXhwb3J0IGNsYXNzIEZpbHRlck9wdGlvbnMge1xyXG5cclxuXHR0b3BpY3M6IHN0cmluZ1tdID0gW107XHJcblx0c291cmNlczogc3RyaW5nW10gPSBbXTtcclxuICAgIFxyXG4gICAgZnJvbURhdGU6IHN0cmluZyA9IFwiMTk4MC0wMS0wMVwiO1xyXG5cdHRvRGF0ZTogc3RyaW5nID0gXCIyMDIwLTAxLTAxXCI7XHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5mcm9tRGF0ZSA9IGNsZWFuKHRoaXMuZnJvbURhdGUpO1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaChcImZyb209XCIgKyB0aGlzLmZyb21EYXRlKTtcclxuICAgICAgICB9XHJcblx0XHRpZiAodGhpcy50b0RhdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50b0RhdGUgPSBjbGVhbih0aGlzLnRvRGF0ZSk7XHJcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBkYmVja3N0ZWluLCBqZnJhbnpcclxuICAgICAqL1xyXG5cclxuICAgIC8vIHV0aWwgZnVuY3Rpb25zIGh0bWxCdWlsZGVyXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbShlbE5hbWU6IHN0cmluZywgY2xzTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgdG1wID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsTmFtZSkpO1xyXG4gICAgICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVGV4dChwYXJlbnQ6IGFueSwgdHh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgICAgICAvL3JldHVybiB0bXA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBtb2R1bGUgSHRtbEJ1aWxkZXIge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkIGh0bWwgbGkgZWxlbWVudCBmcm9tIGFydGljbGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQXJ0aWNsZShhcnRpY2xlOiBhbnksIHBhcmVudDogYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdmFyIHRtcF9jbGVhcmZpeCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHJvb3QgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwicmVzdWx0XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl90b3BpY1wiKTtcclxuICAgICAgICAgICAgdmFyIHRvcGljX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dCh0b3BpY19idXR0b24sIGFydGljbGUudG9waWMpO1xyXG4gICAgICAgICAgICB0b3BpYy5hcHBlbmRDaGlsZCh0b3BpY19idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0b3BpYyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInRpdGxlXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgYXJ0aWNsZS50aXRsZSk7XHJcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGluayA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJsaW5rXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGxpbmssIGFydGljbGUudXJsLnN1YnN0cmluZygwLCA0NSkpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9kYXRlXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLCBcImRhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV95ID0gcmF3X2RhdGUuc3Vic3RyaW5nKDAsIDQpO1xyXG4gICAgICAgICAgICAvLyBoZXJlIGZpcmVmb3gganMgYnJvd3NlciBidWcgb24gc3Vic3RyKDUsNylcclxuICAgICAgICAgICAgdmFyIGRhdGVfbSA9IHJhd19kYXRlLnN1YnN0cmluZyg1LCA3KS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2QgPSByYXdfZGF0ZS5zdWJzdHJpbmcoOCwgMTApLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRfZGF0ZSA9IGRhdGVfZCArIFwiLlwiICsgZGF0ZV9tICsgXCIuXCIgKyBkYXRlX3lcclxuICAgICAgICAgICAgYWRkVGV4dChkYXRlX2RhdGUsIGZvcm1hdHRlZF9kYXRlKTtcclxuICAgICAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAgICAgLy92YXIgZGF0ZV90aW1lID0gY3JlYXRlRWxlbShcInNwYW5cIixcInRpbWVcIik7XHJcbiAgICAgICAgICAgIC8vZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV90aW1lKTtcclxuICAgICAgICAgICAgZGF0ZS5hcHBlbmRDaGlsZChkYXRlX2J1dHRvbik7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50XCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnQsIGFydGljbGUuZXh0cmFjdGVkVGV4dC5zdWJzdHJpbmcoMCwgMzAwKSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudF9jYWNoZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50X2NhY2hlXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnRfY2FjaGUsIGFydGljbGUuZXh0cmFjdGVkVGV4dCk7XHJcbiAgICAgICAgICAgIHZhciBicl90YWcgPSBjcmVhdGVFbGVtKFwiYnJcIixcIm5vdGhpbmdfc3BlY2lhbFwiKTtcclxuICAgICAgICAgICAgY29udGVudF9jYWNoZS5hcHBlbmRDaGlsZChicl90YWcpO1xyXG4gICAgICAgICAgICB2YXIgYnJfdGFnID0gY3JlYXRlRWxlbShcImJyXCIsXCJub3RoaW5nX3NwZWNpYWxcIik7XHJcbiAgICAgICAgICAgIGNvbnRlbnRfY2FjaGUuYXBwZW5kQ2hpbGQoYnJfdGFnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5zb3VyY2UpO1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnRfY2FjaGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJhdXRob3JcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYXV0aG9yLCBhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpbWcgc3JjPVwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfYnV0dG9uc1wiKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBidWcgcmVmYWMgdG9kbywgaGVyZSBhdWZrbGFwcGVuIGxhbmdlciB0ZXh0ICFcclxuICAgICAgICAgICAgdmFyIGNhY2hlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI2NhY2hlXCI7IC8vICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnLCBhcnRpY2xlLmFydGljbGVJZF9zdHIpO1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBcIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7Ly9cIlwiO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJDYWNoZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoY2FjaGVfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaW1pbGFyX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NlYXJjaF9zaW1pbGFyXCI7XHJcbiAgICAgICAgICAgIC8vYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjsgLy8xMTIzMjQzXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcsIGFydGljbGUuYXJ0aWNsZUlkX3N0cik7XHJcbiAgICAgICAgICAgIC8vYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBcIlNpbWlsYXJcIik7XHJcbiAgICAgICAgICAgIHNpbWlsYXJfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoc2ltaWxhcl9idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250YWluZXJfYnV0dG9ucyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIF90bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSk7IC8vOiBhbnk7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRvcGtpYyBra1wiKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgX3RtcC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgX3RtcCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbGkgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChyb290KTtcclxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIscm9vdCwgdG9waWMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fYnVpbGRlcl9fXCIsIGxpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBkYmVja3N0ZWluLCBqZnJhbnpcclxuICAgICAqL1xyXG4gICAgIFxyXG4gICAgIFxyXG4gICAgLy8gSW1wb3J0IHR5cGVzY3JpcHQgLSBjbGFzc2VzXHJcbiAgICBcclxuICAgIGltcG9ydCB7QWpheH0gZnJvbSBcIi4vQWpheFwiO1xyXG4gICAgaW1wb3J0IHtGaWx0ZXJPcHRpb25zfSBmcm9tIFwiLi9GaWx0ZXJPcHRpb25zXCI7XHJcbiAgICBpbXBvcnQge0h0bWxCdWlsZGVyfSBmcm9tIFwiLi9IdG1sQnVpbGRlclwiO1xyXG5cclxuICAgIFxyXG4gICAgLy8gQ3JlYXRlIGxvY2FsIHR5cGVzY3JpcHQgLSBjbGFzc2VzXHJcbiAgICBcclxuICAgIGNsYXNzIEFydGljbGVSZXN1bHQge1xyXG4gICAgICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgIGFydGljbGVzOiBhbnlbXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNZXRhZGF0YVJlc3VsdCB7XHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgc291cmNlczogc3RyaW5nW107XHJcbiAgICAgICAgdG9waWNzOiBzdHJpbmdbXTtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBNeUNvbnNvbGUge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgbG9nKHM6IHN0cmluZykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiICsgcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjbGFzcyBTZXJ2ZXJDb25uZWN0aW9uIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIHBvc3Qoczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGNzLmxvZyhcIlwiICsgcyk7XHJcbiAgICAgICAgICAgIGpsLmxvZyhcInBvc3Q6IFwiICsgcywgXCJudGZcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBKUy1Mb2dnZXIgZm9yIGRlYnVnZ2luZ1xyXG4gICAgXHJcbiAgICBjbGFzcyBKc0xvZyB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBsb2coczogc3RyaW5nLCBzdGF0dXNfbmFtZTogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RhdHVzID0gW1wiZXJyXCIsIFwibXNnXCIsIFwibnRmXCJdO1xyXG4gICAgICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXkgPSBbXCJFcnJvclwiLCBcIk1lc3NhZ2VcIiwgXCJOb3RpZmljYXRpb25cIl07XHJcbiAgICAgICAgICAgIHZhciBjb2xvcnMgPSBbXCJGRjYxNTlcIiwgXCJGRjlGNTFcIiwgXCIyMkI4RUJcIiwgXCJcIiwgXCJcIl07IFxyXG5cclxuICAgICAgICAgICAgdmFyIGpsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc19sb2dcIik7IFxyXG4gICAgICAgICAgICB2YXIgY29sX2lkID0gc3RhdHVzLmluZGV4T2Yoc3RhdHVzX25hbWUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5X25hbWUgPSBzdGF0dXNfZGlzcGxheVtjb2xfaWRdXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIiwgXCI8YnI+XCIpO1xyXG4gICAgICAgICAgICBzID0gc3RhdHVzX2Rpc3BsYXlfbmFtZSArIFwiXFxuXFxuXCIgKyBzO1xyXG4gICAgICAgICAgICB2YXIgdHh0ID0gcy5yZXBsYWNlKFwiXFxuXCIsIFwiPGJyPjxicj5cIik7XHJcbiAgICAgICAgICAgIGpsLmlubmVySFRNTCA9IHR4dDtcclxuICAgICAgICAgICAgamwuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIiNcIiArIGNvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gRXhhY3Qgb3JkZXIgb2YgdGhlc2UgbmV4dCBjb21tYW5kcyBpcyBpbXBvcnRhbnQgXHJcbiAgICB2YXIgY3MgPSBuZXcgTXlDb25zb2xlKCk7XHJcbiAgICB2YXIgamwgPSBuZXcgSnNMb2coKTtcclxuICAgIHZhciBjb25uID0gbmV3IFNlcnZlckNvbm5lY3Rpb24oKTtcclxuICAgIFxyXG4gICAgdmFyIGdsb2JhbF9maWx0ZXJPcHRpb25zOiBhbnk7XHJcblxyXG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIGZvciBET01Db250ZW50TG9hZGVkIGV2ZW50IC0gZmlyZXMgd2hlbiBhbGwgcGFnZXMgY29udGVudCBpcyBsb2FkZWRcclxuICAgIFxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHsgXHJcbiAgICAgICAgb25fbG9hZCgpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vQ3JlYXRlIGxpc3Qgb2YgbWV0YWRhdGEgbGkgZWxlbWVudHNcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gc2V0X21ldGFEYXRhKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICB2YXIgdG9waWNfc2V0OiBhbnkgPSBbXTtcclxuICAgICAgICB2YXIgc291cmNlX3NldDogYW55ID0gW107XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nIChcIi0tLW5vdy0tLVwiLHJlc3VsdC5zb3VyY2VzKTtcclxuICAgICAgICB0b3BpY19zZXQgPSByZXN1bHQudG9waWNzO1xyXG4gICAgICAgIHNvdXJjZV9zZXQgPSByZXN1bHQuc291cmNlcztcclxuXHJcbiAgICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcGljX3NldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdG9waWNOYW1lID0gdG9waWNfc2V0W2ldO1xyXG4gICAgICAgICAgICB2YXIgYSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiN0b2dnbGVfZmlsdGVyXCI7IFxyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScsIHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJywgXCJ0b3BpY1wiKTtcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBhLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoPEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9waWNOYW1lKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIHRvcGljX2xpc3QuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgfSAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNvdXJjZV9saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3Rfc291cmNlX2xpc3RcIik7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlX3NldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgc291cmNlTmFtZSA9IHNvdXJjZV9zZXRbaV07XHJcbiAgICAgICAgICAgIHZhciBhID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScsIHNvdXJjZU5hbWUpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScsIFwic291cmNlXCIpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGEub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzb3VyY2VOYW1lKTtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcclxuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgICAgIHNvdXJjZV9saXN0LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBMb2FkcyByZXN1bHRzIG9mIG1ldGFkYXRhLXJlcXVlc3QgYW5kIGRpc3BsYXlzIHRoZW0gYXMgdGFnc1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaV9zZXRfbWV0YURhdGEoKTogYW55IHtcclxuICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICAgICAgQWpheC5nZXRNZXRhZGF0YSgpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyB0b3BpY3MgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LnRvcGljcyk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJOZXcgc291cmNlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQuc291cmNlcyk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHNldF9tZXRhRGF0YShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHJlc3VsdDsgLy9idWcgYXN5bmNocm9udW9zICEhXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgICAgIC8vIEdVSSBmdW5jdGlvbnMgaGlkZSwgZGlzcGxheSBtdWx0aXBsZSBlbGVtZW50c1xyXG4gICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZWxlbWVudF9zZXRfZGlzcGxheShpZDogc3RyaW5nLCB2YWw6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAoPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcclxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZWxlbWVudF9zaG93KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJibG9ja1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gZWxlbWVudF9oaWRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgZWxlbWVudF9zZXRfZGlzcGxheShpZCwgXCJub25lXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY3JlYXRlKGlkOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSAoPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIikpO1xyXG4gICAgICAgICAgICBlLmlkID0gXCJzcGFuX2hpZGRlbl9cIiArIGlkO1xyXG4gICAgICAgICAgICBlLmNsYXNzTmFtZSA9IFwic3Bhbl9oaWRkZW5cIjtcclxuICAgICAgICAgICAgZS5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgICAgICAgICBlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9kZWxldGUoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudHNfdG9fcmVtb3ZlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnRzX3RvX3JlbW92ZVswXSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHNfdG9fcmVtb3ZlWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NoZWNrKGlkOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIHZhciBib29sID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBzcGFuX2xpc3QgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICAgICAvLyBXZW5uIGtlaW4gSGlkZGVuIFNwYW4gZGEsIGRhbm4gd2VydCBpbW1lciBmYWxzY2ghIVxyXG4gICAgICAgICAgICAvL2J1ZyBhc3N1bWVzIGp1c3Qgb25lIGNsYXMgcmFpc2Ugd2FybmlnbiBpZiBtb3JlIGNsYXNzZXMgISEgLCBjbGVhcmVkLCBieSBjaGVjayBsZW5naHQgPT0gMVxyXG4gICAgICAgICAgICBpZiAoc3Bhbl9saXN0Lmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3BhbiA9IHNwYW5fbGlzdFswXTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwYW4uaW5uZXJIVE1MLCB0ZXh0KTtcclxuICAgICAgICAgICAgICAgIGJvb2wgPSAoXCJcIiArIHRleHQgPT0gXCJcIiArIHNwYW4uaW5uZXJIVE1MKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjcy5sb2coXCJcIiArIGJvb2wpO1xyXG4gICAgICAgICAgICByZXR1cm4gYm9vbDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE11bHRpcGxlIGZ1bmN0aW9ucyB0cmlnZ2VyIG9uIG9uY2xpY2tcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHNfb2xkKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGZsZF9zZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIik7XHJcbiAgICAgICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgICAgIGNvbm4ucG9zdChrZXl3b3Jkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHV0aWxfZW1wdHlfbm9kZShteU5vZGUgOiBOb2RlKXtcclxuICAgICAgICAgICAgd2hpbGUgKG15Tm9kZS5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBteU5vZGUucmVtb3ZlQ2hpbGQobXlOb2RlLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcygpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLXNlYXJjaC0tLS0tLS0tLS1cIilcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSAoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIikpLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9rX2tleXdvcmRfX1wiICsgXCItXCIgKyBrZXl3b3JkcyArIFwiLVwiKTtcclxuXHJcbiAgICAgICAgICAgIEFqYXguZ2V0QnlRdWVyeShrZXl3b3JkcywgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsX2VtcHR5X25vZGUobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFydGljbGUgb2YgcmVzdWx0LmFydGljbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuYXV0aG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmFydGljbGVzLmxlbmd0aCA8PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTm8gcmVzdWx0cyBmb3VuZFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHRtcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9maWx0ZXIoZWw6IGFueSkgeyBcclxuICAgICAgICAgICAgdmFyIGNoZWNrID0gc3Bhbl9oaWRkZW5fY2hlY2soXCJmaWx0ZXJfc2V0dGluZ3NcIiwgXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICAgICBpZiAoY2hlY2spIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRfaGlkZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIHNwYW5faGlkZGVuX2RlbGV0ZShcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgY2xvc2luZy5cIiwgXCJudGZcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50X3Nob3coXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBzcGFuX2hpZGRlbl9jcmVhdGUoXCJmaWx0ZXJfc2V0dGluZ3NcIiwgXCJzdGF0ZV9zaG93XCIpO1xyXG4gICAgICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBvcGVuaW5nLlwiLCBcIm50ZlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBjaGVja191cmxfbmFtZShldmVudDogYW55KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsX2hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDsvLy5wYXRobmFtZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codXJsX2hhc2gpOyAvLyBkb2VzIG5vdCB3b3JrIGluIGllPz8gISEhXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgICAgaWYgKHVybF9oYXNoLmluZGV4T2YoXCIjXCIgKyBrZXkpID09IDApIHtcclxuICAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihrZXkpO1xyXG4gICAgICAgICAgICAgICAgY3MubG9nKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfc2ltaWxhcihlbCA6IGFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tc2ltaWxhci0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciBhcnRpY2xlSWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlSWQpO1xyXG4gIFxyXG4gICAgICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludCA9IFwiX19fc2ltaWxhcl9fX1wiO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgQWpheC5nZXRCeVNpbWlsYXIoYXJ0aWNsZUlkLCAwLCAxMClcclxuICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbF9lbXB0eV9ub2RlKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlLmF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxCdWlsZGVyLmJ1aWxkQXJ0aWNsZShhcnRpY2xlLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmFydGljbGVzLmxlbmd0aCA8PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiTm8gcmVzdWx0cyBmb3VuZFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKHRtcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2RhdGVfc2V0X3JhbmdlKGVsIDogYW55KXtcclxuICAgICAgICAgICB2YXIgZGF5c19iYWNrX2Zyb21fbm93ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUtcmFuZ2UtZGF5cycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXlzX2JhY2tfZnJvbV9ub3cpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmQgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGVfZW5kX3N0ciA9IChkYXRlX2VuZC5nZXRGdWxsWWVhcigpICkgKyBcIi1cIiArIGRhdGVfZW5kLmdldE1vbnRoKCkgKyBcIi1cIiArIGRhdGVfZW5kLmdldERhdGUoKTtcclxuICAgICAgICAgICAgKCA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9lbmRcIikgKS52YWx1ZSA9IGRhdGVfZW5kX3N0cjtcclxuICAgICAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9EYXRlID0gZGF0ZV9lbmRfc3RyO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9zdGFydCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGRhdGVfc3RhcnQuc2V0RGF0ZShkYXRlX3N0YXJ0LmdldERhdGUoKSAtIGRheXNfYmFja19mcm9tX25vdyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0ZV9zdGFydF9zdHIgPSAoZGF0ZV9zdGFydC5nZXRGdWxsWWVhcigpICkgKyBcIi1cIiArIGRhdGVfc3RhcnQuZ2V0TW9udGgoKSArIFwiLVwiICsgZGF0ZV9zdGFydC5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIikgKS52YWx1ZSA9IGRhdGVfc3RhcnRfc3RyO1xyXG4gICAgICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IGRhdGVfc3RhcnRfc3RyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBjc3NfaGlkZShlbDphbnkpe1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNzc19zaG93KGVsOmFueSl7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX3RvZ2dsZV9maWx0ZXIoZWw6YW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1maWx0ZXItLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgdHlwZSAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXR5cGUnKTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1uYW1lJyk7XHJcbiAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWRfcHJlID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyIDogYW55O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ0b3BpY1wiKXtcclxuICAgICAgICAgICAgICAgIGZpbHRlciA9IGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvcGljcztcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIgPSBnbG9iYWxfZmlsdGVyT3B0aW9ucy5zb3VyY2VzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc1NlbGVjdGVkPT09XCJ0cnVlXCIpe1xyXG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaWx0ZXIuaW5kZXhPZihuYW1lKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCBpbmRleCE9PSgtMSkgKXtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuc3BsaWNlKGluZGV4LCAxKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnLCBcInRydWVcIik7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIucHVzaChuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuYW1lKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codHlwZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19pc19fX19fX19fXCIsIGlzU2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19pc19fcHJlX19fXCIsIGlzU2VsZWN0ZWRfcHJlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2ZpbHRlcl9faXNfX19fX19fX1wiLCBmaWx0ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2NhY2hlX3RvZ2dsZShlbCA6IGFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tY2FjaGUtLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgaWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgICAgIHZhciBwZSA6IGFueSA9IGVsLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICB2YXIgcGlkIDogYW55ID0gcGUuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpZCk7XHJcbiAgICAgICAgICAgIHZhciBlX2NvbiA6IGFueSA9IHBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250ZW50XCIpWzBdO1xyXG4gICAgICAgICAgICB2YXIgZV9jb25fY2FjaGUgOiBhbnkgPSBwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGVudF9jYWNoZVwiKVswXTtcclxuICAgICAgICAgICAgaWYgKGVfY29uX2NhY2hlLnN0eWxlLmRpc3BsYXkgIT0gXCJibG9ja1wiKXtcclxuICAgICAgICAgICAgICAgIGNzc19zaG93KGVfY29uX2NhY2hlKTtcclxuICAgICAgICAgICAgICAgIGNzc19oaWRlKGVfY29uKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjc3NfaGlkZShlX2Nvbl9jYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBjc3Nfc2hvdyhlX2Nvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coZV9jb24pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl9jYWNoZV90b2dnbGVfb2xkKGVsIDogYW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1jYWNoZS0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciBpZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICAgICAgdmFyIHBlIDogYW55ID0gZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHZhciBwaWQgOiBhbnkgPSBwZS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc19jbGlja19vcl9lbnRlcihldjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcclxuICAgICAgICAgICAgdmFyIGVsID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAoPGFueT5lbCkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcclxuICAgICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluZm8gaHJlZiBzd2l0aGMtLVwiICsgaHJlZiArIFwiLS1cIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYm9vbFwiLCBocmVmID09IFwic2VhY2hfZmlsdGVyXCIsIGhyZWYsIFwic2VhY2hfZmlsdGVyXCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc3dpdGNoIChocmVmKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2tleXdvcmRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfa2V5d29yZHMoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfc2ltaWxhclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX3NpbWlsYXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInRvZ2dsZV9maWx0ZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3RvZ2dsZV9maWx0ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVfc2V0X3JhbmdlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9kYXRlX3NldF9yYW5nZShlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2FjaGVcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX2NhY2hlX3RvZ2dsZShlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgLy8gaW50ZXJ2YWxsIG9uQ2xpY2sgcHJvY2Vzc2luZ1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBhZGRfYW5jaG9yX3RhZ3NfdG9fb25DbGlja19wcm9jZXNzaW5nKCl7XHJcbiAgICAgICAgLy9yZXBlYXQgdGhpcyBlYWNoIDAuNTAwIHNlY29uZFxyXG4gICAgICAgIHZhciBjb2xfYSA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkFcIikpO1xyXG4gICAgICAgIHZhciBsaXN0X2E6IGFueSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIGxpc3RfYS5wdXNoKGNvbF9hW2ldKTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbF9hLmxlbmd0aDsgaSsrKSB7IFxyXG4gICAgICAgICAgICB2YXIgYW5jaCA9IGxpc3RfYVtpXTsgXHJcbiAgICAgICAgICAgIGFuY2gub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkX3N0YXJ0IDogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgICAgIGRfc3RhcnQub25jaGFuZ2UgPSBkX3N0YXJ0X2NoYW5nZTtcclxuICAgICAgICB2YXIgZF9lbmQgOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpO1xyXG4gICAgICAgIGRfZW5kLm9uY2hhbmdlID0gZF9lbmRfY2hhbmdlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBkX3N0YXJ0X2NoYW5nZSgpe1xyXG4gICAgICAgIHZhciBkYXRlX3N0YXJ0ID0gKCA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKSApLnZhbHVlO1xyXG4gICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLmZyb21EYXRlID0gZGF0ZV9zdGFydDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrIGRhdGUgc3RhcnRcIik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkX2VuZF9jaGFuZ2UoKXtcclxuICAgICAgICB2YXIgZGF0ZV9lbmQgPSAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKSApLnZhbHVlO1xyXG4gICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLnRvRGF0ZSA9IGRhdGVfZW5kO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2sgZGF0ZSBlbmRcIik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIHRyaWdnZXIgZnVuY3Rpb25zIG9uIHBhZ2UgbG9hZFxyXG4gICAgZnVuY3Rpb24gb25fbG9hZCgpIHtcclxuICAgIFxyXG4gICAgICAgIGluaV9zZXRfbWV0YURhdGEoKTtcclxuICAgICAgICBcclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucyA9IG5ldyBGaWx0ZXJPcHRpb25zKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgYWRkX2FuY2hvcl90YWdzX3RvX29uQ2xpY2tfcHJvY2Vzc2luZygpOyB9LCA1MDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZfc2VhcmNoX2tleXdvcmRzKCk7XHJcbiAgICAgICBcclxuICAgIH1cclxuICAgICAgICAgICIsIiJdfQ==
