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
    var children = topic_list.getElementsByTagName("li");
    //if children.lenght
    for (var i = 0; i < topic_set.length; i++) {
        var topicName = topic_set[i];
        var a = document.createElement('a');
        a.href = "#toggle_filter"; // topics this, add to at
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
    console.log(name);
    console.log(type);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBK0RqQjtBQS9ERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLGdEQUFnRDtJQUNuRCxJQUFNLE9BQU8sR0FBVyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsSUFBTSxnQkFBZ0IsR0FBVyxVQUFVLEdBQUcsYUFBYSxDQUFDO0lBQzVELElBQU0sZUFBZSxHQUFXLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztJQUNuRSxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFM0MsSUFBSSxHQUFHLEdBQVcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELHNDQUFzQztRQUV0QyxJQUFJLFFBQVEsR0FBRztZQUNkLEdBQUcsRUFBRSxHQUFHO1lBQ1IsT0FBTyxFQUFFLE9BQU87WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsSUFBSSxFQUFFLEtBQUs7U0FDWCxDQUFDO1FBQ0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQXJCZSxlQUFVLGFBcUJ6QixDQUFBO0lBRUU7UUFDRixJQUFJLEdBQUcsR0FBVyxnQkFBZ0IsQ0FBRTtRQUNwQyx1Q0FBdUM7UUFFdkMsSUFBSSxRQUFRLEdBQUc7WUFDZCxHQUFHLEVBQUUsR0FBRztZQUNSLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLElBQUksRUFBRSxLQUFLO1NBQ1gsQ0FBQztRQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFaa0IsZ0JBQVcsY0FZN0IsQ0FBQTtJQUdELHNCQUE2QixTQUFpQixFQUFFLElBQVksRUFBRSxLQUFhO1FBRXBFLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRTNDLElBQUksR0FBRyxHQUFXLGVBQWUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUVyQyxJQUFJLFFBQVEsR0FBRztZQUNkLEdBQUcsRUFBRSxHQUFHO1lBQ1IsT0FBTyxFQUFFLE9BQU87WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsSUFBSSxFQUFFLEtBQUs7U0FDWCxDQUFDO1FBQ0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQWpCZSxpQkFBWSxlQWlCM0IsQ0FBQTtBQUNGLENBQUMsRUEvRGEsSUFBSSxHQUFKLFlBQUksS0FBSixZQUFJLFFBK0RqQjs7QUN4RUc7O0dBRUc7O0FBRVA7SUFBQTtRQUVDLFdBQU0sR0FBYSxFQUFFLENBQUM7UUFDdEIsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUVwQixhQUFRLEdBQVcsWUFBWSxDQUFDO1FBQ25DLFdBQU0sR0FBVyxZQUFZLENBQUMsQ0FBQywyQkFBMkI7SUFxQjNELENBQUM7SUFsQkE7OztPQUdHO0lBQ0gsa0NBQVUsR0FBVjtRQUNDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUUxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzdGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFTyx3Q0FBZ0IsR0FBeEIsVUFBeUIsS0FBZTtRQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ0Ysb0JBQUM7QUFBRCxDQTNCQSxBQTJCQyxJQUFBO0FBM0JZLHFCQUFhLGdCQTJCekIsQ0FBQTs7QUMvQkc7O0dBRUc7O0FBRUgsNkJBQTZCO0FBRTdCLG9CQUFvQixNQUFjLEVBQUUsT0FBZTtJQUMvQyxJQUFJLEdBQUcsR0FBYyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBRSxDQUFDO0lBQ3JELEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDZixDQUFDO0FBRUQsaUJBQWlCLE1BQVcsRUFBRSxHQUFXO0lBQ3JDLElBQUksR0FBRyxHQUFXLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFFLENBQUM7SUFDaEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixhQUFhO0FBQ2pCLENBQUM7QUFFRCxJQUFjLFdBQVcsQ0E4SHhCO0FBOUhELFdBQWMsV0FBVyxFQUFDLENBQUM7SUFDdkI7O09BRUc7SUFDSCxzQkFBNkIsT0FBWSxFQUFFLE1BQVc7UUFFbEQsa0RBQWtEO1FBRWxELElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdkMsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBR2hELElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQVMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDckIsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZCLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUMvQyxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUUvQiwyQ0FBMkM7UUFDM0MsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsNkNBQTZDO1FBQzdDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakUsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVsRSxJQUFJLGNBQWMsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFBO1FBQ3pELE9BQU8sQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDbkMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuQyw0Q0FBNEM7UUFDNUMscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUVoRCxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlDLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoRCxhQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoRCxhQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFaEMsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6QyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXpCLGdFQUFnRTtRQUVoRSxJQUFJLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUUvRCxnREFBZ0Q7UUFDaEQsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsR0FBUyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsMkJBQTJCO1FBQzlDLENBQUMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3hELElBQUksR0FBRyxHQUFTLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxvREFBb0QsQ0FBQyxDQUFBLEtBQUs7UUFDcEUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXBCLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsaUJBQWlCLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTVDLElBQUksY0FBYyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLEdBQVMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO1FBQzNCLDREQUE0RDtRQUM1RCxDQUFDLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN4RCxxQ0FBcUM7UUFDckMsT0FBTyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN0QixjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlCLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU5QyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFLaEQsSUFBSSxJQUFJLEdBQVcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDLFFBQVE7UUFDNUQsSUFBSSxFQUFFLEdBQVcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUMvQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqQywyQkFBMkI7UUFDM0IsWUFBWTtRQUNaLG9EQUFvRDtRQUNwRCxJQUFJLEVBQUUsR0FBVyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2Qix5Q0FBeUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQXRIZSx3QkFBWSxlQXNIM0IsQ0FBQTtBQUlMLENBQUMsRUE5SGEsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUE4SHhCO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMEJJOztBQzVLSjs7R0FFRzs7QUFFSCxxQkFBbUIsUUFBUSxDQUFDLENBQUE7QUFDNUIsOEJBQTRCLGlCQUFpQixDQUFDLENBQUE7QUFDOUMsNEJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBRTFDO0lBQUE7SUFHQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUhBLEFBR0MsSUFBQTtBQUVEO0lBQUE7SUFJQSxDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUpBLEFBSUMsSUFBQTtBQUVEO0lBQ0k7SUFBZ0IsQ0FBQztJQUNqQix1QkFBRyxHQUFILFVBQUksQ0FBUztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFDRCx1QkFBRyxHQUFILFVBQUksRUFBVTtRQUNWLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTCxnQkFBQztBQUFELENBUkEsQUFRQyxJQUFBO0FBQUEsQ0FBQztBQUVGO0lBQ0k7SUFBZ0IsQ0FBQztJQUNqQiwrQkFBSSxHQUFKLFVBQUssQ0FBUztRQUNWLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2YsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDTCx1QkFBQztBQUFELENBTkEsQUFNQyxJQUFBO0FBQUEsQ0FBQztBQUVGO0lBQ0k7SUFBZ0IsQ0FBQztJQUNqQixtQkFBRyxHQUFILFVBQUksQ0FBUyxFQUFFLFdBQW1CO1FBQzlCLGdCQUFnQjtRQUNoQixJQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzFELElBQUksTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELHVCQUF1QjtRQUN2QixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1FBQ2pFLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekMseUNBQXlDO1FBQ3pDLElBQUksbUJBQW1CLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hELENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixDQUFDLEdBQUcsbUJBQW1CLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNuQix5REFBeUQ7UUFDekQsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsbUJBQUcsR0FBSCxVQUFJLEVBQVU7UUFDVixNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0wsWUFBQztBQUFELENBdEJBLEFBc0JDLElBQUE7QUFBQSxDQUFDO0FBRUYsbURBQW1EO0FBQ25ELElBQUksRUFBRSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7QUFDekIsSUFBSSxFQUFFLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNyQixJQUFJLElBQUksR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFFbEMsSUFBSSxvQkFBeUIsQ0FBQztBQUU5QixRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxLQUFLO0lBQ3hELE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQyxDQUFDLENBQUM7QUFFSDtJQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztJQUNuRCxPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFDRywrQkFBK0I7QUFDL0IsNkJBQTZCO0FBRTdCLGdCQUFnQjtBQUVoQixtRUFBbUU7QUFDbkUsK0RBQStEO0FBQy9ELDBEQUEwRDtBQUMxRCxzREFBc0Q7QUFFMUQsc0NBQXNDO0FBRXRDLHNCQUFzQixNQUFzQjtJQUN4QyxJQUFJLFNBQVMsR0FBUSxFQUFFLENBQUM7SUFDeEIsSUFBSSxVQUFVLEdBQVEsRUFBRSxDQUFDO0lBQ3pCLGdEQUFnRDtJQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFFLFdBQVcsRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDMUIsVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFFNUIsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzlELGdCQUFnQjtJQUNoQixJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsb0JBQW9CO0lBRXBCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3hDLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBVSxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBRSxDQUFDO1FBQzVDLENBQUMsQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyx5QkFBeUI7UUFDcEQsNERBQTREO1FBQzVELENBQUMsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDO1FBQ25DLElBQUksRUFBRSxHQUFjLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFFLENBQUM7UUFDbEQsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0FBR0wsQ0FBQztBQUVELGlCQUFpQjtBQUVqQjtJQUNJLElBQUksa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7SUFDNUMsV0FBSSxDQUFDLFdBQVcsRUFBRTtTQUNiLElBQUksQ0FBQyxVQUFTLE1BQXNCO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxhQUFhO1lBQzVELFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV6QixDQUFDO0lBQ0wsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUdHOzs7Ozs7Ozs7RUFTRTtBQUVGLDZCQUE2QixFQUFVLEVBQUUsR0FBVztJQUNoRCxJQUFJLEVBQUUsR0FBVSxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBRSxDQUFDO0lBQzdDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUMzQixDQUFDO0FBQ0Qsc0JBQXNCLEVBQVU7SUFDNUIsbUJBQW1CLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFDRCxzQkFBc0IsRUFBVTtJQUM1QixzQ0FBc0M7SUFDdEMsbUJBQW1CLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCw0QkFBNEIsRUFBVSxFQUFFLElBQVk7SUFDaEQsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVyQyxJQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUVsRSxPQUFPLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0Isa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxJQUFJLENBQUMsR0FBVSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBRSxDQUFDO0lBQy9DLENBQUMsQ0FBQyxFQUFFLEdBQUcsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztJQUM1QixDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDekIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCw0QkFBNEIsRUFBVTtJQUNsQyxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXJDLElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRWxFLE9BQU8sa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzQixrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztBQUNMLENBQUM7QUFHRCwyQkFBMkIsRUFBVSxFQUFFLElBQVk7SUFDL0MsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7SUFDakIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRXpELHFEQUFxRDtJQUNyRCw0RkFBNEY7SUFDNUYsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztJQUNSLENBQUM7SUFDRCxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO0FBRWhCLENBQUM7QUFFRCwrQkFBK0IsRUFBTztJQUNsQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3ZELElBQUksR0FBRyxHQUF1QixVQUFXLENBQUMsS0FBSyxDQUFDO0lBQ2hELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRCx5QkFBeUIsTUFBYTtJQUNsQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBQ25ELG1DQUFtQztJQUVuQyxJQUFJLGdCQUFnQixHQUFHLGFBQWEsQ0FBQztJQUNyQyxJQUFJLFFBQVEsR0FBUyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBRSxDQUFDLEtBQUssQ0FBQztJQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxHQUFHLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBRW5ELFdBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDakQsSUFBSSxDQUFDLFVBQVMsTUFBcUI7UUFDaEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUNwRCxJQUFJLElBQUksR0FBVSxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDaEUsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxDQUFnQixVQUFlLEVBQWYsS0FBQSxNQUFNLENBQUMsUUFBUSxFQUFmLGNBQWUsRUFBZixJQUFlLENBQUM7Z0JBQS9CLElBQUksT0FBTyxTQUFBO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixrRUFBa0U7Z0JBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLHlCQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMzQztRQUNMLENBQUM7SUFDTCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHlCQUF5QixDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7QUFJWCxDQUFDO0FBRUQseUJBQXlCLEVBQU87SUFDNUIsSUFBSSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDL0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNSLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2hDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNoQyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNwRCxFQUFFLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCwwQkFBMEI7QUFDOUIsQ0FBQztBQUVELHlEQUF5RDtBQUN6RCxnRkFBZ0Y7QUFDaEYsaURBQWlEO0FBQ2pELCtCQUErQjtBQUMvQixxQ0FBcUM7QUFFckMsd0JBQXdCLEtBQVU7SUFDOUIsNkNBQTZDO0lBQzdDLG1CQUFtQjtJQUNuQixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBLFlBQVk7SUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDRCQUE0QjtJQUNuRCxJQUFJLEdBQUcsR0FBRyxlQUFlLENBQUM7SUFDMUIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ0QsK0JBQStCO0lBQy9CLHdDQUF3QztJQUN4QywyR0FBMkc7SUFDM0csK0dBQStHO0lBQy9HLDhKQUE4SjtBQUNsSyxDQUFDO0FBRUQsMEJBQTBCLEVBQVE7SUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBQyxFQUFFLENBQUMsQ0FBQztJQUNwQyxJQUFJLFNBQVMsR0FBSSxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV2QixJQUFJLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztJQUVwQyxXQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQzlCLElBQUksQ0FBQyxVQUFTLE1BQXFCO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDcEQsSUFBSSxJQUFJLEdBQVUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2hFLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsQ0FBZ0IsVUFBZSxFQUFmLEtBQUEsTUFBTSxDQUFDLFFBQVEsRUFBZixjQUFlLEVBQWYsSUFBZSxDQUFDO2dCQUEvQixJQUFJLE9BQU8sU0FBQTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUIsa0VBQWtFO2dCQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQix5QkFBVyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDM0M7UUFDTCxDQUFDO0lBQ0wsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0FBRVgsQ0FBQztBQUVELDBCQUEwQixFQUFRO0lBQy9CLElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoQyxJQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzFCLDhDQUE4QztJQUM5QyxJQUFJLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBRSxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3RixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBRyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7SUFDbEUsb0JBQW9CLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztJQUMzQyxJQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzVCLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLGtCQUFrQixDQUFDLENBQUM7SUFDOUQsZ0NBQWdDO0lBQ2hDLG9CQUFvQjtJQUNwQixJQUFJLGNBQWMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBRSxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNyRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBRyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUM7SUFDdEUsb0JBQW9CLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUNuRCxDQUFDO0FBQ0Qsa0JBQWtCLEVBQU07SUFDcEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzlCLENBQUM7QUFDRCxrQkFBa0IsRUFBTTtJQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDL0IsQ0FBQztBQUdELHlCQUF5QixFQUFNO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBQyxFQUFFLENBQUMsQ0FBQztJQUNuQyxJQUFJLElBQUksR0FBSSxFQUFFLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDaEQsSUFBSSxJQUFJLEdBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBRUQsd0JBQXdCLEVBQVE7SUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxJQUFJLEVBQUUsR0FBSSxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQixJQUFJLEVBQUUsR0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7SUFDNUQsSUFBSSxHQUFHLEdBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQztJQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsSUFBSSxLQUFLLEdBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksV0FBVyxHQUFTLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQSxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0QixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUFBLElBQUksQ0FBQSxDQUFDO1FBQ0YsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUV2QixDQUFDO0FBRUQsZ0NBQWdDLEVBQU87SUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFZCx1REFBdUQ7SUFDdkQsMEdBQTBHO0lBQzFHLElBQUksSUFBSSxHQUFTLEVBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsNEJBQTRCO0lBQzVCLGtCQUFrQjtJQUNsQjs7OztNQUlFO0lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLGNBQWMsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDbEUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNYLEtBQUssZUFBZTtZQUNoQixlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsS0FBSyxDQUFDO1FBQ1YsS0FBSyxpQkFBaUI7WUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztZQUNwQixLQUFLLENBQUM7UUFDVixLQUFLLGdCQUFnQjtZQUNqQixnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyQixLQUFLLENBQUM7UUFDVixLQUFLLGVBQWU7WUFDaEIsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BCLEtBQUssQ0FBQztRQUNWLEtBQUssZ0JBQWdCO1lBQ2pCLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQztRQUNWLEtBQUssT0FBTztZQUNSLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuQixLQUFLLENBQUM7UUFHVixRQUFRO0lBRVosQ0FBQztJQUVELGdJQUFnSTtBQUNwSSxDQUFDO0FBTUwsK0JBQStCO0FBRS9CO0lBQ0ksZ0RBQWdEO0lBQ2hELElBQUksS0FBSyxHQUFVLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUUsQ0FBQztJQUN2RCxzREFBc0Q7SUFDdEQsSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFDO0lBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELCtEQUErRDtJQUUvRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNwQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUM7SUFFMUMsQ0FBQztJQUNELElBQUksT0FBTyxHQUFTLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUQsT0FBTyxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7SUFDbEMsSUFBSSxLQUFLLEdBQVMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RCxLQUFLLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztBQUVsQyxDQUFDO0FBRUQsd0RBQXdEO0FBQ3BELHVDQUF1QztBQUN2QyxRQUFRO0FBQ1osSUFBSTtBQUVKO0lBQ0ksSUFBSSxVQUFVLEdBQVUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUcsQ0FBQyxLQUFLLENBQUM7SUFDdEUsb0JBQW9CLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUNEO0lBQ0ksSUFBSSxRQUFRLEdBQVUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUcsQ0FBQyxLQUFLLENBQUM7SUFDbEUsb0JBQW9CLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztJQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUdEO0lBRUksZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQixjQUFjO0lBRWQsb0JBQW9CLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7SUFFM0MsK0NBQStDO0lBQy9DLCtDQUErQztJQUMvQywyQ0FBMkM7SUFDM0MsNkNBQTZDO0lBQzdDLCtDQUErQztJQUUvQyxXQUFXLENBQUMsY0FBWSxxQ0FBcUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXpFLGlCQUFpQixFQUFFLENBQUM7QUFFeEIsQ0FBQztBQUtFLDRCQUE0QjtBQUU1QixvQkFBb0I7QUFFcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNkJFOztBQ3hnQlQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBqbW90aGVzXHJcbiAgICAgKi9cclxuXHJcblxyXG5pbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuXHJcbmRlY2xhcmUgdmFyIGNvbnRleHRVcmw6IHN0cmluZztcclxuXHJcbmV4cG9ydCBtb2R1bGUgQWpheCB7XHJcbiAgICAvL3ZhciBjb250ZXh0VXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvQ1dBL1wiO1xyXG5cdGNvbnN0IHVybEJhc2U6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NlYXJjaFwiO1xyXG5cdGNvbnN0IHVybEJhc2VfbWV0YWRhdGE6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldE1ldGFkYXRhXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9zaW1pbGFyOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRBcnRpY2xlcy9zaW1pbGFyXCI7XHJcblx0Y29uc3QgaGVhZGVycyA9IHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb24sKi8qO3E9MC44XCIgfTtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5UXVlcnkocXVlcnk6IFN0cmluZywgZmlsdGVyczogRmlsdGVyT3B0aW9ucywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcInF1ZXJ5PVwiICsgcXVlcnkpO1xyXG5cclxuXHRcdGxldCBmaWx0ZXJQYXJhbXM6IHN0cmluZyA9IGZpbHRlcnMudG9VcmxQYXJhbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX1wiLGZpbHRlclBhcmFtcyk7XHJcblx0XHRpZiAoZmlsdGVyUGFyYW1zICE9PSBcIlwiKSBwYXJhbXMucHVzaChmaWx0ZXJQYXJhbXMpO1xyXG5cclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZSArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNZXRhZGF0YSgpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZV9tZXRhZGF0YSA7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUiBcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlTaW1pbGFyKGFydGljbGVJZDogU3RyaW5nLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJpZD1cIiArIGFydGljbGVJZCk7XHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2Vfc2ltaWxhciArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19nZXRCeUlkX19cIix1cmwpO1xyXG5cclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG59IiwiICAgIC8qIFxyXG4gICAgICpAYXVob3Igam1vdGhlc1xyXG4gICAgICovXHJcblxyXG5leHBvcnQgY2xhc3MgRmlsdGVyT3B0aW9ucyB7XHJcblxyXG5cdHRvcGljczogc3RyaW5nW10gPSBbXTtcclxuXHRzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBmcm9tRGF0ZTogc3RyaW5nID0gXCIxOTgwLTAxLTAxXCI7XHJcblx0dG9EYXRlOiBzdHJpbmcgPSBcIjIwMjAtMDEtMDFcIjsgLy8gYnVnICwgYmV0dGVyIGRlZmF1bHRzID8gXHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwiZnJvbT1cIiArIHRoaXMuZnJvbURhdGUpO1xyXG5cdFx0aWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcInRvPVwiICsgdGhpcy50b0RhdGUpO1xyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBkYmVja3N0ZWluLCBqZnJhbnpcclxuICAgICAqL1xyXG5cclxuICAgIC8vIHV0aWwgZnVuY3Rpb25zIGh0bWxCdWlsZGVyXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbShlbE5hbWU6IHN0cmluZywgY2xzTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgdG1wID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsTmFtZSkpO1xyXG4gICAgICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVGV4dChwYXJlbnQ6IGFueSwgdHh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgICAgICAvL3JldHVybiB0bXA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBtb2R1bGUgSHRtbEJ1aWxkZXIge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkIGh0bWwgbGkgZWxlbWVudCBmcm9tIGFydGljbGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQXJ0aWNsZShhcnRpY2xlOiBhbnksIHBhcmVudDogYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdmFyIHRtcF9jbGVhcmZpeCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHJvb3QgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwicmVzdWx0XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl90b3BpY1wiKTtcclxuICAgICAgICAgICAgdmFyIHRvcGljX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dCh0b3BpY19idXR0b24sIGFydGljbGUudG9waWMpO1xyXG4gICAgICAgICAgICB0b3BpYy5hcHBlbmRDaGlsZCh0b3BpY19idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0b3BpYyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInRpdGxlXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgYXJ0aWNsZS50aXRsZSk7XHJcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGluayA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJsaW5rXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGxpbmssIGFydGljbGUudXJsLnN1YnN0cmluZygwLCA0NSkpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9kYXRlXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLCBcImRhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV95ID0gcmF3X2RhdGUuc3Vic3RyaW5nKDAsIDQpO1xyXG4gICAgICAgICAgICAvLyBoZXJlIGZpcmVmb3gganMgYnJvd3NlciBidWcgb24gc3Vic3RyKDUsNylcclxuICAgICAgICAgICAgdmFyIGRhdGVfbSA9IHJhd19kYXRlLnN1YnN0cmluZyg1LCA3KS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2QgPSByYXdfZGF0ZS5zdWJzdHJpbmcoOCwgMTApLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRfZGF0ZSA9IGRhdGVfZCArIFwiLlwiICsgZGF0ZV9tICsgXCIuXCIgKyBkYXRlX3lcclxuICAgICAgICAgICAgYWRkVGV4dChkYXRlX2RhdGUsIGZvcm1hdHRlZF9kYXRlKTtcclxuICAgICAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAgICAgLy92YXIgZGF0ZV90aW1lID0gY3JlYXRlRWxlbShcInNwYW5cIixcInRpbWVcIik7XHJcbiAgICAgICAgICAgIC8vZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV90aW1lKTtcclxuICAgICAgICAgICAgZGF0ZS5hcHBlbmRDaGlsZChkYXRlX2J1dHRvbik7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50XCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnQsIGFydGljbGUuZXh0cmFjdGVkVGV4dC5zdWJzdHJpbmcoMCwgMzAwKSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudF9jYWNoZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50X2NhY2hlXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnRfY2FjaGUsIGFydGljbGUuZXh0cmFjdGVkVGV4dCk7XHJcbiAgICAgICAgICAgIHZhciBicl90YWcgPSBjcmVhdGVFbGVtKFwiYnJcIixcIm5vdGhpbmdfc3BlY2lhbFwiKTtcclxuICAgICAgICAgICAgY29udGVudF9jYWNoZS5hcHBlbmRDaGlsZChicl90YWcpO1xyXG4gICAgICAgICAgICB2YXIgYnJfdGFnID0gY3JlYXRlRWxlbShcImJyXCIsXCJub3RoaW5nX3NwZWNpYWxcIik7XHJcbiAgICAgICAgICAgIGNvbnRlbnRfY2FjaGUuYXBwZW5kQ2hpbGQoYnJfdGFnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5zb3VyY2UpO1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnRfY2FjaGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJhdXRob3JcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYXV0aG9yLCBhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpbWcgc3JjPVwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfYnV0dG9uc1wiKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBidWcgcmVmYWMgdG9kbywgaGVyZSBhdWZrbGFwcGVuIGxhbmdlciB0ZXh0ICFcclxuICAgICAgICAgICAgdmFyIGNhY2hlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI2NhY2hlXCI7IC8vICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnLCBhcnRpY2xlLmFydGljbGVJZF9zdHIpO1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBcIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7Ly9cIlwiO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJDYWNoZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoY2FjaGVfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaW1pbGFyX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NlYXJjaF9zaW1pbGFyXCI7XHJcbiAgICAgICAgICAgIC8vYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjsgLy8xMTIzMjQzXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcsIGFydGljbGUuYXJ0aWNsZUlkX3N0cik7XHJcbiAgICAgICAgICAgIC8vYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBcIlNpbWlsYXJcIik7XHJcbiAgICAgICAgICAgIHNpbWlsYXJfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoc2ltaWxhcl9idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250YWluZXJfYnV0dG9ucyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgX3RtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKTsgLy86IGFueTtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9wa2ljIGtrXCIpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBfdG1wLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLCBfdG1wKTtcclxuICAgICAgICAgICAgLy9wYXJlbnQuYXBwZW5kQ2hpbGQoX3RtcCk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGVsO1xyXG4gICAgICAgICAgICAvLyB1bnNhdWJlcmVyIGNvZGUsIGJ1aWxkIHVuZCBhcHBlbmQgdHJlbm5lbiBldmVudGw/XHJcbiAgICAgICAgICAgIHZhciBsaSA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKHJvb3QpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixyb290LCB0b3BpYyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgbGkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG5cclxuXHJcbiAgICAgICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8IDA7IGkrKyl7IC8vYnVnXHJcbiAgICAgICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICAgLy9qbC5sb2coXCJUaGlzIHBvc3Qgd2FzXFxuXCIsXCJlcnJcIik7XHJcbiAgICAgICAgICAgICAvL2psLmxvZyhpLFwibXNnXCIpO1xyXG4gICAgICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBidWcgZ2V0IHNvdXJjZXMgdG9kbyAhIVxyXG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPCAxNTsgaSsrKXtcclxuICAgICAgICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUb3BpYyBcIitpKSA7XHJcbiAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICAgICAgICAgLy8gYnVnIGVycm9mIG9mIHR5cGVzY3JpcHQgPz9cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vXHJcbiAgICAgICAgICBcclxuICAgICAgKi9cclxuXHJcbiIsIiAgICAvKlxyXG4gICAgICpAYXVob3IgZGJlY2tzdGVpbiwgamZyYW56XHJcbiAgICAgKi9cclxuXHJcbiAgICBpbXBvcnQge0FqYXh9IGZyb20gXCIuL0FqYXhcIjtcclxuICAgIGltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG4gICAgaW1wb3J0IHtIdG1sQnVpbGRlcn0gZnJvbSBcIi4vSHRtbEJ1aWxkZXJcIjtcclxuXHJcbiAgICBjbGFzcyBBcnRpY2xlUmVzdWx0IHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBhcnRpY2xlczogYW55W107XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTWV0YWRhdGFSZXN1bHQge1xyXG4gICAgICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgIHNvdXJjZXM6IHN0cmluZ1tdO1xyXG4gICAgICAgIHRvcGljczogc3RyaW5nW107XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTXlDb25zb2xlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIGxvZyhzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIiArIHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2xhc3MgU2VydmVyQ29ubmVjdGlvbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBwb3N0KHM6IHN0cmluZykge1xyXG4gICAgICAgICAgICBjcy5sb2coXCJcIiArIHMpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJwb3N0OiBcIiArIHMsIFwibnRmXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2xhc3MgSnNMb2cge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgbG9nKHM6IHN0cmluZywgc3RhdHVzX25hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSBbXCJlcnJcIiwgXCJtc2dcIiwgXCJudGZcIl07XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheSA9IFtcIkVycm9yXCIsIFwiTWVzc2FnZVwiLCBcIk5vdGlmaWNhdGlvblwiXTtcclxuICAgICAgICAgICAgdmFyIGNvbG9ycyA9IFtcIkZGNjE1OVwiLCBcIkZGOUY1MVwiLCBcIjIyQjhFQlwiLCBcIlwiLCBcIlwiXTsgXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIG9yYW5nZSAgXHJcbiAgICAgICAgICAgIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyAvL2luIGNvbnN0cnVjdG9yIHJlaW5cclxuICAgICAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAgICAgLy8gYWxsZXJ0IHJhc2llIGJ1ZyAsIGVycm8gcmlmIGNvbF9pZCA8IDBcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5X25hbWUgPSBzdGF0dXNfZGlzcGxheVtjb2xfaWRdXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIiwgXCI8YnI+XCIpO1xyXG4gICAgICAgICAgICBzID0gc3RhdHVzX2Rpc3BsYXlfbmFtZSArIFwiXFxuXFxuXCIgKyBzO1xyXG4gICAgICAgICAgICB2YXIgdHh0ID0gcy5yZXBsYWNlKFwiXFxuXCIsIFwiPGJyPjxicj5cIik7XHJcbiAgICAgICAgICAgIGpsLmlubmVySFRNTCA9IHR4dDtcclxuICAgICAgICAgICAgLy9qbC5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcIiNcIitjb2xvcnNbY29sX2lkXTtcclxuICAgICAgICAgICAgamwuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIiNcIiArIGNvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gRXhjYXQgb3JkZXIgb2YgdGhlc2UgbmV4dCBjb21tYW5kcyBpcyBpbXBvcnRhbnQgXHJcbiAgICB2YXIgY3MgPSBuZXcgTXlDb25zb2xlKCk7XHJcbiAgICB2YXIgamwgPSBuZXcgSnNMb2coKTtcclxuICAgIHZhciBjb25uID0gbmV3IFNlcnZlckNvbm5lY3Rpb24oKTtcclxuXHJcbiAgICB2YXIgZ2xvYmFsX2ZpbHRlck9wdGlvbnM6IGFueTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICBvbl9sb2FkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hfZGVtbygpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tc2VhcmNoX2RlbW8tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgIG9uX2xvYWQoKTtcclxuICAgIH1cclxuICAgICAgICAvLyB0b2RvIGRhdGUgY2hhbmdlZCBpcyBpbiBodG1sXHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciBjaGFuZ2VzIG9mIGRhdGVcclxuICAgIFxyXG4gICAgICAgIC8vIGZ1Y250aW9uIGRhdGVcclxuICAgICAgICBcclxuICAgICAgICAvLyB2YXIgZWxfZGF0ZV9zdGFydCA9IDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgICAvLyB2YXIgZWxfZGF0ZV9lbmQgPSA8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpO1xyXG4gICAgICAgIC8vIGVsX2RhdGVfc3RhcnQub25ibHVyID0gZGF0ZV93YXNfY2hhbmdlZChlbF9kYXRlX3N0YXJ0KTtcclxuICAgICAgICAvLyBlbF9kYXRlX2VuZC5vbmJsdXIgPSBkYXRlX3dhc19jaGFuZ2VkKGVsX2RhdGVfZW5kKTtcclxuICAgIFxyXG4gICAgLy9DcmVhdGVzIGxpc3Qgb2YgbWV0YWRhdGEgbGkgZWxlbWVudHNcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gc2V0X21ldGFEYXRhKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICB2YXIgdG9waWNfc2V0OiBhbnkgPSBbXTtcclxuICAgICAgICB2YXIgc291cmNlX3NldDogYW55ID0gW107XHJcbiAgICAgICAgLy90b3BpY19zZXQgPSBbXCJ0b3BpYyAxXCIsIFwidG9waWMgMlwiLCBcInRvcGljIDNcIl07XHJcbiAgICAgICAgY29uc29sZS5sb2cgKFwiLS0tbm93LS0tXCIscmVzdWx0LnNvdXJjZXMpO1xyXG4gICAgICAgIHRvcGljX3NldCA9IHJlc3VsdC50b3BpY3M7XHJcbiAgICAgICAgc291cmNlX3NldCA9IHJlc3VsdC5zb3VyY2VzO1xyXG5cclxuICAgICAgICB2YXIgdG9waWNfbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0X3RvcGljX2xpc3RcIik7XHJcbiAgICAgICAgLy8gY2hlY2sgbGVuZ3RoIFxyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRvcGljX2xpc3QuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaVwiKTtcclxuICAgICAgICAvL2lmIGNoaWxkcmVuLmxlbmdodFxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9waWNfc2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3BpY05hbWUgPSB0b3BpY19zZXRbaV07XHJcbiAgICAgICAgICAgIHZhciBhID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3RvZ2dsZV9maWx0ZXJcIjsgLy8gdG9waWNzIHRoaXMsIGFkZCB0byBhdFxyXG4gICAgICAgICAgICAvL2EuaHJlZiA9IFwiI3NpbWlsYXJfaWRfXCIgKyBhcnRpY2xlLmFydGljbGVJZF9zdHI7IC8vMTEyMzI0M1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScsIHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJywgXCJ0b3BpY1wiKTtcclxuICAgICAgICAgICAgYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRvcGljTmFtZSk7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XHJcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIH0gIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBMb2FkcyBtZXRhZGF0YVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaV9zZXRfbWV0YURhdGEoKTogYW55IHtcclxuICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludF8xID0gXCJfX19fbmV3X2FqYXhfX19fXCI7XHJcbiAgICAgICAgQWpheC5nZXRNZXRhZGF0YSgpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCByZXN1bHQuZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIk5ldyB0b3BpY3MgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LnRvcGljcyk7Ly8uYXJ0aWNsZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldF9tZXRhRGF0YShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHJlc3VsdDsgLy9idWcgYXN5bmNocm9udW9zICEhXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludF8xLCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICAgICAgLypcclxuICAgICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB2YXIgc2FtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDA7IGkrKykgeyAvL2J1Z1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2hvdyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfaGlkZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vY2hlY2sgc3RhdHVzPyByYWlzZSBlcnJvciBpZiBoaWRkZW4/XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpKTtcclxuICAgICAgICAgICAgZS5pZCA9IFwic3Bhbl9oaWRkZW5fXCIgKyBpZDtcclxuICAgICAgICAgICAgZS5jbGFzc05hbWUgPSBcInNwYW5faGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fZGVsZXRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2VubiBrZWluIEhpZGRlbiBTcGFuIGRhLCBkYW5uIHdlcnQgaW1tZXIgZmFsc2NoISFcclxuICAgICAgICAgICAgLy9idWcgYXNzdW1lcyBqdXN0IG9uZSBjbGFzIHJhaXNlIHdhcm5pZ24gaWYgbW9yZSBjbGFzc2VzICEhICwgY2xlYXJlZCwgYnkgY2hlY2sgbGVuZ2h0ID09IDFcclxuICAgICAgICAgICAgaWYgKHNwYW5fbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwYW4gPSBzcGFuX2xpc3RbMF07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFuLmlubmVySFRNTCwgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICBib29sID0gKFwiXCIgKyB0ZXh0ID09IFwiXCIgKyBzcGFuLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBib29sKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJvb2w7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHNfb2xkKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGZsZF9zZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIik7XHJcbiAgICAgICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgICAgIGNvbm4ucG9zdChrZXl3b3Jkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIHV0aWxfZW1wdHlfbm9kZShteU5vZGUgOiBOb2RlKXtcclxuICAgICAgICAgICAgd2hpbGUgKG15Tm9kZS5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBteU5vZGUucmVtb3ZlQ2hpbGQobXlOb2RlLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcygpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLXNlYXJjaF9kZW1vLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICAgICAgLy8gb25fbG9hZCgpOyAvLyBidWcgdG9kbyAsIDwtIGRvbmVcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjc19sb2dfYWpheF9oaW50ID0gXCJfX19hamF4X19fIFwiO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSAoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIikpLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9rX2tleXdvcmRfX1wiICsgXCItXCIgKyBrZXl3b3JkcyArIFwiLVwiKTtcclxuXHJcbiAgICAgICAgICAgIEFqYXguZ2V0QnlRdWVyeShrZXl3b3JkcywgZ2xvYmFsX2ZpbHRlck9wdGlvbnMsIDAsIDEwKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsX2VtcHR5X25vZGUobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFydGljbGUgb2YgcmVzdWx0LmFydGljbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuYXV0aG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxCdWlsZGVyLmJ1aWxkQXJ0aWNsZShhcnRpY2xlLCBsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfZmlsdGVyKGVsOiBhbnkpIHsgLy8gYnVnIGtleSBub3QgdXNlZFxyXG4gICAgICAgICAgICB2YXIgY2hlY2sgPSBzcGFuX2hpZGRlbl9jaGVjayhcImZpbHRlcl9zZXR0aW5nc1wiLCBcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgIGlmIChjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudF9oaWRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgc3Bhbl9oaWRkZW5fZGVsZXRlKFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgamwubG9nKFwiRmlsdGVyIFxcbiBpcyBjbG9zaW5nLlwiLCBcIm50ZlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRfc2hvdyhcImZpbHRlcl9zZXR0aW5nc1wiKTtcclxuICAgICAgICAgICAgICAgIHNwYW5faGlkZGVuX2NyZWF0ZShcImZpbHRlcl9zZXR0aW5nc1wiLCBcInN0YXRlX3Nob3dcIik7XHJcbiAgICAgICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIG9wZW5pbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vc2hvdyBoaWRlLCBub3QgdG9nZ2xlICEhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vdmFyIGRhdGVfc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfc3RhcnRcIik7XHJcbiAgICAgICAgLy92YXIgZGF0ZV9zdGFydF9zdHIgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGRhdGVfc3RhcnQpLnZhbHVlLnJlcGxhY2UoLy0vZywgXCIvXCIpO1xyXG4gICAgICAgIC8vdmFyIGRhdGVfc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGVfc3RhcnRfc3RyKTtcclxuICAgICAgICAvL2NzLmxvZyhcIlwiICsgZGF0ZV9zdGFydF9kYXRlKTtcclxuICAgICAgICAvL2NzLmxvZyhkYXRlX3N0YXJ0X2RhdGUudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrX3VybF9uYW1lKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICAgICAgLy92YXIgdXJsX25hbWUgPSB3aW5kb3cubG9jYXRpb247Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgICAgIC8vY3MubG9nKHVybF9uYW1lKTtcclxuICAgICAgICAgICAgdmFyIHVybF9oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7Ly8ucGF0aG5hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybF9oYXNoKTsgLy8gZG9lcyBub3Qgd29yayBpbiBpZT8/ICEhIVxyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJzZWFyY2hfZmlsdGVyXCI7XHJcbiAgICAgICAgICAgIGlmICh1cmxfaGFzaC5pbmRleE9mKFwiI1wiICsga2V5KSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmX3NlYXJjaF9maWx0ZXIoa2V5KTtcclxuICAgICAgICAgICAgICAgIGNzLmxvZyhrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vaWYgI3NlYXJjaF9maWx0ZXIgaW4gdXJsX2hhc2hcclxuICAgICAgICAgICAgLy9tdWx0aWZsYWdfbGFzdF9oYXNoID0gc2VhcmNoX2ZpbHRlci4uLlxyXG4gICAgICAgICAgICAvL3Nob3cgZmlsZXRlciwgc2VhY2gga2V5d29yZHMsIHNob3cgY2FjaGUgKGdyZXksIGJsdWUsIGJsYWNrIGFuZCB3aGl0ZSwgdGhlbWUgYWxsIG5ldyBjYWNoZSwgZG8gcG9zdCByZXEuKVxyXG4gICAgICAgICAgICAvLyBpZiBrZXl3b3JkcywgcG9zdCBhY3Rpb24gPSBzZXJhY2ggc3ViYWN0aW9uID0ga2V5d29yZHMgZGF0YSA9IGtleXdvcmRzIGFycmF5LCBvciBjYWNoZV9pZCByZXF1ZXN0IGluZm9zLi4uLCBcclxuICAgICAgICAgICAgLy8gdGhlbiBzaG93LCBwb3N0IHVwZGF0ZSBncmV5IGFyZSBwcm9ncmVzcyBiYXIsIGZpbHRlciBpbmZvcyBnZXQgbG9jYWwgc3RvcmFnZSBmaWx0ZXJzX18uLiwgZ2V0IGZpbHRlcnMgZnJvbSBwYWdlPyBtYXJrZWQgKHNwYW4gbWFya2UsIHJlYWwgdmFsdWUsIGRpc3BsYXkuLi5cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfc2ltaWxhcihlbCA6IGFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tc2ltaWxhci0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciBhcnRpY2xlSWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlSWQpO1xyXG4gIFxyXG4gICAgICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludCA9IFwiX19fc2ltaWxhcl9fX1wiO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgQWpheC5nZXRCeVNpbWlsYXIoYXJ0aWNsZUlkLCAwLCAxMClcclxuICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3VsdDogQXJ0aWNsZVJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JNZXNzYWdlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiQXJ0aWNsZXMgcmVjZWl2ZWQ6XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVfbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbF9lbXB0eV9ub2RlKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnRpY2xlLmF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhciBzYW1wbGUgPSAoPE5vZGU+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIdG1sQnVpbGRlci5idWlsZEFydGljbGUoYXJ0aWNsZSwgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2RhdGVfc2V0X3JhbmdlKGVsIDogYW55KXtcclxuICAgICAgICAgICB2YXIgZGF5c19iYWNrX2Zyb21fbm93ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUtcmFuZ2UtZGF5cycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXlzX2JhY2tfZnJvbV9ub3cpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAvL3ZhciBkcyA9IFwiXCIgKyBkLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmRfc3RyID0gKGRhdGVfZW5kLmdldEZ1bGxZZWFyKCkgKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0TW9udGgoKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKSApLnZhbHVlID0gZGF0ZV9lbmRfc3RyO1xyXG4gICAgICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucy50b0RhdGUgPSBkYXRlX2VuZF9zdHI7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX3N0YXJ0ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZGF0ZV9zdGFydC5zZXREYXRlKGRhdGVfc3RhcnQuZ2V0RGF0ZSgpIC0gZGF5c19iYWNrX2Zyb21fbm93KTtcclxuICAgICAgICAgICAgLy92YXIgZGF0ZV9zdGFydCA9IGRhdGVfZW5kIC0gMTtcclxuICAgICAgICAgICAgLy9kYXlzX2JhY2tfZnJvbV9ub3dcclxuICAgICAgICAgICAgdmFyIGRhdGVfc3RhcnRfc3RyID0gKGRhdGVfc3RhcnQuZ2V0RnVsbFllYXIoKSApICsgXCItXCIgKyBkYXRlX3N0YXJ0LmdldE1vbnRoKCkgKyBcIi1cIiArIGRhdGVfc3RhcnQuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpICkudmFsdWUgPSBkYXRlX3N0YXJ0X3N0cjtcclxuICAgICAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBkYXRlX3N0YXJ0X3N0cjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY3NzX2hpZGUoZWw6YW55KXtcclxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBjc3Nfc2hvdyhlbDphbnkpe1xyXG4gICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZl90b2dnbGVfZmlsdGVyKGVsOmFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tZmlsdGVyLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIHR5cGUgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlci10eXBlJyk7XHJcbiAgICAgICAgICAgIHZhciBuYW1lICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItbmFtZScpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuYW1lKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfY2FjaGVfdG9nZ2xlKGVsIDogYW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1jYWNoZS0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciBpZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICAgICAgdmFyIHBlIDogYW55ID0gZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHZhciBwaWQgOiBhbnkgPSBwZS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocGlkKTtcclxuICAgICAgICAgICAgdmFyIGVfY29uIDogYW55ID0gcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbnRlbnRcIilbMF07XHJcbiAgICAgICAgICAgIHZhciBlX2Nvbl9jYWNoZSA6IGFueSA9IHBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250ZW50X2NhY2hlXCIpWzBdO1xyXG4gICAgICAgICAgICBpZiAoZV9jb25fY2FjaGUuc3R5bGUuZGlzcGxheSAhPSBcImJsb2NrXCIpe1xyXG4gICAgICAgICAgICAgICAgY3NzX3Nob3coZV9jb25fY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgY3NzX2hpZGUoZV9jb24pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNzc19oaWRlKGVfY29uX2NhY2hlKTtcclxuICAgICAgICAgICAgICAgIGNzc19zaG93KGVfY29uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlX2Nvbik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzX2NsaWNrX29yX2VudGVyKGV2OiBhbnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gYmFkIGdpdmVzIGZ1bGwgaHJlZiB3aXRoIGxpbmsgLy92YXIgaHJlZiA9IGVsLmhyZWY7IFxyXG4gICAgICAgICAgICAvLyBuaWNlLCBnaXZlcyByYXcgaHJlZiwgZnJvbSBlbGVtZW50IG9ubHkgKCBlLmcuICNzZWFyY2hfZmlsdGVyLCBpbnN0ZWFkIG9mIHd3dy5nb29nbGUuY29tLyNzZWFjaF9maWx0ZXIpXHJcbiAgICAgICAgICAgIHZhciBocmVmID0gKDxhbnk+ZWwpLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XHJcbiAgICAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAvL3ZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgICAgLy9rZXkgPSBcIiNcIiArIGtleTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgdmFyIGlzX3NhbWUgPSAoaHJlZiA9PSBrZXkpIDtcclxuICAgICAgICAgICAgaWYgKGlzX3NhbWUpeyAvL3VybF9oYXNoLmluZGV4T2YoXCIjXCIra2V5KSA9PSAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbmZvIGhyZWYgc3dpdGhjLS1cIiArIGhyZWYgKyBcIi0tXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJvb2xcIiwgaHJlZiA9PSBcInNlYWNoX2ZpbHRlclwiLCBocmVmLCBcInNlYWNoX2ZpbHRlclwiKTtcclxuICAgICAgICAgICAgc3dpdGNoIChocmVmKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2tleXdvcmRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfa2V5d29yZHMoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWFyY2hfc2ltaWxhclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX3NpbWlsYXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInRvZ2dsZV9maWx0ZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX3RvZ2dsZV9maWx0ZXIoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVfc2V0X3JhbmdlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9kYXRlX3NldF9yYW5nZShlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2FjaGVcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX2NhY2hlX3RvZ2dsZShlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNzLmxvZyhcIiMgc2VsZWN0aW9uIHdhcyAtIFwiICsgaHJlZik7ICAvLyBjb25zb2xlLmxvZyhcImhyZWZcIiwgaHJlZik7ICAvLyBjb25zb2xlLmxvZyhlbCk7ICAgLy9jcy5sb2coZWwuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIC8vIGludGVydmFsbCBvbkNsaWNrIHByb2Nlc3NpbmdcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gYWRkX2FuY2hvcl90YWdzX3RvX29uQ2xpY2tfcHJvY2Vzc2luZygpe1xyXG4gICAgICAgIC8vcmVwZWF0IHRoaXMgZWFjaCAwLjI1IHNlY29uZCAhISBidWcgdG9kbyByZWZhY1xyXG4gICAgICAgIHZhciBjb2xfYSA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkFcIikpO1xyXG4gICAgICAgIC8vdmFyIGxpc3RfYSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBjb2xfYSwgMCApO1xyXG4gICAgICAgIHZhciBsaXN0X2E6IGFueSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIGxpc3RfYS5wdXNoKGNvbF9hW2ldKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwibGlcIiwgbGlzdF9hKTsgLy9jb25zb2xlLmxvZyhcImxpXCIsIGNvbF9hLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIHsgLy8gaWYgeW91IGhhdmUgbmFtZWQgcHJvcGVydGllc1xyXG4gICAgICAgICAgICB2YXIgYW5jaCA9IGxpc3RfYVtpXTsgLy8gKDxhbnk+IHgpO1xyXG4gICAgICAgICAgICBhbmNoLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICAvL2FuY2guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHByb2Nlc3NfY2xpY2tfb3JfZW50ZXIsIGZhbHNlKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkX3N0YXJ0IDogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpO1xyXG4gICAgICAgIGRfc3RhcnQub25jaGFuZ2UgPSBkX3N0YXJ0X2NoYW5nZTtcclxuICAgICAgICB2YXIgZF9lbmQgOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpO1xyXG4gICAgICAgIGRfZW5kLm9uY2hhbmdlID0gZF9lbmRfY2hhbmdlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBmdW5jdGlvbiBzZXRfZ2xvYmFsX2ZpbHRlck9wdGlvbnNfZnJvbURhdGUoZDpzdHJpbmcpe1xyXG4gICAgICAgIC8vIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBkO1xyXG4gICAgICAgIC8vIC8vYnVnXHJcbiAgICAvLyB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGRfc3RhcnRfY2hhbmdlKCl7XHJcbiAgICAgICAgdmFyIGRhdGVfc3RhcnQgPSAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX3N0YXJ0XCIpICkudmFsdWU7XHJcbiAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMuZnJvbURhdGUgPSBkYXRlX3N0YXJ0O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2sgZGF0ZSBzdGFydFwiKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRfZW5kX2NoYW5nZSgpe1xyXG4gICAgICAgIHZhciBkYXRlX2VuZCA9ICggPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpICkudmFsdWU7XHJcbiAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9EYXRlID0gZGF0ZV9lbmQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGljayBkYXRlIGVuZFwiKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBvbl9sb2FkKCkge1xyXG4gICAgXHJcbiAgICAgICAgaW5pX3NldF9tZXRhRGF0YSgpO1xyXG4gICAgICAgIC8vIGFkZCBzb3VyY2UgXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2xvYmFsX2ZpbHRlck9wdGlvbnMgPSBuZXcgRmlsdGVyT3B0aW9ucygpO1xyXG5cclxuICAgICAgICAvL2dsb2JhbF9maWx0ZXJPcHRpb25zLnRvcGljcy5wdXNoKFwicG9saXRpY3NcIik7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3MucHVzaChcImJ1c2luZXNzXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMuc291cmNlcy5wdXNoKFwiY25uXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9EYXRlID0gXCIyMDE2LTEyLTI1XCI7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7IGFkZF9hbmNob3JfdGFnc190b19vbkNsaWNrX3Byb2Nlc3NpbmcoKTsgfSwgNTAwKTtcclxuICAgICAgICBcclxuICAgICAgICBmX3NlYXJjaF9rZXl3b3JkcygpO1xyXG4gICAgICAgXHJcbiAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgIC8vd2luZG93Lm9ubG9hZCA9IG9uX2xvYWQoKTtcclxuICAgICAgIFxyXG4gICAgICAgLy8jdHNjIC0td2F0Y2ggLXAganNcclxuICAgICAgIFxyXG4gICAgICAgLypcclxuICAgICAgICAgIGNsZWFuIHVwIGpzLCB0c1xyXG4gICAgICAgICAgLSBvbiBlbnRlciBzZWFyY2gsIGFkdmFuY2VkIHNlYXJjaFxyXG4gICAgICAgICAgLSBvZmZlciBkYXRlIHJhbmdlXHJcbiAgICAgICAgICAtIG9mZmVyIHRoZW1lcy90b3BpY3NcclxuICAgICAgICAgIC0gb2ZmZXIgbHVwZSBzaG93LCB1c2UgYmFja3JvdW5nIGltYWdlPz8gYmV0dGVyLCBiZWNhdXNlIGNzcyBjaGFuZ2ViYXJcclxuICAgICAgICAgIC0gb25jbGljayBhIGhyZWYgb3BlbiBjYWNoZSwgc2VhcmNoIHNpbWlsYXIgKGludGVydmFsbCBnZXQgbmV3IHVybCksIGV2ZW50IG5ldyBwYWdlPyBvbnBhZ2Vsb2FkP1xyXG4gICAgICAgICAgLSBvbiBcclxuICAgICAgICAgIC0gc2VuZCBwb3N0IGNsYXNzLCBiaW5kIGNsaWNrcyAuLi5cclxuICAgICAgICAgIC0gRmlsdGVyIGJ5IHRvcGljLCBieSBkYXRlXHJcbiAgICAgICAgICAtIGJ1dHRvbiAsIGJhbm5lciAsIHByb2dyZXNzIGJhciBmb3Igc2VhcmNoLCBzaG93IHBvc3QgaW5mbyAhIVxyXG4gICAgICAgICAgLSBmYXZvcml0ZSB0b3BpY3MgaW4gc2VwYXJ0ZS9maXJzdCBsaW5lICh3cml0ZSBteSBmYXZvcml0ZXM9ID8gb3Igbm90KVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIHRvcGljcyB5YSA8YT4gZm9yIGtleW1vdmVcclxuICAgICAgICAgIC0gdGVzdCBldmVyeXRoaW5nIGtleW1vdmVcclxuICAgICAgICAgIC0gZmlsdGVyLCBsdXBlIGtleW1vdmUgY29sb3JcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLSBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIGZpbHRlciBhZGQgPCA8IF5hcnJvdyBkb3duIGRhenUgYXVma2xhcHAgYXJyb3cgISFcclxuICAgICAgICAgIC0ganNvbiB0byBodG1sIGZvciByZXN1bHQgISFcclxuXHJcbiAgICAgICAgICBhcHBseSBmaWx0ZXJcclxuICAgICAgIFxyXG4gICAgICAgIC8vIHRvZG8gc2VhcmNoIG1vcmUgYnV0dG9uICEhXHJcbiAgICAgICAgLy8gdG9kbyBkb2t1LCBqcyBtaW5pIGtsYXNzZW5kaWFncmFtbSBcclxuICAgICAgICAgIFxyXG4gICAgICAgIC8vIGxvYWQgbWF0YURhdGEgKHNvdXJjZXMsIGFuZCB0b3BpY3MpIGJ1ZyB0b2RvIHNvdXJjZXMgXHJcbiAgICAgICAgXHJcbiAgICAgICAqL1xyXG4gICAgICAgXHJcbiAgICAgICAiLCIiXX0=
