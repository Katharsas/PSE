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
    //topic_set = ["topic 1", "topic 2", "topic 3"];
    topic_set = result.topics;
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
    // on_load(); // bug todo ,
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
    /*
  var list = document.getElementById("result_sample_list");
  list.innerHTML = "";
  var sample = document.getElementById("result_sample");
  
  var cs_log_ajax_hint = "___similar___";
  
     Ajax.getBySimilar(articleId, 0, 10)
          .done(function(result: ArticleResult) {
              if (result.errorMessage !== null) {
                  console.log(cs_log_ajax_hint, result.errorMessage);
              } else {
                  console.log(cs_log_ajax_hint, "Articles received:");
                  for (let article of result.articles) {
                      console.log(cs_log_ajax_hint, article);
                      console.log(article.author);

                      var list = <Node> document.getElementById("result_sample_list");
                      //var sample = (<Node> document.getElementById("result_sample") );
                      console.log(list);
                      HtmlBuilder.buildArticle(article, list);
                  }
              }
          })
          .fail(function() {
              console.log(cs_log_ajax_hint, "Sending request failed!");
          });
      
      */
}
function f_date_set_range(el) {
    var days_back_from_now = el.getAttribute('data-date-range-days');
    console.log(days_back_from_now);
    var date_end = new Date();
    //var ds = "" + d.toLocaleDateString("en-US");
    var date_end_str = (date_end.getFullYear()) + "-" + date_end.getMonth() + "-" + date_end.getDate();
    document.getElementById("date_end").value = date_end_str;
    var date_start = new Date();
    date_start.setDate(date_start.getDate() - days_back_from_now);
    //var date_start = date_end - 1;
    //days_back_from_now
    var date_start_str = (date_start.getFullYear()) + "-" + date_start.getMonth() + "-" + date_start.getDate();
    document.getElementById("date_start").value = date_start_str;
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
function on_load() {
    // todo search more button !!
    // todo doku, js mini klassendiagramm 
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
    // bug as function abkapseln
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0FqYXgudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0ZpbHRlck9wdGlvbnMudHMiLCJzcmMvbWFpbi90eXBlc2NyaXB0L0h0bWxCdWlsZGVyLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC9tYWluLnRzIiwic3JjL21haW4vdHlwZXNjcmlwdC90eXBpbmdzL2pxdWVyeS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUk7O0dBRUc7O0FBT1AsSUFBYyxJQUFJLENBK0RqQjtBQS9ERCxXQUFjLElBQUksRUFBQyxDQUFDO0lBQ2hCLGdEQUFnRDtJQUNuRCxJQUFNLE9BQU8sR0FBVyxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsSUFBTSxnQkFBZ0IsR0FBVyxVQUFVLEdBQUcsYUFBYSxDQUFDO0lBQzVELElBQU0sZUFBZSxHQUFXLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQztJQUNuRSxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBRXpELG9CQUEyQixLQUFhLEVBQUUsT0FBc0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtRQUM1RixJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFOUIsSUFBSSxZQUFZLEdBQVcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUks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QUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWE7WUFDbkMsNkZBQTZGO1lBQzdGLHlCQUF5QjtZQUN6QixpQ0FBaUM7WUFFakMsK0JBQStCO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUM7UUFnQjFDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUtFLDRCQUE0QjtBQUU1QixvQkFBb0I7QUFFcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXdCRTs7QUNwZlQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBqbW90aGVzXHJcbiAgICAgKi9cclxuXHJcblxyXG5pbXBvcnQge0ZpbHRlck9wdGlvbnN9IGZyb20gXCIuL0ZpbHRlck9wdGlvbnNcIjtcclxuXHJcbmRlY2xhcmUgdmFyIGNvbnRleHRVcmw6IHN0cmluZztcclxuXHJcbmV4cG9ydCBtb2R1bGUgQWpheCB7XHJcbiAgICAvL3ZhciBjb250ZXh0VXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvQ1dBL1wiO1xyXG5cdGNvbnN0IHVybEJhc2U6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldEFydGljbGVzL3NlYXJjaFwiO1xyXG5cdGNvbnN0IHVybEJhc2VfbWV0YWRhdGE6IHN0cmluZyA9IGNvbnRleHRVcmwgKyBcImdldE1ldGFkYXRhXCI7XHJcblx0Y29uc3QgdXJsQmFzZV9zaW1pbGFyOiBzdHJpbmcgPSBjb250ZXh0VXJsICsgXCJnZXRBcnRpY2xlcy9zaW1pbGFyXCI7XHJcblx0Y29uc3QgaGVhZGVycyA9IHsgYWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb24sKi8qO3E9MC44XCIgfTtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGdldEJ5UXVlcnkocXVlcnk6IFN0cmluZywgZmlsdGVyczogRmlsdGVyT3B0aW9ucywgc2tpcDogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogSlF1ZXJ5WEhSIHtcclxuXHRcdGxldCBwYXJhbXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRwYXJhbXMucHVzaChcInF1ZXJ5PVwiICsgcXVlcnkpO1xyXG5cclxuXHRcdGxldCBmaWx0ZXJQYXJhbXM6IHN0cmluZyA9IGZpbHRlcnMudG9VcmxQYXJhbSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19maWx0ZXJfX1wiLGZpbHRlclBhcmFtcyk7XHJcblx0XHRpZiAoZmlsdGVyUGFyYW1zICE9PSBcIlwiKSBwYXJhbXMucHVzaChmaWx0ZXJQYXJhbXMpO1xyXG5cclxuXHRcdHBhcmFtcy5wdXNoKFwicmFuZ2U9XCIgKyBza2lwICsgXCItXCIgKyBsaW1pdCk7XHJcblxyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZSArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG5cdFx0Ly8gVE9ETyBtYWtlIHhociByZXF1ZXN0LCByZXR1cm4ganFYSFJcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcbiAgICBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNZXRhZGF0YSgpOiBKUXVlcnlYSFIge1xyXG5cdFx0bGV0IHVybDogc3RyaW5nID0gdXJsQmFzZV9tZXRhZGF0YSA7XHJcblx0XHQvLyBUT0RPIG1ha2UgeGhyIHJlcXVlc3QsIHJldHVybiBqcVhIUiBcclxuXHRcdFxyXG5cdFx0bGV0IHNldHRpbmdzID0ge1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0aGVhZGVyczogaGVhZGVycyxcclxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG5cdFx0XHRjb250ZW50VHlwZTogZmFsc2UsXHJcblx0XHRcdHR5cGU6IFwiR0VUXCJcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0QnlTaW1pbGFyKGFydGljbGVJZDogU3RyaW5nLCBza2lwOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBKUXVlcnlYSFIge1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0cGFyYW1zLnB1c2goXCJpZD1cIiArIGFydGljbGVJZCk7XHJcblx0XHRwYXJhbXMucHVzaChcInJhbmdlPVwiICsgc2tpcCArIFwiLVwiICsgbGltaXQpO1xyXG5cclxuXHRcdGxldCB1cmw6IHN0cmluZyA9IHVybEJhc2Vfc2ltaWxhciArIFwiP1wiICsgcGFyYW1zLmpvaW4oXCImXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiX19nZXRCeUlkX19cIix1cmwpO1xyXG5cclxuXHRcdGxldCBzZXR0aW5ncyA9IHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXHJcblx0XHRcdHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuXHRcdFx0Y29udGVudFR5cGU6IGZhbHNlLFxyXG5cdFx0XHR0eXBlOiBcIkdFVFwiXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcblx0fVxyXG59IiwiICAgIC8qIFxyXG4gICAgICpAYXVob3Igam1vdGhlc1xyXG4gICAgICovXHJcblxyXG5leHBvcnQgY2xhc3MgRmlsdGVyT3B0aW9ucyB7XHJcblxyXG5cdHRvcGljczogc3RyaW5nW10gPSBbXTtcclxuXHRzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgXHJcbiAgICBmcm9tRGF0ZTogc3RyaW5nID0gXCIxOTgwLTAxLTAxXCI7XHJcblx0dG9EYXRlOiBzdHJpbmcgPSBcIjIwMjAtMDEtMDFcIjsgLy8gYnVnICwgYmV0dGVyIGRlZmF1bHRzID8gXHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBmaWx0ZXIgb3B0aW9ucyB0byB1cmwgcGFyYW1ldGVyIHN0cmluZyBvZiBmb3JtYXRcclxuXHQgKiBcInBhcmFtMT12YWx1ZTEmcGFyYW0yPXZhbHVlMiZwYXJhbTQ9dmFsdWUzXCIgZm9yIHVzZSBhcyB1cmwgcGFyYW1ldGVycy5cclxuXHQgKi9cclxuXHR0b1VybFBhcmFtKCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRvcGljcy5sZW5ndGggIT09IDApIHBhcmFtcy5wdXNoKFwidG9waWNzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMudG9waWNzKSk7XHJcblx0XHRpZiAodGhpcy5zb3VyY2VzLmxlbmd0aCAhPT0gMCkgcGFyYW1zLnB1c2goXCJzb3VyY2VzPVwiICsgdGhpcy5jb25jYXRNdWx0aVBhcmFtKHRoaXMuc291cmNlcykpO1xyXG5cdFx0aWYgKHRoaXMuZnJvbURhdGUgIT09IG51bGwpIHBhcmFtcy5wdXNoKFwiZnJvbT1cIiArIHRoaXMuZnJvbURhdGUpO1xyXG5cdFx0aWYgKHRoaXMudG9EYXRlICE9PSBudWxsKSBwYXJhbXMucHVzaChcInRvPVwiICsgdGhpcy50b0RhdGUpO1xyXG5cclxuXHRcdHJldHVybiBwYXJhbXMuam9pbihcIiZcIik7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGNvbmNhdE11bHRpUGFyYW0oYXJyYXk6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiBhcnJheS5qb2luKFwiO1wiKTtcclxuXHR9XHJcbn1cclxuIiwiICAgIC8qXHJcbiAgICAgKkBhdWhvciBkYmVja3N0ZWluLCBqZnJhbnpcclxuICAgICAqL1xyXG5cclxuICAgIC8vIHV0aWwgZnVuY3Rpb25zIGh0bWxCdWlsZGVyXHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbShlbE5hbWU6IHN0cmluZywgY2xzTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgdG1wID0gKDxFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsTmFtZSkpO1xyXG4gICAgICAgIHRtcC5jbGFzc0xpc3QuYWRkKGNsc05hbWUpO1xyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVGV4dChwYXJlbnQ6IGFueSwgdHh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdG1wID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodG1wKTtcclxuICAgICAgICAvL3JldHVybiB0bXA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBtb2R1bGUgSHRtbEJ1aWxkZXIge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkIGh0bWwgbGkgZWxlbWVudCBmcm9tIGFydGljbGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQXJ0aWNsZShhcnRpY2xlOiBhbnksIHBhcmVudDogYW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdmFyIHRtcF9jbGVhcmZpeCA9IGNyZWF0ZUVsZW0oXCJkaXZcIixcImNsZWFyZml4XCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHJvb3QgPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwicmVzdWx0XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvcGljID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl90b3BpY1wiKTtcclxuICAgICAgICAgICAgdmFyIHRvcGljX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYWRkVGV4dCh0b3BpY19idXR0b24sIGFydGljbGUudG9waWMpO1xyXG4gICAgICAgICAgICB0b3BpYy5hcHBlbmRDaGlsZCh0b3BpY19idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0b3BpYyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcInRpdGxlXCIpO1xyXG4gICAgICAgICAgICB2YXIgYSA9IDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gYXJ0aWNsZS51cmw7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgYXJ0aWNsZS50aXRsZSk7XHJcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGluayA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJsaW5rXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGxpbmssIGFydGljbGUudXJsLnN1YnN0cmluZygwLCA0NSkpO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gY3JlYXRlRWxlbShcImRpdlwiLCBcImNvbnRhaW5lcl9kYXRlXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9idXR0b24gPSBjcmVhdGVFbGVtKFwiZGl2XCIsIFwibXlCdXR0b25cIik7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2RhdGUgPSBjcmVhdGVFbGVtKFwic3BhblwiLCBcImRhdGVcIik7XHJcbiAgICAgICAgICAgIHZhciByYXdfZGF0ZSA9IGFydGljbGUucHViRGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9idWcgc3Vic3RyIG90aGVyIGJlaGF2aW91ciB0aGFuIHN1YnN0cmluZ1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV95ID0gcmF3X2RhdGUuc3Vic3RyaW5nKDAsIDQpO1xyXG4gICAgICAgICAgICAvLyBoZXJlIGZpcmVmb3gganMgYnJvd3NlciBidWcgb24gc3Vic3RyKDUsNylcclxuICAgICAgICAgICAgdmFyIGRhdGVfbSA9IHJhd19kYXRlLnN1YnN0cmluZyg1LCA3KS5yZXBsYWNlKC9eMCsoPyFcXC58JCkvLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRlX2QgPSByYXdfZGF0ZS5zdWJzdHJpbmcoOCwgMTApLnJlcGxhY2UoL14wKyg/IVxcLnwkKS8sICcnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRfZGF0ZSA9IGRhdGVfZCArIFwiLlwiICsgZGF0ZV9tICsgXCIuXCIgKyBkYXRlX3lcclxuICAgICAgICAgICAgYWRkVGV4dChkYXRlX2RhdGUsIGZvcm1hdHRlZF9kYXRlKTtcclxuICAgICAgICAgICAgZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV9kYXRlKTtcclxuICAgICAgICAgICAgLy92YXIgZGF0ZV90aW1lID0gY3JlYXRlRWxlbShcInNwYW5cIixcInRpbWVcIik7XHJcbiAgICAgICAgICAgIC8vZGF0ZV9idXR0b24uYXBwZW5kQ2hpbGQoZGF0ZV90aW1lKTtcclxuICAgICAgICAgICAgZGF0ZS5hcHBlbmRDaGlsZChkYXRlX2J1dHRvbik7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50XCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnQsIGFydGljbGUuZXh0cmFjdGVkVGV4dC5zdWJzdHJpbmcoMCwgMzAwKSk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudF9jYWNoZSA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250ZW50X2NhY2hlXCIpO1xyXG4gICAgICAgICAgICBhZGRUZXh0KGNvbnRlbnRfY2FjaGUsIGFydGljbGUuZXh0cmFjdGVkVGV4dCk7XHJcbiAgICAgICAgICAgIHZhciBicl90YWcgPSBjcmVhdGVFbGVtKFwiYnJcIixcIm5vdGhpbmdfc3BlY2lhbFwiKTtcclxuICAgICAgICAgICAgY29udGVudF9jYWNoZS5hcHBlbmRDaGlsZChicl90YWcpO1xyXG4gICAgICAgICAgICB2YXIgYnJfdGFnID0gY3JlYXRlRWxlbShcImJyXCIsXCJub3RoaW5nX3NwZWNpYWxcIik7XHJcbiAgICAgICAgICAgIGNvbnRlbnRfY2FjaGUuYXBwZW5kQ2hpbGQoYnJfdGFnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGFkZFRleHQoY29udGVudF9jYWNoZSwgYXJ0aWNsZS5zb3VyY2UpO1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRlbnRfY2FjaGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF1dGhvciA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJhdXRob3JcIik7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYXV0aG9yLCBhcnRpY2xlLmF1dGhvcik7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBpbWcgc3JjPVwiL0NXQS9yZXNvdXJjZXMvaW1nL2NhY2hlX2Fycm93X2Rvd25fc21hbGxfZ3JleS5wbmdcIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBjb250YWluZXJfYnV0dG9ucyA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjb250YWluZXJfYnV0dG9uc1wiKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBidWcgcmVmYWMgdG9kbywgaGVyZSBhdWZrbGFwcGVuIGxhbmdlciB0ZXh0ICFcclxuICAgICAgICAgICAgdmFyIGNhY2hlX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI2NhY2hlXCI7IC8vICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1hcnRpY2xlSWQnLCBhcnRpY2xlLmFydGljbGVJZF9zdHIpO1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gPGFueT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBcIi9DV0EvcmVzb3VyY2VzL2ltZy9jYWNoZV9hcnJvd19kb3duX3NtYWxsX2dyZXkucG5nXCI7Ly9cIlwiO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICAgICAgICAgIGFkZFRleHQoYSwgXCJDYWNoZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlX2J1dHRvbi5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoY2FjaGVfYnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaW1pbGFyX2J1dHRvbiA9IGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJteUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGEgPSA8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IFwiI3NlYXJjaF9zaW1pbGFyXCI7XHJcbiAgICAgICAgICAgIC8vYS5ocmVmID0gXCIjc2ltaWxhcl9pZF9cIiArIGFydGljbGUuYXJ0aWNsZUlkX3N0cjsgLy8xMTIzMjQzXHJcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcsIGFydGljbGUuYXJ0aWNsZUlkX3N0cik7XHJcbiAgICAgICAgICAgIC8vYS5vbmNsaWNrID0gcHJvY2Vzc19jbGlja19vcl9lbnRlcjtcclxuICAgICAgICAgICAgYWRkVGV4dChhLCBcIlNpbWlsYXJcIik7XHJcbiAgICAgICAgICAgIHNpbWlsYXJfYnV0dG9uLmFwcGVuZENoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgY29udGFpbmVyX2J1dHRvbnMuYXBwZW5kQ2hpbGQoc2ltaWxhcl9idXR0b24pO1xyXG5cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250YWluZXJfYnV0dG9ucyk7XHJcblxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNyZWF0ZUVsZW0oXCJkaXZcIiwgXCJjbGVhcmZpeFwiKSk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgX3RtcCA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpKTsgLy86IGFueTtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxOb2RlPiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKTtcclxuICAgICAgICAgICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiVG9wa2ljIGtrXCIpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBfdG1wLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJfX2J1aWxkZXJfX1wiLCBfdG1wKTtcclxuICAgICAgICAgICAgLy9wYXJlbnQuYXBwZW5kQ2hpbGQoX3RtcCk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGVsO1xyXG4gICAgICAgICAgICAvLyB1bnNhdWJlcmVyIGNvZGUsIGJ1aWxkIHVuZCBhcHBlbmQgdHJlbm5lbiBldmVudGw/XHJcbiAgICAgICAgICAgIHZhciBsaSA9ICg8Tm9kZT4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKHJvb3QpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIixyb290LCB0b3BpYyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX19idWlsZGVyX19cIiwgbGkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG5cclxuXHJcbiAgICAgICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgdmFyIHNhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZVwiKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8IDA7IGkrKyl7IC8vYnVnXHJcbiAgICAgICAgICAgICB2YXIgZWwgPSBzYW1wbGUuY2xvbmVOb2RlKHRydWUpOyAvLyBidWcgb3ZlcndyaXR0ZW4gYnkgdHNcclxuICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICAgLy9qbC5sb2coXCJUaGlzIHBvc3Qgd2FzXFxuXCIsXCJlcnJcIik7XHJcbiAgICAgICAgICAgICAvL2psLmxvZyhpLFwibXNnXCIpO1xyXG4gICAgICAgICAgICAgLy9jcy5sb2coaSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBidWcgZ2V0IHNvdXJjZXMgdG9kbyAhIVxyXG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPCAxNTsgaSsrKXtcclxuICAgICAgICAgICAgIHZhciBlbCA9ICAoPE5vZGU+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykgICk7XHJcbiAgICAgICAgICAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUb3BpYyBcIitpKSA7XHJcbiAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCggdGV4dF9ub2RlICk7XHJcbiAgICAgICAgICAgICB0b3BpY19saXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgIC8vY3MubG9nKGkpO1xyXG4gICAgICAgICAgICAgLy8gYnVnIGVycm9mIG9mIHR5cGVzY3JpcHQgPz9cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vXHJcbiAgICAgICAgICBcclxuICAgICAgKi9cclxuXHJcbiIsIiAgICAvKlxyXG4gICAgICpAYXVob3IgZGJlY2tzdGVpbiwgamZyYW56XHJcbiAgICAgKi9cclxuXHJcbiAgICBpbXBvcnQge0FqYXh9IGZyb20gXCIuL0FqYXhcIjtcclxuICAgIGltcG9ydCB7RmlsdGVyT3B0aW9uc30gZnJvbSBcIi4vRmlsdGVyT3B0aW9uc1wiO1xyXG4gICAgaW1wb3J0IHtIdG1sQnVpbGRlcn0gZnJvbSBcIi4vSHRtbEJ1aWxkZXJcIjtcclxuXHJcbiAgICBjbGFzcyBBcnRpY2xlUmVzdWx0IHtcclxuICAgICAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBhcnRpY2xlczogYW55W107XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTWV0YWRhdGFSZXN1bHQge1xyXG4gICAgICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgIHNvdXJjZXM6IHN0cmluZ1tdO1xyXG4gICAgICAgIHRvcGljczogc3RyaW5nW107XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTXlDb25zb2xlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIGxvZyhzOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIiArIHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2xhc3MgU2VydmVyQ29ubmVjdGlvbiB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBwb3N0KHM6IHN0cmluZykge1xyXG4gICAgICAgICAgICBjcy5sb2coXCJcIiArIHMpO1xyXG4gICAgICAgICAgICBqbC5sb2coXCJwb3N0OiBcIiArIHMsIFwibnRmXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2xhc3MgSnNMb2cge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgbG9nKHM6IHN0cmluZywgc3RhdHVzX25hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICAvLyNqc29uPz8gRkY5ODM4XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSBbXCJlcnJcIiwgXCJtc2dcIiwgXCJudGZcIl07XHJcbiAgICAgICAgICAgIHZhciBzdGF0dXNfZGlzcGxheSA9IFtcIkVycm9yXCIsIFwiTWVzc2FnZVwiLCBcIk5vdGlmaWNhdGlvblwiXTtcclxuICAgICAgICAgICAgdmFyIGNvbG9ycyA9IFtcIkZGNjE1OVwiLCBcIkZGOUY1MVwiLCBcIjIyQjhFQlwiLCBcIlwiLCBcIlwiXTsgXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIG9yYW5nZSAgXHJcbiAgICAgICAgICAgIHZhciBqbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfbG9nXCIpOyAvL2luIGNvbnN0cnVjdG9yIHJlaW5cclxuICAgICAgICAgICAgdmFyIGNvbF9pZCA9IHN0YXR1cy5pbmRleE9mKHN0YXR1c19uYW1lKTtcclxuICAgICAgICAgICAgLy8gYWxsZXJ0IHJhc2llIGJ1ZyAsIGVycm8gcmlmIGNvbF9pZCA8IDBcclxuICAgICAgICAgICAgdmFyIHN0YXR1c19kaXNwbGF5X25hbWUgPSBzdGF0dXNfZGlzcGxheVtjb2xfaWRdXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoXCJcXG5cIiwgXCI8YnI+XCIpO1xyXG4gICAgICAgICAgICBzID0gc3RhdHVzX2Rpc3BsYXlfbmFtZSArIFwiXFxuXFxuXCIgKyBzO1xyXG4gICAgICAgICAgICB2YXIgdHh0ID0gcy5yZXBsYWNlKFwiXFxuXCIsIFwiPGJyPjxicj5cIik7XHJcbiAgICAgICAgICAgIGpsLmlubmVySFRNTCA9IHR4dDtcclxuICAgICAgICAgICAgLy9qbC5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcIiNcIitjb2xvcnNbY29sX2lkXTtcclxuICAgICAgICAgICAgamwuc3R5bGUuYm9yZGVyQ29sb3IgPSBcIiNcIiArIGNvbG9yc1tjb2xfaWRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gRXhjYXQgb3JkZXIgb2YgdGhlc2UgbmV4dCBjb21tYW5kcyBpcyBpbXBvcnRhbnQgXHJcbiAgICB2YXIgY3MgPSBuZXcgTXlDb25zb2xlKCk7XHJcbiAgICB2YXIgamwgPSBuZXcgSnNMb2coKTtcclxuICAgIHZhciBjb25uID0gbmV3IFNlcnZlckNvbm5lY3Rpb24oKTtcclxuXHJcbiAgICB2YXIgZ2xvYmFsX2ZpbHRlck9wdGlvbnM6IGFueTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkgeyBcclxuICAgICAgICBvbl9sb2FkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hfZGVtbygpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tc2VhcmNoX2RlbW8tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgIG9uX2xvYWQoKTtcclxuICAgIH1cclxuICAgICAgICAvLyB0b2RvIGRhdGUgY2hhbmdlZCBpcyBpbiBodG1sXHJcbiAgICAgICAgLy8gTGlzdGVuIGZvciBjaGFuZ2VzIG9mIGRhdGVcclxuICAgIFxyXG4gICAgICAgIC8vIGZ1Y250aW9uIGRhdGVcclxuICAgICAgICBcclxuICAgICAgICAvLyB2YXIgZWxfZGF0ZV9zdGFydCA9IDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgICAvLyB2YXIgZWxfZGF0ZV9lbmQgPSA8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVfZW5kXCIpO1xyXG4gICAgICAgIC8vIGVsX2RhdGVfc3RhcnQub25ibHVyID0gZGF0ZV93YXNfY2hhbmdlZChlbF9kYXRlX3N0YXJ0KTtcclxuICAgICAgICAvLyBlbF9kYXRlX2VuZC5vbmJsdXIgPSBkYXRlX3dhc19jaGFuZ2VkKGVsX2RhdGVfZW5kKTtcclxuICAgIFxyXG4gICAgLy9DcmVhdGVzIGxpc3Qgb2YgbWV0YWRhdGEgbGkgZWxlbWVudHNcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gc2V0X21ldGFEYXRhKHJlc3VsdDogTWV0YWRhdGFSZXN1bHQpIHtcclxuICAgICAgICB2YXIgdG9waWNfc2V0OiBhbnkgPSBbXTtcclxuICAgICAgICAvL3RvcGljX3NldCA9IFtcInRvcGljIDFcIiwgXCJ0b3BpYyAyXCIsIFwidG9waWMgM1wiXTtcclxuXHJcbiAgICAgICAgdG9waWNfc2V0ID0gcmVzdWx0LnRvcGljcztcclxuXHJcbiAgICAgICAgdmFyIHRvcGljX2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdF90b3BpY19saXN0XCIpO1xyXG4gICAgICAgIC8vIGNoZWNrIGxlbmd0aCBcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0b3BpY19saXN0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlcIik7XHJcbiAgICAgICAgLy9pZiBjaGlsZHJlbi5sZW5naHRcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcGljX3NldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdG9waWNOYW1lID0gdG9waWNfc2V0W2ldO1xyXG4gICAgICAgICAgICB2YXIgYSA9ICg8YW55PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBcIiN0b2dnbGVfZmlsdGVyXCI7IC8vIHRvcGljcyB0aGlzLCBhZGQgdG8gYXRcclxuICAgICAgICAgICAgLy9hLmhyZWYgPSBcIiNzaW1pbGFyX2lkX1wiICsgYXJ0aWNsZS5hcnRpY2xlSWRfc3RyOyAvLzExMjMyNDNcclxuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLW5hbWUnLCB0b3BpY05hbWUpO1xyXG4gICAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScsIFwidG9waWNcIik7XHJcbiAgICAgICAgICAgIGEub25jbGljayA9IHByb2Nlc3NfY2xpY2tfb3JfZW50ZXI7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICg8RWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b3BpY05hbWUpO1xyXG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xyXG4gICAgICAgICAgICBhLmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICAgICAgdG9waWNfbGlzdC5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICB9ICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gTG9hZHMgbWV0YWRhdGFcclxuXHJcbiAgICBmdW5jdGlvbiBpbmlfc2V0X21ldGFEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnRfMSA9IFwiX19fX25ld19hamF4X19fX1wiO1xyXG4gICAgICAgIEFqYXguZ2V0TWV0YWRhdGEoKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IE1ldGFkYXRhUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgcmVzdWx0LmVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJOZXcgdG9waWNzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50XzEsIHJlc3VsdC50b3BpY3MpOy8vLmFydGljbGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRfbWV0YURhdGEocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiByZXN1bHQ7IC8vYnVnIGFzeW5jaHJvbnVvcyAhIVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnRfMSwgXCJTZW5kaW5nIHJlcXVlc3QgZmFpbGVkIVwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMDsgaSsrKSB7IC8vYnVnXHJcbiAgICAgICAgICAgIHZhciBlbCA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7IC8vIGJ1ZyBvdmVyd3JpdHRlbiBieSB0c1xyXG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gKDxhbnk+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfc2hvdyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGVsZW1lbnRfaGlkZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vY2hlY2sgc3RhdHVzPyByYWlzZSBlcnJvciBpZiBoaWRkZW4/XHJcbiAgICAgICAgICAgIGVsZW1lbnRfc2V0X2Rpc3BsYXkoaWQsIFwibm9uZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNwYW5faGlkZGVuX2NyZWF0ZShpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gKDxhbnk+IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpKTtcclxuICAgICAgICAgICAgZS5pZCA9IFwic3Bhbl9oaWRkZW5fXCIgKyBpZDtcclxuICAgICAgICAgICAgZS5jbGFzc05hbWUgPSBcInNwYW5faGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGUuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3Bhbl9oaWRkZW5fZGVsZXRlKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzX3RvX3JlbW92ZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzcGFuX2hpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c190b19yZW1vdmVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRzX3RvX3JlbW92ZVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRzX3RvX3JlbW92ZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcGFuX2hpZGRlbl9jaGVjayhpZDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgc3Bhbl9saXN0ID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNwYW5faGlkZGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2VubiBrZWluIEhpZGRlbiBTcGFuIGRhLCBkYW5uIHdlcnQgaW1tZXIgZmFsc2NoISFcclxuICAgICAgICAgICAgLy9idWcgYXNzdW1lcyBqdXN0IG9uZSBjbGFzIHJhaXNlIHdhcm5pZ24gaWYgbW9yZSBjbGFzc2VzICEhICwgY2xlYXJlZCwgYnkgY2hlY2sgbGVuZ2h0ID09IDFcclxuICAgICAgICAgICAgaWYgKHNwYW5fbGlzdC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwYW4gPSBzcGFuX2xpc3RbMF07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFuLmlubmVySFRNTCwgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICBib29sID0gKFwiXCIgKyB0ZXh0ID09IFwiXCIgKyBzcGFuLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3MubG9nKFwiXCIgKyBib29sKTtcclxuICAgICAgICAgICAgcmV0dXJuIGJvb2w7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZl9zZWFyY2hfa2V5d29yZHNfb2xkKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGZsZF9zZWFyY2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsZF9zZWFyY2hcIik7XHJcbiAgICAgICAgICAgIHZhciBmbGQgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+IGZsZF9zZWFyY2gpLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIga2V5d29yZHMgPSBmbGQ7XHJcbiAgICAgICAgICAgIGNvbm4ucG9zdChrZXl3b3Jkcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9rZXl3b3JkcyhlbDogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS1zZWFyY2hfZGVtby0tLS0tLS0tLS1cIik7XHJcbiAgICAgICAgICAgLy8gb25fbG9hZCgpOyAvLyBidWcgdG9kbyAsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9maWx0ZXIoZWw6IGFueSkgeyAvLyBidWcga2V5IG5vdCB1c2VkXHJcbiAgICAgICAgICAgIHZhciBjaGVjayA9IHNwYW5faGlkZGVuX2NoZWNrKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgaWYgKGNoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50X2hpZGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBzcGFuX2hpZGRlbl9kZWxldGUoXCJmaWx0ZXJfc2V0dGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICBqbC5sb2coXCJGaWx0ZXIgXFxuIGlzIGNsb3NpbmcuXCIsIFwibnRmXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudF9zaG93KFwiZmlsdGVyX3NldHRpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgc3Bhbl9oaWRkZW5fY3JlYXRlKFwiZmlsdGVyX3NldHRpbmdzXCIsIFwic3RhdGVfc2hvd1wiKTtcclxuICAgICAgICAgICAgICAgIGpsLmxvZyhcIkZpbHRlciBcXG4gaXMgb3BlbmluZy5cIiwgXCJudGZcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9zaG93IGhpZGUsIG5vdCB0b2dnbGUgISFcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy92YXIgZGF0ZV9zdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKTtcclxuICAgICAgICAvL3ZhciBkYXRlX3N0YXJ0X3N0ciA9ICg8SFRNTElucHV0RWxlbWVudD4gZGF0ZV9zdGFydCkudmFsdWUucmVwbGFjZSgvLS9nLCBcIi9cIik7XHJcbiAgICAgICAgLy92YXIgZGF0ZV9zdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZV9zdGFydF9zdHIpO1xyXG4gICAgICAgIC8vY3MubG9nKFwiXCIgKyBkYXRlX3N0YXJ0X2RhdGUpO1xyXG4gICAgICAgIC8vY3MubG9nKGRhdGVfc3RhcnRfZGF0ZS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tfdXJsX25hbWUoZXZlbnQ6IGFueSkge1xyXG4gICAgICAgICAgICAvL3ZhciB1cmxfbmFtZSA9IHdpbmRvdy5sb2NhdGlvbjsvLy5wYXRobmFtZTtcclxuICAgICAgICAgICAgLy9jcy5sb2codXJsX25hbWUpO1xyXG4gICAgICAgICAgICB2YXIgdXJsX2hhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDsvLy5wYXRobmFtZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codXJsX2hhc2gpOyAvLyBkb2VzIG5vdCB3b3JrIGluIGllPz8gISEhXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgICAgaWYgKHVybF9oYXNoLmluZGV4T2YoXCIjXCIgKyBrZXkpID09IDApIHtcclxuICAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihrZXkpO1xyXG4gICAgICAgICAgICAgICAgY3MubG9nKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9pZiAjc2VhcmNoX2ZpbHRlciBpbiB1cmxfaGFzaFxyXG4gICAgICAgICAgICAvL211bHRpZmxhZ19sYXN0X2hhc2ggPSBzZWFyY2hfZmlsdGVyLi4uXHJcbiAgICAgICAgICAgIC8vc2hvdyBmaWxldGVyLCBzZWFjaCBrZXl3b3Jkcywgc2hvdyBjYWNoZSAoZ3JleSwgYmx1ZSwgYmxhY2sgYW5kIHdoaXRlLCB0aGVtZSBhbGwgbmV3IGNhY2hlLCBkbyBwb3N0IHJlcS4pXHJcbiAgICAgICAgICAgIC8vIGlmIGtleXdvcmRzLCBwb3N0IGFjdGlvbiA9IHNlcmFjaCBzdWJhY3Rpb24gPSBrZXl3b3JkcyBkYXRhID0ga2V5d29yZHMgYXJyYXksIG9yIGNhY2hlX2lkIHJlcXVlc3QgaW5mb3MuLi4sIFxyXG4gICAgICAgICAgICAvLyB0aGVuIHNob3csIHBvc3QgdXBkYXRlIGdyZXkgYXJlIHByb2dyZXNzIGJhciwgZmlsdGVyIGluZm9zIGdldCBsb2NhbCBzdG9yYWdlIGZpbHRlcnNfXy4uLCBnZXQgZmlsdGVycyBmcm9tIHBhZ2U/IG1hcmtlZCAoc3BhbiBtYXJrZSwgcmVhbCB2YWx1ZSwgZGlzcGxheS4uLlxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX3NlYXJjaF9zaW1pbGFyKGVsIDogYW55KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1zaW1pbGFyLS0tLVwiLGVsKTtcclxuICAgICAgICAgICAgdmFyIGFydGljbGVJZCAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXJ0aWNsZUlkJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGVJZCk7XHJcbiAgICAgICAgICAgICAgLyogIFxyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0X3NhbXBsZV9saXN0XCIpO1xyXG4gICAgICAgICAgICBsaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBzYW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgY3NfbG9nX2FqYXhfaGludCA9IFwiX19fc2ltaWxhcl9fX1wiO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgQWpheC5nZXRCeVNpbWlsYXIoYXJ0aWNsZUlkLCAwLCAxMClcclxuICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXN1bHQ6IEFydGljbGVSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvck1lc3NhZ2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3NfbG9nX2FqYXhfaGludCwgXCJBcnRpY2xlcyByZWNlaXZlZDpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIGFydGljbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuYXV0aG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSA8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgc2FtcGxlID0gKDxOb2RlPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdF9zYW1wbGVcIikgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIdG1sQnVpbGRlci5idWlsZEFydGljbGUoYXJ0aWNsZSwgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIlNlbmRpbmcgcmVxdWVzdCBmYWlsZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2RhdGVfc2V0X3JhbmdlKGVsIDogYW55KXtcclxuICAgICAgICAgICB2YXIgZGF5c19iYWNrX2Zyb21fbm93ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUtcmFuZ2UtZGF5cycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXlzX2JhY2tfZnJvbV9ub3cpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAvL3ZhciBkcyA9IFwiXCIgKyBkLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9lbmRfc3RyID0gKGRhdGVfZW5kLmdldEZ1bGxZZWFyKCkgKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0TW9udGgoKSArIFwiLVwiICsgZGF0ZV9lbmQuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICAoIDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlX2VuZFwiKSApLnZhbHVlID0gZGF0ZV9lbmRfc3RyO1xyXG4gICAgICAgICAgICB2YXIgZGF0ZV9zdGFydCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGRhdGVfc3RhcnQuc2V0RGF0ZShkYXRlX3N0YXJ0LmdldERhdGUoKSAtIGRheXNfYmFja19mcm9tX25vdyk7XHJcbiAgICAgICAgICAgIC8vdmFyIGRhdGVfc3RhcnQgPSBkYXRlX2VuZCAtIDE7XHJcbiAgICAgICAgICAgIC8vZGF5c19iYWNrX2Zyb21fbm93XHJcbiAgICAgICAgICAgIHZhciBkYXRlX3N0YXJ0X3N0ciA9IChkYXRlX3N0YXJ0LmdldEZ1bGxZZWFyKCkgKSArIFwiLVwiICsgZGF0ZV9zdGFydC5nZXRNb250aCgpICsgXCItXCIgKyBkYXRlX3N0YXJ0LmdldERhdGUoKTtcclxuICAgICAgICAgICAgKCA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZV9zdGFydFwiKSApLnZhbHVlID0gZGF0ZV9zdGFydF9zdHI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNzc19oaWRlKGVsOmFueSl7XHJcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY3NzX3Nob3coZWw6YW55KXtcclxuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZfdG9nZ2xlX2ZpbHRlcihlbDphbnkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLWZpbHRlci0tLS1cIixlbCk7XHJcbiAgICAgICAgICAgIHZhciB0eXBlICA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItdHlwZScpO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLW5hbWUnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmX2NhY2hlX3RvZ2dsZShlbCA6IGFueSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tY2FjaGUtLS0tXCIsZWwpO1xyXG4gICAgICAgICAgICB2YXIgaWQgID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFydGljbGVJZCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgICAgIHZhciBwZSA6IGFueSA9IGVsLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICB2YXIgcGlkIDogYW55ID0gcGUuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBpZCk7XHJcbiAgICAgICAgICAgIHZhciBlX2NvbiA6IGFueSA9IHBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb250ZW50XCIpWzBdO1xyXG4gICAgICAgICAgICB2YXIgZV9jb25fY2FjaGUgOiBhbnkgPSBwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29udGVudF9jYWNoZVwiKVswXTtcclxuICAgICAgICAgICAgaWYgKGVfY29uX2NhY2hlLnN0eWxlLmRpc3BsYXkgIT0gXCJibG9ja1wiKXtcclxuICAgICAgICAgICAgICAgIGNzc19zaG93KGVfY29uX2NhY2hlKTtcclxuICAgICAgICAgICAgICAgIGNzc19oaWRlKGVfY29uKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjc3NfaGlkZShlX2Nvbl9jYWNoZSk7XHJcbiAgICAgICAgICAgICAgICBjc3Nfc2hvdyhlX2Nvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coZV9jb24pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc19jbGlja19vcl9lbnRlcihldjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2KTtcclxuICAgICAgICAgICAgZWwgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gYmFkIGdpdmVzIGZ1bGwgaHJlZiB3aXRoIGxpbmsgLy92YXIgaHJlZiA9IGVsLmhyZWY7IFxyXG4gICAgICAgICAgICAvLyBuaWNlLCBnaXZlcyByYXcgaHJlZiwgZnJvbSBlbGVtZW50IG9ubHkgKCBlLmcuICNzZWFyY2hfZmlsdGVyLCBpbnN0ZWFkIG9mIHd3dy5nb29nbGUuY29tLyNzZWFjaF9maWx0ZXIpXHJcbiAgICAgICAgICAgIHZhciBocmVmID0gKDxhbnk+ZWwpLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XHJcbiAgICAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAvL3ZhciBrZXkgPSBcInNlYXJjaF9maWx0ZXJcIjtcclxuICAgICAgICAgICAgLy9rZXkgPSBcIiNcIiArIGtleTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgdmFyIGlzX3NhbWUgPSAoaHJlZiA9PSBrZXkpIDtcclxuICAgICAgICAgICAgaWYgKGlzX3NhbWUpeyAvL3VybF9oYXNoLmluZGV4T2YoXCIjXCIra2V5KSA9PSAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbmZvIGhyZWYgc3dpdGhjLS1cIiArIGhyZWYgKyBcIi0tXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJvb2xcIiwgaHJlZiA9PSBcInNlYWNoX2ZpbHRlclwiLCBocmVmLCBcInNlYWNoX2ZpbHRlclwiKTtcclxuICAgICAgICAgICAgc3dpdGNoIChocmVmKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfc2VhcmNoX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VhcmNoX2tleXdvcmRzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfa2V5d29yZHMoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlYXJjaF9zaW1pbGFyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZl9zZWFyY2hfc2ltaWxhcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidG9nZ2xlX2ZpbHRlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfdG9nZ2xlX2ZpbHRlcihlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZV9zZXRfcmFuZ2VcIjpcclxuICAgICAgICAgICAgICAgICAgICBmX2RhdGVfc2V0X3JhbmdlKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJjYWNoZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGZfY2FjaGVfdG9nZ2xlKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY3MubG9nKFwiIyBzZWxlY3Rpb24gd2FzIC0gXCIgKyBocmVmKTsgIC8vIGNvbnNvbGUubG9nKFwiaHJlZlwiLCBocmVmKTsgIC8vIGNvbnNvbGUubG9nKGVsKTsgICAvL2NzLmxvZyhlbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICBcclxuXHJcbiAgICBmdW5jdGlvbiBvbl9sb2FkKCkge1xyXG4gICAgXHJcbiAgICAgICAgLy8gdG9kbyBzZWFyY2ggbW9yZSBidXR0b24gISFcclxuICAgICAgICAvLyB0b2RvIGRva3UsIGpzIG1pbmkga2xhc3NlbmRpYWdyYW1tIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgLy8gbG9hZCBtYXRhRGF0YSAoc291cmNlcywgYW5kIHRvcGljcykgYnVnIHRvZG8gc291cmNlcyBcclxuICAgICAgICBpbmlfc2V0X21ldGFEYXRhKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgYWRkX2FuY2hvcl90YWdzX3RvX29uQ2xpY2tfcHJvY2Vzc2luZygpOyB9LCA1MDApO1xyXG5cclxuICAgICAgICBnbG9iYWxfZmlsdGVyT3B0aW9ucyA9IG5ldyBGaWx0ZXJPcHRpb25zKCk7XHJcbiAgICAgICAgdmFyIGNzX2xvZ19hamF4X2hpbnQgPSBcIl9fX2FqYXhfX18gXCI7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy50b3BpY3MucHVzaChcIlBvbGl0aWNzXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMuc291cmNlcy5wdXNoKFwiY25uXCIpO1xyXG4gICAgICAgIC8vZ2xvYmFsX2ZpbHRlck9wdGlvbnMudG9EYXRlID0gXCIyMDE2LTEyLTI1XCI7XHJcbiAgICAgICAgLy9nbG9iYWxfZmlsdGVyT3B0aW9ucy5mcm9tRGF0ZSA9IFwiMjAwMC0xMi0yNVwiO1xyXG4gICAgICAgXHJcbiAgICAgICAgdmFyIGtleXdvcmRzID0gKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGRfc2VhcmNoXCIpKS52YWx1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIl9rX2tleXdvcmRfX1wiICsgXCItXCIgKyBrZXl3b3JkcyArIFwiLVwiKTtcclxuICAgICAgIFxyXG4gICAgICAgLy8gYnVnIGFzIGZ1bmN0aW9uIGFia2Fwc2VsblxyXG4gICAgICAgXHJcbiAgICAgICBBamF4LmdldEJ5UXVlcnkoa2V5d29yZHMsIGdsb2JhbF9maWx0ZXJPcHRpb25zLCAwLCAxMClcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzdWx0OiBBcnRpY2xlUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yTWVzc2FnZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIHJlc3VsdC5lcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBcIkFydGljbGVzIHJlY2VpdmVkOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhcnRpY2xlIG9mIHJlc3VsdC5hcnRpY2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjc19sb2dfYWpheF9oaW50LCBhcnRpY2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJ0aWNsZS5hdXRob3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSA8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlX2xpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHNhbXBsZSA9ICg8Tm9kZT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRfc2FtcGxlXCIpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBIdG1sQnVpbGRlci5idWlsZEFydGljbGUoYXJ0aWNsZSwgbGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNzX2xvZ19hamF4X2hpbnQsIFwiU2VuZGluZyByZXF1ZXN0IGZhaWxlZCFcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZF9hbmNob3JfdGFnc190b19vbkNsaWNrX3Byb2Nlc3NpbmcoKXtcclxuICAgICAgICAgICAgLy9yZXBlYXQgdGhpcyBlYWNoIDAuMjUgc2Vjb25kICEhIGJ1ZyB0b2RvIHJlZmFjXHJcbiAgICAgICAgICAgIHZhciBjb2xfYSA9ICg8YW55PiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkFcIikpO1xyXG4gICAgICAgICAgICAvL3ZhciBsaXN0X2EgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggY29sX2EsIDAgKTtcclxuICAgICAgICAgICAgdmFyIGxpc3RfYTogYW55ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sX2EubGVuZ3RoOyBpKyspIGxpc3RfYS5wdXNoKGNvbF9hW2ldKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImxpXCIsIGxpc3RfYSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJsaVwiLCBjb2xfYS5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xfYS5sZW5ndGg7IGkrKykgeyAvLyBpZiB5b3UgaGF2ZSBuYW1lZCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICB2YXIgYW5jaCA9IGxpc3RfYVtpXTsgLy8gKDxhbnk+IHgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdG9kbyBidWcsIHJlZmFjLCBjaGVjayBpZiBjbGFzcyBpcyBub3JtYWwgbGluaywgdGhlbiBkb250IGFkZCBhbnkgc3BlY2lhbCBvbmNsaWNrIGhhbmRsaW5nXHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiaVwiLCBhbmNoKTtcclxuICAgICAgICAgICAgICAgIC8vdmFyIGFuY2ggPSAoPGFueT4gbGlzdF9hW2ldICApO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBidWcgdG9kbyByZWZhYyBiYWQgaW1wb3J0YW50XHJcbiAgICAgICAgICAgICAgICBhbmNoLm9uY2xpY2sgPSBwcm9jZXNzX2NsaWNrX29yX2VudGVyO1xyXG4gICAgICAgICAgICAgICAgLy9hbmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcm9jZXNzX2NsaWNrX29yX2VudGVyLCBmYWxzZSk7IFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8qZnVuY3Rpb24oKXsvKiBzb21lIGNvZGUgKiAvXHJcbiAgICAgICAgICAgICAgICAgICAoIGFuY2ggKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIE5lZWQgdGhpcyBmb3IgSUUsIENocm9tZSA/XHJcbiAgICAgICAgICAgICAgICAvKiBcclxuICAgICAgICAgICAgICAgIGFuY2gub25rZXlwcmVzcz1mdW5jdGlvbihlKXsgLy9pZSA/P1xyXG4gICAgICAgICAgICAgICAgICAgaWYoZS53aGljaCA9PSAxMyl7Ly9FbnRlciBrZXkgcHJlc3NlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc19jbGlja19vcl9lbnRlciggYW5jaCApO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgIC8vd2luZG93Lm9ubG9hZCA9IG9uX2xvYWQoKTtcclxuICAgICAgIFxyXG4gICAgICAgLy8jdHNjIC0td2F0Y2ggLXAganNcclxuICAgICAgIFxyXG4gICAgICAgLypcclxuICAgICAgICAgIGNsZWFuIHVwIGpzLCB0c1xyXG4gICAgICAgICAgLSBvbiBlbnRlciBzZWFyY2gsIGFkdmFuY2VkIHNlYXJjaFxyXG4gICAgICAgICAgLSBvZmZlciBkYXRlIHJhbmdlXHJcbiAgICAgICAgICAtIG9mZmVyIHRoZW1lcy90b3BpY3NcclxuICAgICAgICAgIC0gb2ZmZXIgbHVwZSBzaG93LCB1c2UgYmFja3JvdW5nIGltYWdlPz8gYmV0dGVyLCBiZWNhdXNlIGNzcyBjaGFuZ2ViYXJcclxuICAgICAgICAgIC0gb25jbGljayBhIGhyZWYgb3BlbiBjYWNoZSwgc2VhcmNoIHNpbWlsYXIgKGludGVydmFsbCBnZXQgbmV3IHVybCksIGV2ZW50IG5ldyBwYWdlPyBvbnBhZ2Vsb2FkP1xyXG4gICAgICAgICAgLSBvbiBcclxuICAgICAgICAgIC0gc2VuZCBwb3N0IGNsYXNzLCBiaW5kIGNsaWNrcyAuLi5cclxuICAgICAgICAgIC0gRmlsdGVyIGJ5IHRvcGljLCBieSBkYXRlXHJcbiAgICAgICAgICAtIGJ1dHRvbiAsIGJhbm5lciAsIHByb2dyZXNzIGJhciBmb3Igc2VhcmNoLCBzaG93IHBvc3QgaW5mbyAhIVxyXG4gICAgICAgICAgLSBmYXZvcml0ZSB0b3BpY3MgaW4gc2VwYXJ0ZS9maXJzdCBsaW5lICh3cml0ZSBteSBmYXZvcml0ZXM9ID8gb3Igbm90KVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIHRvcGljcyB5YSA8YT4gZm9yIGtleW1vdmVcclxuICAgICAgICAgIC0gdGVzdCBldmVyeXRoaW5nIGtleW1vdmVcclxuICAgICAgICAgIC0gZmlsdGVyLCBsdXBlIGtleW1vdmUgY29sb3JcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLSBidWcgYWRkIHNlcmFjaCBidXR0b24gc2VhcmNoIGJ1dHRvblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAtIGZpbHRlciBhZGQgPCA8IF5hcnJvdyBkb3duIGRhenUgYXVma2xhcHAgYXJyb3cgISFcclxuICAgICAgICAgIC0ganNvbiB0byBodG1sIGZvciByZXN1bHQgISFcclxuXHJcbiAgICAgICAgICBhcHBseSBmaWx0ZXJcclxuICAgICAgIFxyXG4gICAgICAgKi9cclxuICAgICAgIFxyXG4gICAgICAgIiwiIl19
