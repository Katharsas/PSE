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
        }
        if (this.toDate !== null) {
            this.toDate = clean(this.toDate);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBOERqQjtBQTlERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBRW5CLElBQU0sT0FBTyxHQUFXLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUMxRCxJQUFNLGdCQUFnQixHQUFXLFVBQVUsR0FBRyxhQUFhLENBQUM7SUFDNUQsSUFBTSxlQUFlLEdBQVcsVUFBVSxHQUFHLHFCQUFxQixDQUFDO0lBQ25FLElBQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFFLENBQUM7SUFFekQsb0JBQTJCLEtBQWEsRUFBRSxPQUFzQixFQUFFLElBQVksRUFBRSxLQUFhO1FBQzVGLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUU5QixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUUzQyxJ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QyxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQsaUNBQWlDO0FBQ2pDO0lBRUksZ0JBQWdCLEVBQUUsQ0FBQztJQUVuQixvQkFBb0IsR0FBRyxJQUFJLDZCQUFhLEVBQUUsQ0FBQztJQUUzQyxXQUFXLENBQUMsY0FBWSxxQ0FBcUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXpFLGlCQUFpQixFQUFFLENBQUM7QUFFeEIsQ0FBQzs7QUNuZUwiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBqbW90aGVzXHJcbiAgICAgKi9cclxuXHJcblxyXG5pbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuXHJcbmRlY2xhcmUgdmFyIGNvbnRleHRVcmw6IHN0cmluZztcclxuXHJcbmV4cG9ydCBtb2R1bGUgQWpheCB7XHJcblxyXG5cdGNvbnN0IHVybEJhc2U6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NlYXJjaFwiO1xyXG5cdGNvbnN0IHVybEJhc2VfbWV0YWRhdGE6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldE1ldGFkYXRhXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9zaW1pbGFyOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRBcnRpY2xlcy9zaW1pbGFyXCI7XHJcblx0Y29uc3QgaGVhZGVycyA9IHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb24sKi8qO3E9MC44XCIgfTtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5UXVlcnkocXVlcnk6IFN0cmluZywgZmlsdGVyczogRmlsdGVyT3B0aW9ucywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcInF1ZXJ5PVwiICsgcXVlcnkpO1xyXG5cclxuXHRcdGxldCBmaWx0ZXJQYXJhbXM6IHN0cmluZyA9IGZpbHRlcnMudG9VcmxQYXJhbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX1wiLGZpbHRlclBhcmFtcyk7XHJcblx0XHRpZiAoZmlsdGVyUGFyYW1zICE9PSBcIlwiKSBwYXJhbXMucHVzaChmaWx0ZXJQYXJhbXMpO1xyXG5cclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZSArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdFx0XHJcblx0XHRsZXQgc2V0dGluZ3MgPSB7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRoZWFkZXJzOiBoZWFkZXJzLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHRcdHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1ldGFkYXRhKCk6IEpRdWVyeVhIUiB7XHJcblx0XHRsZXQgdXJsOiBzdHJpbmcgPSB1cmxCYXNlX21ldGFkYXRhIDtcclxuXHRcdC8vIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUiBcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlTaW1pbGFyKGFydGljbGVJZDogU3RyaW5nLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJpZD1cIiArIGFydGljbGVJZCk7XHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2Vfc2ltaWxhciArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19nZXRCeUlkX19cIix1cmwpO1xyXG5cclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG59IiwiLyogXHJcbiAqQGF1aG9yIGptb3RoZXNcclxuICovXHJcblxyXG4vLyB1dGlsIGZ1bmN0aW9uIGZvciBjbGVhbiBcclxuZnVuY3Rpb24gcGFkKG46IHN0cmluZywgd2lkdGg6IG51bWJlcikge1xyXG4gICAgLy92YXIgeiA9IHogfHwgJzAnO1xyXG4gICAgdmFyIHogPSAnMCc7XHJcbiAgICBuID0gbiArICcnO1xyXG4gICAgcmV0dXJuIG4ubGVuZ3RoID49IHdpZHRoID8gbiA6IG5ldyBBcnJheSh3aWR0aCAtIG4ubGVuZ3RoICsgMSkuam9pbih6KSArIG47XHJcbn1cclxuICAgICBcclxuLy8gX19maWx0ZXJfXyBmcm9tPTE5ODAtMDEtMDEmdG89MjAyMC0wMS0wMVxyXG4vLyBfX2ZpbHRlcl9fIGZyb209MjAxNS04LTcmdG89MjAxNi02LTNcclxuZnVuY3Rpb24gY2xlYW4oZGF0ZTogc3RyaW5nKSB7XHJcbiAgICB2YXIgcGFydHMgPSBkYXRlLnNwbGl0KFwiLVwiKTtcclxuICAgIHBhcnRzWzBdID0gcGFkKHBhcnRzWzBdLCA0KTtcclxuICAgIHBhcnRzWzFdID0gcGFkKHBhcnRzWzFdLCAyKTtcclxuICAgIHBhcnRzWzJdID0gcGFkKHBhcnRzWzJdLCAyKTtcclxuICAgIC8vcmV0dXJuIFwiMTk4MC0wMS0wMVwiO1xyXG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oXCItXCIpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmlsdGVyT3B0aW9ucyB7XHJcblxyXG4gICAgdG9waWNzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgc291cmNlczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBmcm9tRGF0ZTogc3RyaW5nID0gXCIxOTgwLTAxLTAxXCI7XHJcbiAgICB0b0RhdGU6IHN0cmluZyA9IFwiMjAyMC0wMS0wMVwiO1xyXG4gICAgXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnQgZmlsdGVyIG9wdGlvbnMgdG8gdXJsIHBhcmFtZXRlciBzdHJpbmcgb2YgZm9ybWF0XHJcblx0ICogXCJwYXJhbTE9dmFsdWUxJnBhcmFtMj12YWx1ZTImcGFyYW00PXZhbHVlM1wiIGZvciB1c2UgYXMgdXJsIHBhcmFtZXRlcnMuXHJcblx0ICovXHJcbiAgICB0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHBhcmFtczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9waWNzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJ0b3BpY3M9XCIgKyB0aGlzLmNvbmNhdE11bHRpUGFyYW0odGhpcy50b3BpY3MpKTtcclxuICAgICAgICBpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG4gICAgICAgIGlmICh0aGlzLmZyb21EYXRlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZnJvbURhdGUgPSBjbGVhbih0aGlzLmZyb21EYXRlKTtcclxuICAgICAgICAgICAgLy9wYXJhbXMucHVzaChcImZyb209XCIgKyB0aGlzLmZyb21EYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9EYXRlID0gY2xlYW4odGhpcy50b0RhdGUpO1xyXG4gICAgICAgICAgICAvL3BhcmFtcy5wdXNoKFwidG89XCIgKyB0aGlzLnRvRGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFyYW1zLmpvaW4oXCImXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uY2F0TXVsdGlQYXJhbShhcnJheTogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuICAgIH1cclxufVxyXG4iLCIgICAgLypcclxuICAgICAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gICAgICovXHJcblxyXG4gICAgLy8gdXRpbCBmdW5jdGlvbnMgaHRtbEJ1aWxkZXJcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtKGVsTmFtZTogc3RyaW5nLCBjbHNOYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHZhciB0bXAgPSAoPEVsZW1lbnQ+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxOYW1lKSk7XHJcbiAgICAgICAgdG1wLmNsYXNzTGlzdC5hZGQoY2xzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHRtcDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUZXh0KHBhcmVudDogYW55LCB0eHQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0bXAgPSAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0bXApO1xyXG4gICAgICAgIC8vcmV0dXJuIHRtcDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IG1vZHVsZSBIdG1sQnVpbGRlciB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGQgaHRtbCBsaSBlbGVtZW50IGZyb20gYXJ0aWNsZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gYnVpbGRBcnRpY2xlKGFydGljbGU6IGFueSwgcGFyZW50OiBhbnkpIHtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy92YXIgdG1wX2NsZWFyZml4ID0gY3JlYXRlRWxlbShcImRpdlwiLFwiY2xlYXJmaXhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgcm9vdCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJyZXN1bHRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9waWMgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX3RvcGljXCIpO1xyXG4gICAgICAgICAgICB2YXIgdG9waWNfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KHRvcGljX2J1dHRvbiwgYXJ0aWNsZS50b3BpYyk7XHJcbiAgICAgICAgICAgIHRvcGljLmFwcGVuZENoaWxkKHRvcGljX2J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHRvcGljKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwidGl0bGVcIik7XHJcbiAgICAgICAgICAgIHZhciBhID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBhcnRpY2xlLnVybDtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBhcnRpY2xlLnRpdGxlKTtcclxuICAgICAgICAgICAgdGl0bGUuYXBwZW5kQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsaW5rID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImxpbmtcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQobGluaywgYXJ0aWNsZS51cmwuc3Vic3RyaW5nKDAsIDQ1KSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwiY29udGFpbmVyX2RhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfZGF0ZSA9IGNyZWF0ZUVsZW0oXCJzcGFuXCIsIFwiZGF0ZVwiKTtcclxuICAgICAgICAgICAgdmFyIHJhd19kYXRlID0gYXJ0aWNsZS5wdWJEYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2J1ZyBzdWJzdHIgb3RoZXIgYmVoYXZpb3VyIHRoYW4gc3Vic3RyaW5nXHJcbiAgICAgICAgICAgIHZhciBkYXRlX3kgPSByYXdfZGF0ZS5zdWJzdHJpbmcoMCwgNCk7XHJcbiAgICAgICAgICAgIC8vIGhlcmUgZmlyZWZveCBqcyBicm93c2VyIGJ1ZyBvbiBzdWJzdHIoNSw3KVxyXG4gICAgICAgICAgICB2YXIgZGF0ZV9tID0gcmF3X2RhdGUuc3Vic3RyaW5nKDUsIDcpLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuICAgICAgICAgICAgdmFyIGRhdGVfZCA9IHJhd19kYXRlLnN1YnN0cmluZyg4LCAxMCkucmVwbGFjZSgvXjArKD8hXFwufCQpLywgJycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZF9kYXRlID0gZGF0ZV9kICsgXCIuXCIgKyBkYXRlX20gKyBcIi5cIiArIGRhdGVfeVxyXG4gICAgICAgICAgICBhZGRUZXh0KGRhdGVfZGF0ZSwgZm9ybWF0dGVkX2RhdGUpO1xyXG4gICAgICAgICAgICBkYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX2RhdGUpO1xyXG4gICAgICAgICAgICAvL3ZhciBkYXRlX3RpbWUgPSBjcmVhdGVFbGVtKFwic3BhblwiLFwidGltZVwiKTtcclxuICAgICAgICAgICAgLy9kYXRlX2J1dHRvbi5hcHBlbmRDaGlsZChkYXRlX3RpbWUpO1xyXG4gICAgICAgICAgICBkYXRlLmFwcGVuZENoaWxkKGRhdGVfYnV0dG9uKTtcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChkYXRlKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudCwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0LnN1YnN0cmluZygwLCAzMDApKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50X2NhY2hlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRlbnRfY2FjaGVcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5leHRyYWN0ZWRUZXh0KTtcclxuICAgICAgICAgICAgdmFyIGJyX3RhZyA9IGNyZWF0ZUVsZW0oXCJiclwiLFwibm90aGluZ19zcGVjaWFsXCIpO1xyXG4gICAgICAgICAgICBjb250ZW50X2NhY2hlLmFwcGVuZENoaWxkKGJyX3RhZyk7XHJcbiAgICAgICAgICAgIHZhciBicl90YWcgPSBjcmVhdGVFbGVtKFwiYnJcIixcIm5vdGhpbmdfc3BlY2lhbFwiKTtcclxuICAgICAgICAgICAgY29udGVudF9jYWNoZS5hcHBlbmRDaGlsZChicl90YWcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYWRkVGV4dChjb250ZW50X2NhY2hlLCBhcnRpY2xlLnNvdXJjZSk7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGVudF9jYWNoZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXV0aG9yID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImF1dGhvclwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dChhdXRob3IsIGFydGljbGUuYXV0aG9yKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoYXV0aG9yKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGltZyBzcmM9XCIvQ1dBL3Jlc291cmNlcy9pbWcvY2FjaGVfYXJyb3dfZG93bl9zbWFsbF9ncmV5LnBuZ1wiO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcl9idXR0b25zID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9idXR0b25zXCIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGJ1ZyByZWZhYyB0b2RvLCBoZXJlIGF1ZmtsYXBwZW4gbGFuZ2VyIHRleHQgIVxyXG4gICAgICAgICAgICB2YXIgY2FjaGVfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gXCIjY2FjaGVcIjsgLy8gKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcsIGFydGljbGUuYXJ0aWNsZUlkX3N0cik7XHJcbiAgICAgICAgICAgIHZhciBpbWcgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgICAgICAgaW1nLnNyYyA9IFwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjsvL1wiXCI7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBcIkNhY2hlXCIpO1xyXG5cclxuICAgICAgICAgICAgY2FjaGVfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICBjb250YWluZXJfYnV0dG9ucy5hcHBlbmRDaGlsZChjYWNoZV9idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNpbWlsYXJfYnV0dG9uID0gY3JlYXRlRWxlbShcImRpdlwiLCBcIm15QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gXCIjc2VhcmNoX3NpbWlsYXJcIjtcclxuICAgICAgICAgICAgLy9hLmhyZWYgPSBcIiNzaW1pbGFyX2lkX1wiICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyOyAvLzExMjMyNDNcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJywgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyKTtcclxuICAgICAgICAgICAgLy9hLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGEsIFwiU2ltaWxhclwiKTtcclxuICAgICAgICAgICAgc2ltaWxhcl9idXR0b24uYXBwZW5kQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXJfYnV0dG9ucy5hcHBlbmRDaGlsZChzaW1pbGFyX2J1dHRvbik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRhaW5lcl9idXR0b25zKTtcclxuXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbShcImRpdlwiLCBcImNsZWFyZml4XCIpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgX3RtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKTsgLy86IGFueTtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9wa2ljIGtrXCIpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBfdG1wLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLCBfdG1wKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBsaSA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKHJvb3QpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixyb290LCB0b3BpYyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgbGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAiLCIgICAgLypcclxuICAgICAqQGF1aG9yIGRiZWNrc3RlaW4sIGpmcmFuelxyXG4gICAgICovXHJcbiAgICAgXHJcbiAgICAgXHJcbiAgICAvLyBJbXBvcnQgdHlwZXNjcmlwdCAtIGNsYXNzZXNcclxuICAgIFxyXG4gICAgaW1wb3J0IHtBamF4fSBmcm9tIFwiLi9BamF4XCI7XHJcbiAgICBpbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuICAgIGltcG9ydCB7SHRtbEJ1aWxkZXJ9IGZyb20gXCIuL0h0bWxCdWlsZGVyXCI7XHJcblxyXG4gICAgXHJcbiAgICAvLyBDcmVhdGUgbG9jYWwgdHlwZXNjcmlwdCAtIGNsYXNzZXNcclxuICAgIFxyXG4gICAgY2xhc3MgQXJ0aWNsZVJlc3VsdCB7XHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgYXJ0aWNsZXM6IGFueVtdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE1ldGFkYXRhUmVzdWx0IHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBzb3VyY2VzOiBzdHJpbmdbXTtcclxuICAgICAgICB0b3BpY3M6IHN0cmluZ1tdO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE15Q29uc29sZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBsb2coczogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNsYXNzIFNlcnZlckNvbm5lY3Rpb24ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgcG9zdChzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBzKTtcclxuICAgICAgICAgICAgamwubG9nKFwicG9zdDogXCIgKyBzLCBcIm50ZlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEpTLUxvZ2dlciBmb3IgZGVidWdnaW5nXHJcbiAgICBcclxuICAgIGNsYXNzIEpzTG9nIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIGxvZyhzOiBzdHJpbmcsIHN0YXR1c19uYW1lOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSBbXCJlcnJcIiwgXCJtc2dcIiwgXCJudGZcIl07XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheSA9IFtcIkVycm9yXCIsIFwiTWVzc2FnZVwiLCBcIk5vdGlmaWNhdGlvblwiXTtcclxuICAgICAgICAgICAgdmFyIGNvbG9ycyA9IFtcIkZGNjE1OVwiLCBcIkZGOUY1MVwiLCBcIjIyQjhFQlwiLCBcIlwiLCBcIlwiXTsgXHJcblxyXG4gICAgICAgICAgICB2YXIgamwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzX2xvZ1wiKTsgXHJcbiAgICAgICAgICAgIHZhciBjb2xfaWQgPSBzdGF0dXMuaW5kZXhPZihzdGF0dXNfbmFtZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RhdHVzX2Rpc3BsYXlfbmFtZSA9IHN0YXR1c19kaXNwbGF5W2NvbF9pZF1cclxuICAgICAgICAgICAgcyA9IHMucmVwbGFjZShcIlxcblwiLCBcIjxicj5cIik7XHJcbiAgICAgICAgICAgIHMgPSBzdGF0dXNfZGlzcGxheV9uYW1lICsgXCJcXG5cXG5cIiArIHM7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSBzLnJlcGxhY2UoXCJcXG5cIiwgXCI8YnI+PGJyPlwiKTtcclxuICAgICAgICAgICAgamwuaW5uZXJIVE1MID0gdHh0O1xyXG4gICAgICAgICAgICBqbC5zdHlsZS5ib3JkZXJDb2xvciA9IFwiI1wiICsgY29sb3JzW2NvbF9pZF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBFeGFjdCBvcmRlciBvZiB0aGVzZSBuZXh0IGNvbW1hbmRzIGlzIGltcG9ydGFudCBcclxuICAgIHZhciBjcyA9IG5ldyBNeUNvbnNvbGUoKTtcclxuICAgIHZhciBqbCA9IG5ldyBKc0xvZygpO1xyXG4gICAgdmFyIGNvbm4gPSBuZXcgU2VydmVyQ29ubmVjdGlvbigpO1xyXG4gICAgXHJcbiAgICB2YXIgZ2xvYmFsX2ZpbHRlck9wdGlvbnM6IGFueTtcclxuXHJcbiAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yIERPTUNvbnRlbnRMb2FkZWQgZXZlbnQgLSBmaXJlcyB3aGVuIGFsbCBwYWdlcyBjb250ZW50IGlzIGxvYWRlZFxyXG4gICAgXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICBvbl9sb2FkKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy9DcmVhdGUgbGlzdCBvZiBtZXRhZGF0YSBsaSBlbGVtZW50c1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBzZXRfbWV0YURhdGEocmVzdWx0OiBNZXRhZGF0YVJlc3VsdCkge1xyXG4gICAgICAgIHZhciB0b3BpY19zZXQ6IGFueSA9IFtdO1xyXG4gICAgICAgIHZhciBzb3VyY2Vfc2V0OiBhbnkgPSBbXTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cgKFwiLS0tbm93LS0tXCIscmVzdWx0LnNvdXJjZXMpO1xyXG4gICAgICAgIHRvcGljX3NldCA9IHJlc3VsdC50b3BpY3M7XHJcbiAgICAgICAgc291cmNlX3NldCA9IHJlc3VsdC5zb3VyY2VzO1xyXG5cclxuICAgICAgICB2YXIgdG9waWNfbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0X3RvcGljX2xpc3RcIik7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9waWNfc2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3BpY05hbWUgPSB0b3BpY19zZXRbaV07XHJcbiAgICAgICAgICAgIHZhciBhID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3RvZ2dsZV9maWx0ZXJcIjsgXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1uYW1lJywgdG9waWNOYW1lKTtcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXR5cGUnLCBcInRvcGljXCIpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItc2VsZWN0ZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGEub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b3BpY05hbWUpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICB9ICBcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc291cmNlX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF9zb3VyY2VfbGlzdFwiKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2Vfc2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2VOYW1lID0gc291cmNlX3NldFtpXTtcclxuICAgICAgICAgICAgdmFyIGEgPSAoPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1uYW1lJywgc291cmNlTmFtZSk7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJywgXCJzb3VyY2VcIik7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHNvdXJjZU5hbWUpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgc291cmNlX2xpc3QuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgfSAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIExvYWRzIHJlc3VsdHMgb2YgbWV0YWRhdGEtcmVxdWVzdCBhbmQgZGlzcGxheXMgdGhlbSBhcyB0YWdzXHJcblxyXG4gICAgZnVuY3Rpb24gaW5pX3NldF9tZXRhRGF0YSgpOiBhbnkge1xyXG4gICAgICAgIHZhciBjc19sb2dfYWpheF9oaW50XzEgPSBcIl9fX19uZXdfYWpheF9fX19cIjtcclxuICAgICAgICBBamF4LmdldE1ldGFkYXRhKClcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBNZXRhZGF0YVJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIFwiTmV3IHRvcGljcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQudG9waWNzKTsvLy5hcnRpY2xlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyBzb3VyY2VzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC5zb3VyY2VzKTsvLy5hcnRpY2xlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0X21ldGFEYXRhKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gcmVzdWx0OyAvL2J1ZyBhc3luY2hyb251b3MgISFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgICAgLy8gR1VJIGZ1bmN0aW9ucyBoaWRlLCBkaXNwbGF5IG11bHRpcGxlIGVsZW1lbnRzXHJcbiAgICBcclxuICAgICAgICBmdW5jdGlvbiBlbGVtZW50X3NldF9kaXNwbGF5KGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBlbGVtZW50X3Nob3coaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcImJsb2NrXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBlbGVtZW50X2hpZGUoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBlbGVtZW50X3NldF9kaXNwbGF5KGlkLCBcIm5vbmVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jcmVhdGUoaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSk7XHJcbiAgICAgICAgICAgIGUuaWQgPSBcInNwYW5faGlkZGVuX1wiICsgaWQ7XHJcbiAgICAgICAgICAgIGUuY2xhc3NOYW1lID0gXCJzcGFuX2hpZGRlblwiO1xyXG4gICAgICAgICAgICBlLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgIGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2RlbGV0ZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50c190b19yZW1vdmUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3Bhbl9oaWRkZW5cIik7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudHNfdG9fcmVtb3ZlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c190b19yZW1vdmVbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c190b19yZW1vdmVbMF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fY2hlY2soaWQ6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgdmFyIGJvb2wgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHNwYW5fbGlzdCA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdlbm4ga2VpbiBIaWRkZW4gU3BhbiBkYSwgZGFubiB3ZXJ0IGltbWVyIGZhbHNjaCEhXHJcbiAgICAgICAgICAgIC8vYnVnIGFzc3VtZXMganVzdCBvbmUgY2xhcyByYWlzZSB3YXJuaWduIGlmIG1vcmUgY2xhc3NlcyAhISAsIGNsZWFyZWQsIGJ5IGNoZWNrIGxlbmdodCA9PSAxXHJcbiAgICAgICAgICAgIGlmIChzcGFuX2xpc3QubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzcGFuID0gc3Bhbl9saXN0WzBdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3Bhbi5pbm5lckhUTUwsIHRleHQpO1xyXG4gICAgICAgICAgICAgICAgYm9vbCA9IChcIlwiICsgdGV4dCA9PSBcIlwiICsgc3Bhbi5pbm5lckhUTUwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNzLmxvZyhcIlwiICsgYm9vbCk7XHJcbiAgICAgICAgICAgIHJldHVybiBib29sO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTXVsdGlwbGUgZnVuY3Rpb25zIHRyaWdnZXIgb24gb25jbGlja1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3Jkc19vbGQoZWw6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgZmxkX3NlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxkX3NlYXJjaFwiKTtcclxuICAgICAgICAgICAgdmFyIGZsZCA9ICg8SFRNTElucHV0RWxlbWVudD4gZmxkX3NlYXJjaCkudmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBrZXl3b3JkcyA9IGZsZDtcclxuICAgICAgICAgICAgY29ubi5wb3N0KGtleXdvcmRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gdXRpbF9lbXB0eV9ub2RlKG15Tm9kZSA6IE5vZGUpe1xyXG4gICAgICAgICAgICB3aGlsZSAobXlOb2RlLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIG15Tm9kZS5yZW1vdmVDaGlsZChteU5vZGUuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2tleXdvcmRzKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tc2VhcmNoLS0tLS0tLS0tLVwiKVxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnQgPSBcIl9fX2FqYXhfX18gXCI7XHJcbiAgICAgICAgICAgIHZhciBrZXl3b3JkcyA9ICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxkX3NlYXJjaFwiKSkudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX2tfa2V5d29yZF9fXCIgKyBcIi1cIiArIGtleXdvcmRzICsgXCItXCIpO1xyXG5cclxuICAgICAgICAgICAgQWpheC5nZXRCeVF1ZXJ5KGtleXdvcmRzLCBnbG9iYWxfZmlsdGVyT3B0aW9ucywgMCwgMTApXHJcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IEFydGljbGVSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIkFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSA8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxfZW1wdHlfbm9kZShsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYXJ0aWNsZSBvZiByZXN1bHQuYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIGFydGljbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIdG1sQnVpbGRlci5idWlsZEFydGljbGUoYXJ0aWNsZSwgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuYXJ0aWNsZXMubGVuZ3RoIDw9IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJObyByZXN1bHRzIGZvdW5kXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZfc2VhcmNoX2ZpbHRlcihlbDogYW55KSB7IFxyXG4gICAgICAgICAgICB2YXIgY2hlY2sgPSBzcGFuX2hpZGRlbl9jaGVjayhcImZpbHRlcl9zZXR0aW5nc1wiLCBcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgIGlmIChjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudF9oaWRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgc3Bhbl9oaWRkZW5fZGVsZXRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBjbG9zaW5nLlwiLCBcIm50ZlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRfc2hvdyhcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIHNwYW5faGlkZGVuX2NyZWF0ZShcImZpbHRlcl9zZXR0aW5nc1wiLCBcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIG9wZW5pbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrX3VybF9uYW1lKGV2ZW50OiBhbnkpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmxfaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoOy8vLnBhdGhuYW1lO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1cmxfaGFzaCk7IC8vIGRvZXMgbm90IHdvcmsgaW4gaWU/PyAhISFcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwic2VhcmNoX2ZpbHRlclwiO1xyXG4gICAgICAgICAgICBpZiAodXJsX2hhc2guaW5kZXhPZihcIiNcIiArIGtleSkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGtleSk7XHJcbiAgICAgICAgICAgICAgICBjcy5sb2coa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9zaW1pbGFyKGVsIDogYW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1zaW1pbGFyLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIGFydGljbGVJZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGVJZCk7XHJcbiAgXHJcbiAgICAgICAgICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19zaW1pbGFyX19fXCI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBBamF4LmdldEJ5U2ltaWxhcihhcnRpY2xlSWQsIDAsIDEwKVxyXG4gICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsX2VtcHR5X25vZGUobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFydGljbGUgb2YgcmVzdWx0LmFydGljbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuYXV0aG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSHRtbEJ1aWxkZXIuYnVpbGRBcnRpY2xlKGFydGljbGUsIGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuYXJ0aWNsZXMubGVuZ3RoIDw9IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJObyByZXN1bHRzIGZvdW5kXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfZGF0ZV9zZXRfcmFuZ2UoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgIHZhciBkYXlzX2JhY2tfZnJvbV9ub3cgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZS1yYW5nZS1kYXlzJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRheXNfYmFja19mcm9tX25vdyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2VuZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmRfc3RyID0gKGRhdGVfZW5kLmdldEZ1bGxZZWFyKCkgKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0TW9udGgoKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKSApLnZhbHVlID0gZGF0ZV9lbmRfc3RyO1xyXG4gICAgICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b0RhdGUgPSBkYXRlX2VuZF9zdHI7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX3N0YXJ0ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZGF0ZV9zdGFydC5zZXREYXRlKGRhdGVfc3RhcnQuZ2V0RGF0ZSgpIC0gZGF5c19iYWNrX2Zyb21fbm93KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlX3N0YXJ0X3N0ciA9IChkYXRlX3N0YXJ0LmdldEZ1bGxZZWFyKCkgKSArIFwiLVwiICsgZGF0ZV9zdGFydC5nZXRNb250aCgpICsgXCItXCIgKyBkYXRlX3N0YXJ0LmdldERhdGUoKTtcclxuICAgICAgICAgICAgKCA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKSApLnZhbHVlID0gZGF0ZV9zdGFydF9zdHI7XHJcbiAgICAgICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zLmZyb21EYXRlID0gZGF0ZV9zdGFydF9zdHI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNzc19oaWRlKGVsOmFueSl7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY3NzX3Nob3coZWw6YW55KXtcclxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfdG9nZ2xlX2ZpbHRlcihlbDphbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLWZpbHRlci0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciB0eXBlICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScpO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLW5hbWUnKTtcclxuICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgaXNTZWxlY3RlZF9wcmUgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXIgOiBhbnk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInRvcGljXCIpe1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyID0gZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9waWNzO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGZpbHRlciA9IGdsb2JhbF9maWx0ZXJPcHRpb25zLnNvdXJjZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzU2VsZWN0ZWQ9PT1cInRydWVcIil7XHJcbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLXNlbGVjdGVkJywgXCJmYWxzZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbHRlci5pbmRleE9mKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoIGluZGV4IT09KC0xKSApe1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlci5zcGxpY2UoaW5kZXgsIDEpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci1zZWxlY3RlZCcsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgIGZpbHRlci5wdXNoKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5hbWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX2lzX19fX19fX19cIiwgaXNTZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX2lzX19wcmVfX19cIiwgaXNTZWxlY3RlZF9wcmUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9fZmlsdGVyX19pc19fX19fX19fXCIsIGZpbHRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfY2FjaGVfdG9nZ2xlKGVsIDogYW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1jYWNoZS0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciBpZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICAgICAgdmFyIHBlIDogYW55ID0gZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHZhciBwaWQgOiBhbnkgPSBwZS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGlkKTtcclxuICAgICAgICAgICAgdmFyIGVfY29uIDogYW55ID0gcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRlbnRcIilbMF07XHJcbiAgICAgICAgICAgIHZhciBlX2Nvbl9jYWNoZSA6IGFueSA9IHBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250ZW50X2NhY2hlXCIpWzBdO1xyXG4gICAgICAgICAgICBpZiAoZV9jb25fY2FjaGUuc3R5bGUuZGlzcGxheSAhPSBcImJsb2NrXCIpe1xyXG4gICAgICAgICAgICAgICAgY3NzX3Nob3coZV9jb25fY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgY3NzX2hpZGUoZV9jb24pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNzc19oaWRlKGVfY29uX2NhY2hlKTtcclxuICAgICAgICAgICAgICAgIGNzc19zaG93KGVfY29uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlX2Nvbik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2NhY2hlX3RvZ2dsZV9vbGQoZWwgOiBhbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLWNhY2hlLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIGlkICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgICAgICB2YXIgcGUgOiBhbnkgPSBlbC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgdmFyIHBpZCA6IGFueSA9IHBlLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzX2NsaWNrX29yX2VudGVyKGV2OiBhbnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgaHJlZiA9ICg8YW55PmVsKS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xyXG4gICAgICAgICAgICBocmVmID0gaHJlZi5zbGljZSgxKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5mbyBocmVmIHN3aXRoYy0tXCIgKyBocmVmICsgXCItLVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJib29sXCIsIGhyZWYgPT0gXCJzZWFjaF9maWx0ZXJcIiwgaHJlZiwgXCJzZWFjaF9maWx0ZXJcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzd2l0Y2ggKGhyZWYpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfZmlsdGVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfZmlsdGVyKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfa2V5d29yZHNcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9zaW1pbGFyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfc2ltaWxhcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidG9nZ2xlX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfdG9nZ2xlX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZV9zZXRfcmFuZ2VcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX2RhdGVfc2V0X3JhbmdlKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJjYWNoZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfY2FjaGVfdG9nZ2xlKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvLyBpbnRlcnZhbGwgb25DbGljayBwcm9jZXNzaW5nXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGFkZF9hbmNob3JfdGFnc190b19vbkNsaWNrX3Byb2Nlc3NpbmcoKXtcclxuICAgICAgICAvL3JlcGVhdCB0aGlzIGVhY2ggMC41MDAgc2Vjb25kXHJcbiAgICAgICAgdmFyIGNvbF9hID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiQVwiKSk7XHJcbiAgICAgICAgdmFyIGxpc3RfYTogYW55ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgbGlzdF9hLnB1c2goY29sX2FbaV0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIHsgXHJcbiAgICAgICAgICAgIHZhciBhbmNoID0gbGlzdF9hW2ldOyBcclxuICAgICAgICAgICAgYW5jaC5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRfc3RhcnQgOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgICAgZF9zdGFydC5vbmNoYW5nZSA9IGRfc3RhcnRfY2hhbmdlO1xyXG4gICAgICAgIHZhciBkX2VuZCA6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9lbmRcIik7XHJcbiAgICAgICAgZF9lbmQub25jaGFuZ2UgPSBkX2VuZF9jaGFuZ2U7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGRfc3RhcnRfY2hhbmdlKCl7XHJcbiAgICAgICAgdmFyIGRhdGVfc3RhcnQgPSAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpICkudmFsdWU7XHJcbiAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBkYXRlX3N0YXJ0O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2sgZGF0ZSBzdGFydFwiKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRfZW5kX2NoYW5nZSgpe1xyXG4gICAgICAgIHZhciBkYXRlX2VuZCA9ICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpICkudmFsdWU7XHJcbiAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9EYXRlID0gZGF0ZV9lbmQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGljayBkYXRlIGVuZFwiKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gdHJpZ2dlciBmdW5jdGlvbnMgb24gcGFnZSBsb2FkXHJcbiAgICBmdW5jdGlvbiBvbl9sb2FkKCkge1xyXG4gICAgXHJcbiAgICAgICAgaW5pX3NldF9tZXRhRGF0YSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdsb2JhbF9maWx0ZXJPcHRpb25zID0gbmV3IEZpbHRlck9wdGlvbnMoKTtcclxuICAgICAgICBcclxuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpeyBhZGRfYW5jaG9yX3RhZ3NfdG9fb25DbGlja19wcm9jZXNzaW5nKCk7IH0sIDUwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZl9zZWFyY2hfa2V5d29yZHMoKTtcclxuICAgICAgIFxyXG4gICAgfVxyXG4gICAgICAgICAgIiwiIl19
