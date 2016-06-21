import {Ajax} from "./Ajax";
import {FilterOptions} from "./FilterOptions";
import {HtmlBuilder} from "./HtmlBuilder";

class ArticleResult {
	errorMessage: string;
	articles: any[]; // TODO define Article when Article server class is stable
}

   //declare var $; bug, place this in definiton file?, how to embed other js docs=?

   var result = { 
      "cards": [
         {
            "action": {
               "type": "Source",
               "job": "This is a job",
            }
         },
         {
            "action": {
               "type": "Pource",
               "job": "This is a join",
            }
         },
      ]
   };
   
   

   class MyConsole {
       constructor() { }
       log(s : string) {
           console.log(""+s);
       }
       get(id : string){
           return document.getElementById(id);
       }
   };
   class ServerConnection {
       constructor() { }
       post(s: string) {
           cs.log(""+s);
           jl.log("post: "+s, "ntf");
       }
   };
   
   class JsLog {
       constructor() { }
       log(s:string,status_name:string) {
         //#json?? FF9838
         var status = ["err", "msg", "ntf" ];
         var status_display = ["Error", "Message", "Notification" ];
         var colors = ["FF6159", "FF9F51","22B8EB","","" ]; 
         //             orange  
            var jl = document.getElementById("js_log"); //in constructor rein
            var col_id = status.indexOf(status_name);
            // allert rasie bug , erro rif col_id < 0
            var status_display_name = status_display[col_id]
            s = s.replace("\n","<br>");
            s = status_display_name + "\n\n" + s;
            var txt = s.replace("\n","<br><br>");
            jl.innerHTML = txt;
            //jl.parentElement.style.background = "#"+colors[col_id];
            jl.style.borderColor = "#"+colors[col_id];
       }
       get(id : string){
           return document.getElementById(id);
       }
   };
   

   //var greeter = new Greeter("Hello, world!");
   // Excat order of these next commands is important 
   var cs = new MyConsole();    
   var jl = new JsLog();
   var conn = new ServerConnection();
   // var jl = document.getElementById("js_log"); bug why not here global
   /*
       $(document).ready(() => {
             console.log('ts 1');
    });
    window.onload
    */
    
         document.addEventListener("DOMContentLoaded", function(event) { 
            //var k = "kj";
            on_load();
        });
 var global_filterOptions : any; 
 function on_load(){
    global_filterOptions = new FilterOptions();
    var cs_log_ajax_hint = "___ajax___ ";
    global_filterOptions.topics.push("Politics");
    global_filterOptions.sources.push("cnn");
    global_filterOptions.toDate = "2016-12-25";
    //global_filterOptions.fromDate = "2000-12-25";
    Ajax.getByQuery("Tiger Woods", global_filterOptions, 0, 10)
        .done(function(result: ArticleResult) {
            if (result.errorMessage !== null) {
                console.log(cs_log_ajax_hint,result.errorMessage);
            } else {
                console.log(cs_log_ajax_hint,"Articles received:");
                for (let article of result.articles) {
                    console.log(cs_log_ajax_hint,article);
                    console.log(article.author);
                    
                    var list = <Node> document.getElementById("result_sample_list");
                    //var sample = (<Node> document.getElementById("result_sample") );
                    console.log(list);
                    HtmlBuilder.buildArticle(article,list);
                }
            }
        })
        .fail(function() {
            console.log(cs_log_ajax_hint,"Sending request failed!");
        });

      cs.log("hi ------ ");
      //cs.get("res").innerHTML = greeter.greet();
      
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
      //*/
      
      function element_set_display(id : string, val : string){
         var el = (<any> document.getElementById(id)  );
         el.style.display = val;
      }
      function element_show(id : string){
         element_set_display(id, "block");
      }
      function element_hide(id : string){
         //check status? raise error if hidden?
         element_set_display(id, "none");
      }
      
      function span_hidden_create(id : string,text : string){
         var el = document.getElementById(id);
         
         var elements_to_remove = el.getElementsByClassName("span_hidden");

         while (elements_to_remove[0]) {
             elements_to_remove[0].parentNode.removeChild(elements_to_remove[0]);
         }
         
         var e = (<any> document.createElement("span")  );
         e.id = "span_hidden_"+id;
         e.className = "span_hidden";
         e.innerHTML = text;
         e.style.display = "none";
         el.appendChild(e);
         console.log(e);
      }
      function span_hidden_delete(id : string){
         var el = document.getElementById(id);
         
         var elements_to_remove = el.getElementsByClassName("span_hidden");

         while (elements_to_remove[0]) {
             elements_to_remove[0].parentNode.removeChild(elements_to_remove[0]);
         }
      }
      
      
      function span_hidden_check(id : string,text : string){
         var el = document.getElementById(id);
         var bool = false;
         var span_list = el.getElementsByClassName("span_hidden");
         //el.getElementById("span_hidden_"+id);
         
         // Wenn kein Hidden Span da, dann wert immer falsch!!
         //bug assumes just one clas raise warnign if more classes !! , cleared, by check lenght == 1
         if ( span_list.length==1 ){
            var span = span_list[0];
            console.log(span.innerHTML, text);
            bool = ( ""+text == ""+span.innerHTML );
         }else{
         }
         cs.log(""+bool);
         return bool;
         
      }
      
      function f_search_keywords(el: any){ 
         var fld_search = document.getElementById("fld_search");
         var fld = (<HTMLInputElement> fld_search).value;
         var keywords = fld;
         conn.post(keywords);
      }
      
      function f_search_filter(el : any){ // bug key not used
         var check = span_hidden_check("filter_settings","state_show");
         if (check){
            element_hide("filter_settings");
            span_hidden_delete("filter_settings");
            jl.log("Filter \n is closing.","ntf");
         }else{
            element_show("filter_settings");
            span_hidden_create("filter_settings","state_show");
            jl.log("Filter \n is opening.","ntf");
         }
         //show hide, not toggle !!
      }
      var date_start = document.getElementById("date_start");
      var date_start_str =  (<HTMLInputElement> date_start).value.replace(/-/g, "/");
      var date_start_date = new Date(date_start_str);
      cs.log(""+date_start_date);
      cs.log(date_start_date.toString());
      
      function check_url_name(event : any){
         //var url_name = window.location;//.pathname;
         //cs.log(url_name);
         var url_hash = window.location.hash;//.pathname;
         console.log(url_hash); // does not work in ie?? !!!
         var key = "search_filter" ;
         if (url_hash.indexOf("#"+key) == 0){
            f_search_filter(key);
            cs.log(key);
         }
         //if #search_filter in url_hash
         //multiflag_last_hash = search_filter...
         //show fileter, seach keywords, show cache (grey, blue, black and white, theme all new cache, do post req.)
         // if keywords, post action = serach subaction = keywords data = keywords array, or cache_id request infos..., 
         // then show, post update grey are progress bar, filter infos get local storage filters__.., get filters from page? marked (span marke, real value, display...
       }
      
      function process_click_or_enter(ev : any){
         console.log(ev);
         el = this;

         // bad gives full href with link
         //var href = el.href; 
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
         console.log("info href swithc--"+href+"--");
         console.log("bool", href=="seach_filter", href, "seach_filter" );
         switch(href) {
            case "search_filter":
               f_search_filter(el);
               break;
            case "search_keywords":
               f_search_keywords(el);
               break;
            default:
               //default code block
               // do nothing
         } 
         
         
         cs.log("# selection was - "+href);
         console.log("href",href);
         console.log(el);
         //cs.log(el.getAttribute("href"));
      }
      
      var col_a = (<any> document.getElementsByTagName("A")  );
      //var list_a = Array.prototype.slice.call( col_a, 0 );
      var list_a: any = [];
      for(var i = 0; i < col_a.length; i++) list_a.push(col_a[i]);
      console.log( "li", list_a);
      console.log( "li", col_a.length);
      
      for(var i=0;i<col_a.length;i++) { // if you have named properties
         var anch = list_a[i]; // (<any> x);
         // todo bug, refac, check if class is normal link, then dont add any special onclick handling
         //console.log("i", anch);
         //var anch = (<any> list_a[i]  );
         anch.onclick=process_click_or_enter;
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
      
      //var anch = null;
      /*
      for(var x in result) { // if you have named properties
         anch = result[x];
      }
      */
      
      //document.getElementById('anchorID')
      //document.getElementById('anchorID').
      
       
      /*
      if (window.onpopstate != undefined) {
         window.onpopstate = check_url_name;
      } else {
         window.onhashchange = check_url_name;
      }
      */
      /*
      window.onpopstate = function(event) {
         //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
         check_url_name();
      };
      */
            /*
      
            bug add serach button search button
      
      window.addEventListener('popstate', listener);

        const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
      };
            
      var datestring = $("#date").val().replace(/-/g, "/");
      var date = new Date(datestring);
      //date.tostring());	
      var elements_sel= document.querySelectorAll('#Test, #Test *');
      .addEventListener('click', function() {
          alert('Hello world again!!!');
      }, false);
      */
      
      //$('.sys input[type=text], .sys select').each(function() {})

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
      - popstate io, IE ?? 
      
      - parse date, topic on server for validating !!
      - mark use of other author libraries !! for date !!, 
      - close filter x (hide filder / symbolP?)
      
      apply filter
   
   */
   
   