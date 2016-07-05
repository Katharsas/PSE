    /*
     *@auhor dbeckstein, jfranz
     */
     
     
    // Import typescript - classes
    
    import {Ajax} from "./Ajax";
    import {FilterOptions} from "./FilterOptions";
    import {HtmlBuilder} from "./HtmlBuilder";

    
    // Create local typescript - classes
    
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

    // JS-Logger for debugging
    
    class JsLog {
        constructor() { }
        log(s: string, status_name: string) {

            var status = ["err", "msg", "ntf"];
            var status_display = ["Error", "Message", "Notification"];
            var colors = ["FF6159", "FF9F51", "22B8EB", "", ""]; 

            var jl = document.getElementById("js_log"); 
            var col_id = status.indexOf(status_name);

            var status_display_name = status_display[col_id]
            s = s.replace("\n", "<br>");
            s = status_display_name + "\n\n" + s;
            var txt = s.replace("\n", "<br><br>");
            jl.innerHTML = txt;
            jl.style.borderColor = "#" + colors[col_id];
        }
        get(id: string) {
            return document.getElementById(id);
        }
    };

    // Exact order of these next commands is important 
    var cs = new MyConsole();
    var jl = new JsLog();
    var conn = new ServerConnection();
    
    var global_filterOptions: any;

    // Add event listener for DOMContentLoaded event - fires when all pages content is loaded
    
    document.addEventListener("DOMContentLoaded", function(event) { 
        on_load();
    });
    
    //Create list of metadata li elements
    
    function set_metaData(result: MetadataResult) {
        var topic_set: any = [];
        var source_set: any = [];

        console.log ("---now---",result.sources);
        topic_set = result.topics;
        source_set = result.sources;

        var topic_list = document.getElementById("select_topic_list");

        for (var i = 0; i < topic_set.length; i++) {
            var topicName = topic_set[i];
            var a = (<any> document.createElement('a'));
            a.href = "#toggle_filter"; 
            a.setAttribute('data-filter-name', topicName);
            a.setAttribute('data-filter-type', "topic");
            a.setAttribute('data-filter-selected', false);
            a.onclick = process_click_or_enter;
            var el = (<Element> document.createElement('li'));
            var text_node = document.createTextNode(topicName);
            el.appendChild(text_node);
            a.appendChild(el);
            topic_list.appendChild(a);
        }  
        
        var source_list = document.getElementById("select_source_list");

        for (var i = 0; i < source_set.length; i++) {
            var sourceName = source_set[i];
            var a = (<any> document.createElement('a'));
            
            a.setAttribute('data-filter-name', sourceName);
            a.setAttribute('data-filter-type', "source");
            a.setAttribute('data-filter-selected', false);
            a.onclick = process_click_or_enter;
            var el = (<Element> document.createElement('li'));
            var text_node = document.createTextNode(sourceName);
            el.appendChild(text_node);
            a.appendChild(el);
            source_list.appendChild(a);
        }  
    }
    
    // Loads results of metadata-request and displays them as tags

    function ini_set_metaData(): any {
        var cs_log_ajax_hint_1 = "____new_ajax____";
        Ajax.getMetadata()
            .done(function(result: MetadataResult) {
                if (result.errorMessage !== null) {
                    console.log(cs_log_ajax_hint_1, result.errorMessage);
                } else {
                    console.log(cs_log_ajax_hint_1, "New topics received:");
                    console.log(cs_log_ajax_hint_1, result.topics);//.articles);
                    console.log(cs_log_ajax_hint_1, "New sources received:");
                    console.log(cs_log_ajax_hint_1, result.sources);//.articles);
                    
                    set_metaData(result);
                    //return result; //bug asynchronuos !!
                }
            })
            .fail(function() {
                console.log(cs_log_ajax_hint_1, "Sending request failed!");
            });
    }
    
        // GUI functions hide, display multiple elements
    
        function element_set_display(id: string, val: string) {
            var el = (<any> document.getElementById(id));
            el.style.display = val;
        }
        function element_show(id: string) {
            element_set_display(id, "block");
        }
        function element_hide(id: string) {
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
        
        // Multiple functions trigger on onclick

        function f_search_keywords_old(el: any) {
            var fld_search = document.getElementById("fld_search");
            var fld = (<HTMLInputElement> fld_search).value;
            var keywords = fld;
            conn.post(keywords);
        }
        
        function util_empty_node(myNode : Node){
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
        }

        function f_search_keywords() {
            console.log("--------------search----------")
               
            var cs_log_ajax_hint = "___ajax___ ";
            var keywords = (<any>document.getElementById("fld_search")).value;
            console.log("_k_keyword__" + "-" + keywords + "-");

            Ajax.getByQuery(keywords, global_filterOptions, 0, 10)
                .done(function(result: ArticleResult) {
                    if (result.errorMessage !== null) {
                        console.log(cs_log_ajax_hint, result.errorMessage);
                    } else {
                        console.log(cs_log_ajax_hint, "Articles received:");
                        var list = <Node> document.getElementById("result_sample_list");
                        util_empty_node(list);
                        for (let article of result.articles) {
                            console.log(cs_log_ajax_hint, article);
                            console.log(article.author);
                            console.log(list);
                            HtmlBuilder.buildArticle(article, list);
                        }
                        
                        if (result.articles.length <= 0){
                            var tmp = (<Node> document.createTextNode("No results found"));
                            list.appendChild(tmp);
                        }
                        
                    }
                })
                .fail(function() {
                    console.log(cs_log_ajax_hint, "Sending request failed!");
                });

           
           
        }

        function f_search_filter(el: any) { 
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
        }
        
        function check_url_name(event: any) {

            var url_hash = window.location.hash;//.pathname;
            console.log(url_hash); // does not work in ie?? !!!
            var key = "search_filter";
            if (url_hash.indexOf("#" + key) == 0) {
                f_search_filter(key);
                cs.log(key);
            }
        }
        
        function f_search_similar(el : any){
            console.log("------similar----",el);
            var articleId  = el.getAttribute('data-articleId');
            console.log(articleId);
  
            var cs_log_ajax_hint = "___similar___";
            
               Ajax.getBySimilar(articleId, 0, 10)
                   .done(function(result: ArticleResult) {
                    if (result.errorMessage !== null) {
                        console.log(cs_log_ajax_hint, result.errorMessage);
                    } else {
                        console.log(cs_log_ajax_hint, "Articles received:");
                        var list = <Node> document.getElementById("result_sample_list");
                        util_empty_node(list);
                        for (let article of result.articles) {
                            console.log(cs_log_ajax_hint, article);
                            console.log(article.author);
                            console.log(list);
                            HtmlBuilder.buildArticle(article, list);
                        }
                        if (result.articles.length <= 0){
                            var tmp = (<Node> document.createTextNode("No results found"));
                            list.appendChild(tmp);
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

            var date_end_str = (date_end.getFullYear() ) + "-" + date_end.getMonth() + "-" + date_end.getDate();
            ( <any>document.getElementById("date_end") ).value = date_end_str;
            global_filterOptions.toDate = date_end_str;
            var date_start = new Date();
            date_start.setDate(date_start.getDate() - days_back_from_now);

            var date_start_str = (date_start.getFullYear() ) + "-" + date_start.getMonth() + "-" + date_start.getDate();
            ( <any>document.getElementById("date_start") ).value = date_start_str;
            global_filterOptions.fromDate = date_start_str;
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
            var isSelected  = el.getAttribute('data-filter-selected');
            var isSelected_pre = el.getAttribute('data-filter-selected');
            var filter : any;
            
            if (type == "topic"){
                filter = global_filterOptions.topics;
            }else{
                filter = global_filterOptions.sources;
            }
            if (isSelected==="true"){
                el.setAttribute('data-filter-selected', "false");
                var index = filter.indexOf(name);
                
                if ( index!==(-1) ){
                    filter.splice(index, 1); 
                }

            }else{
                el.setAttribute('data-filter-selected', "true");
                filter.push(name);
            }
            console.log(name);
            console.log(type);
            
            console.log("__filter__is________", isSelected);
            console.log("__filter__is__pre___", isSelected_pre);
            console.log("__filter__is________", filter);
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
        
        function f_cache_toggle_old(el : any){
            console.log("------cache----",el);
            var id  = el.getAttribute('data-articleId');
            console.log(id);
            var pe : any = el.parentElement.parentElement.parentElement;
            var pid : any = pe.className;
            console.log(pe);
            console.log(pid);
        }
        
        function process_click_or_enter(ev: any) {
            console.log(ev);
            var el = this;
            var href = (<any>el).getAttribute("href");
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
                // do nothing
            }

        }
        
    // intervall onClick processing
    
    function add_anchor_tags_to_onClick_processing(){
        //repeat this each 0.500 second
        var col_a = (<any> document.getElementsByTagName("A"));
        var list_a: any = [];
        for (var i = 0; i < col_a.length; i++) list_a.push(col_a[i]);
        
        for (var i = 0; i < col_a.length; i++) { 
            var anch = list_a[i]; 
            anch.onclick = process_click_or_enter;
        }
        var d_start : any = document.getElementById("date_start");
        d_start.onchange = d_start_change;
        var d_end : any = document.getElementById("date_end");
        d_end.onchange = d_end_change;
        
    }
    
    function d_start_change(){
        var date_start = ( <any>document.getElementById("date_start") ).value;
        global_filterOptions.fromDate = date_start;
        console.log("click date start");
    }
    function d_end_change(){
        var date_end = ( <any>document.getElementById("date_end") ).value;
        global_filterOptions.toDate = date_end;
        console.log("click date end");
    }
    
    // trigger functions on page load
    function on_load() {
    
        ini_set_metaData();
        
        global_filterOptions = new FilterOptions();
        
        setInterval(function(){ add_anchor_tags_to_onClick_processing(); }, 500);
        
        f_search_keywords();
       
    }
          