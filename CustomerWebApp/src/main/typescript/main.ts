    /*
     *@auhor dbeckstein, jfranz
     */

    import {Ajax} from "./Ajax";
    import {FilterOptions} from "./FilterOptions";
    import {HtmlBuilder} from "./HtmlBuilder";

    class ArticleResult {
        errorMessage: string;
        articles: any[];
    }

    class MetadataResult {
        errorMessage: string;
        sources: string[];
        topics: string[];
    }

    class MyConsole {
        constructor() { }
        log(s: string) {
            console.log("" + s);
        }
        get(id: string) {
            return document.getElementById(id);
        }
    };

    class ServerConnection {
        constructor() { }
        post(s: string) {
            cs.log("" + s);
            jl.log("post: " + s, "ntf");
        }
    };

    class JsLog {
        constructor() { }
        log(s: string, status_name: string) {
            //#json?? FF9838
            var status = ["err", "msg", "ntf"];
            var status_display = ["Error", "Message", "Notification"];
            var colors = ["FF6159", "FF9F51", "22B8EB", "", ""]; 
            //             orange  
            var jl = document.getElementById("js_log"); //in constructor rein
            var col_id = status.indexOf(status_name);
            // allert rasie bug , erro rif col_id < 0
            var status_display_name = status_display[col_id]
            s = s.replace("\n", "<br>");
            s = status_display_name + "\n\n" + s;
            var txt = s.replace("\n", "<br><br>");
            jl.innerHTML = txt;
            //jl.parentElement.style.background = "#"+colors[col_id];
            jl.style.borderColor = "#" + colors[col_id];
        }
        get(id: string) {
            return document.getElementById(id);
        }
    };

    // Excat order of these next commands is important 
    var cs = new MyConsole();
    var jl = new JsLog();
    var conn = new ServerConnection();

    var global_filterOptions: any;

    document.addEventListener("DOMContentLoaded", function(event) { 
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
    
    function set_metaData(result: MetadataResult) {
        var topic_set: any = [];
        //topic_set = ["topic 1", "topic 2", "topic 3"];

        topic_set = result.topics;

        var topic_list = document.getElementById("select_topic_list");
        // check length 
        var children = topic_list.getElementsByTagName("li");
        //if children.lenght
        
        for (var i = 0; i < topic_set.length; i++) {
            var topicName = topic_set[i];
            var a = (<any> document.createElement('a'));
            a.href = "#toggle_filter"; // topics this, add to at
            //a.href = "#similar_id_" + article.articleId_str; //1123243
            a.setAttribute('data-filter-name', topicName);
            a.setAttribute('data-filter-type', "topic");
            a.onclick = process_click_or_enter;
            var el = (<Element> document.createElement('li'));
            var text_node = document.createTextNode(topicName);
            el.appendChild(text_node);
            a.appendChild(el);
            topic_list.appendChild(a);
        }  
    }
    
    // Loads metadata

    function ini_set_metaData(): any {
        var cs_log_ajax_hint_1 = "____new_ajax____";
        Ajax.getMetadata()
            .done(function(result: MetadataResult) {
                if (result.errorMessage !== null) {
                    console.log(cs_log_ajax_hint_1, result.errorMessage);
                } else {
                    console.log(cs_log_ajax_hint_1, "New topics received:");
                    console.log(cs_log_ajax_hint_1, result.topics);//.articles);
                    set_metaData(result);
                    //return result; //bug asynchronuos !!
                }
            })
            .fail(function() {
                console.log(cs_log_ajax_hint_1, "Sending request failed!");
            });
    }
    
    
        
        var list = document.getElementById("result_sample_list");
        list.innerHTML = "";
        var sample = document.getElementById("result_sample");


        for (var i = 0; i < 0; i++) { //bug
            var el = sample.cloneNode(true); // bug overwritten by ts
            list.appendChild(el);
        }
         
        function element_set_display(id: string, val: string) {
            var el = (<any> document.getElementById(id));
            el.style.display = val;
        }
        function element_show(id: string) {
            element_set_display(id, "block");
        }
        function element_hide(id: string) {
            //check status? raise error if hidden?
            element_set_display(id, "none");
        }

        function span_hidden_create(id: string, text: string) {
            var el = document.getElementById(id);

            var elements_to_remove = el.getElementsByClassName("span_hidden");

            while (elements_to_remove[0]) {
                elements_to_remove[0].parentNode.removeChild(elements_to_remove[0]);
            }

            var e = (<any> document.createElement("span"));
            e.id = "span_hidden_" + id;
            e.className = "span_hidden";
            e.innerHTML = text;
            e.style.display = "none";
            el.appendChild(e);
            console.log(e);
        }
        function span_hidden_delete(id: string) {
            var el = document.getElementById(id);

            var elements_to_remove = el.getElementsByClassName("span_hidden");

            while (elements_to_remove[0]) {
                elements_to_remove[0].parentNode.removeChild(elements_to_remove[0]);
            }
        }


        function span_hidden_check(id: string, text: string) {
            var el = document.getElementById(id);
            var bool = false;
            var span_list = el.getElementsByClassName("span_hidden");

            // Wenn kein Hidden Span da, dann wert immer falsch!!
            //bug assumes just one clas raise warnign if more classes !! , cleared, by check lenght == 1
            if (span_list.length == 1) {
                var span = span_list[0];
                console.log(span.innerHTML, text);
                bool = ("" + text == "" + span.innerHTML);
            } else {
            }
            cs.log("" + bool);
            return bool;

        }

        function f_search_keywords_old(el: any) {
            var fld_search = document.getElementById("fld_search");
            var fld = (<HTMLInputElement> fld_search).value;
            var keywords = fld;
            conn.post(keywords);
        }

        function f_search_keywords(el: any) {
            console.log("--------------search_demo----------");
           // on_load(); // bug todo ,
        }

        function f_search_filter(el: any) { // bug key not used
            var check = span_hidden_check("filter_settings", "state_show");
            if (check) {
                element_hide("filter_settings");
                span_hidden_delete("filter_settings");
                jl.log("Filter \n is closing.", "ntf");
            } else {
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

        function check_url_name(event: any) {
            //var url_name = window.location;//.pathname;
            //cs.log(url_name);
            var url_hash = window.location.hash;//.pathname;
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
        
        function f_search_similar(el : any){
            console.log("------similar----",el);
            var articleId  = el.getAttribute('data-articleId');
            console.log(articleId);
  
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
        }
        
        function f_date_set_range(el : any){
           var days_back_from_now = el.getAttribute('data-date-range-days');
            console.log(days_back_from_now);
            var date_end = new Date();
            //var ds = "" + d.toLocaleDateString("en-US");
            var date_end_str = (date_end.getFullYear() ) + "-" + date_end.getMonth() + "-" + date_end.getDate();
            ( <any>document.getElementById("date_end") ).value = date_end_str;
            var date_start = new Date();
            date_start.setDate(date_start.getDate() - days_back_from_now);
            //var date_start = date_end - 1;
            //days_back_from_now
            var date_start_str = (date_start.getFullYear() ) + "-" + date_start.getMonth() + "-" + date_start.getDate();
            ( <any>document.getElementById("date_start") ).value = date_start_str;
        }
        function css_hide(el:any){
            el.style.display = "none";
        }
        function css_show(el:any){
            el.style.display = "block";
        }
        
               
        function f_toggle_filter(el:any){
            console.log(el);
            
            console.log("------filter----",el);
            var type  = el.getAttribute('data-filter-type');
            var name  = el.getAttribute('data-filter-name');
            console.log(name);
            console.log(type);
        }
        
        function f_cache_toggle(el : any){
            console.log("------cache----",el);
            var id  = el.getAttribute('data-articleId');
            console.log(id);
            var pe : any = el.parentElement.parentElement.parentElement;
            var pid : any = pe.className;
            console.log(pe);
            console.log(pid);
            var e_con : any = pe.getElementsByClassName("content")[0];
            var e_con_cache : any = pe.getElementsByClassName("content_cache")[0];
            if (e_con_cache.style.display != "block"){
                css_show(e_con_cache);
                css_hide(e_con);
            }else{
                css_hide(e_con_cache);
                css_show(e_con);
            }
            console.log(e_con);
            
        }
        
        function process_click_or_enter(ev: any) {
            console.log(ev);
            el = this;

            // bad gives full href with link //var href = el.href; 
            // nice, gives raw href, from element only ( e.g. #search_filter, instead of www.google.com/#seach_filter)
            var href = (<any>el).getAttribute("href");
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
                // do nothing
            }

            // cs.log("# selection was - " + href);  // console.log("href", href);  // console.log(el);   //cs.log(el.getAttribute("href"));
        }
        
        
    

    function on_load() {
    
        // todo search more button !!
        // todo doku, js mini klassendiagramm 
          
        // load mataData (sources, and topics) bug todo sources 
        ini_set_metaData();
        
        setInterval(function(){ add_anchor_tags_to_onClick_processing(); }, 500);

        global_filterOptions = new FilterOptions();
        var cs_log_ajax_hint = "___ajax___ ";
        //global_filterOptions.topics.push("Politics");
        //global_filterOptions.sources.push("cnn");
        //global_filterOptions.toDate = "2016-12-25";
        //global_filterOptions.fromDate = "2000-12-25";
       
        var keywords = (<any>document.getElementById("fld_search")).value;
        console.log("_k_keyword__" + "-" + keywords + "-");
       
       // bug as function abkapseln
       
       Ajax.getByQuery(keywords, global_filterOptions, 0, 10)
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
        
        function add_anchor_tags_to_onClick_processing(){
            //repeat this each 0.25 second !! bug todo refac
            var col_a = (<any> document.getElementsByTagName("A"));
            //var list_a = Array.prototype.slice.call( col_a, 0 );
            var list_a: any = [];
            for (var i = 0; i < col_a.length; i++) list_a.push(col_a[i]);
            //console.log("li", list_a);
            //console.log("li", col_a.length);

            for (var i = 0; i < col_a.length; i++) { // if you have named properties
                var anch = list_a[i]; // (<any> x);
                // todo bug, refac, check if class is normal link, then dont add any special onclick handling
                //console.log("i", anch);
                //var anch = (<any> list_a[i]  );
                
                // bug todo refac bad important
                anch.onclick = process_click_or_enter;
                //anch.addEventListener("click", process_click_or_enter, false); 
                
                
                /*function(){/* some code * /
                   ( anch );
                }
                // Need this for IE, Chrome ?
                /* 
                anch.onkeypress=function(e){ //ie ??
                   if(e.which == 13){//Enter key pressed
                      process_click_or_enter( anch );
                   }
                }
                */

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
       
       