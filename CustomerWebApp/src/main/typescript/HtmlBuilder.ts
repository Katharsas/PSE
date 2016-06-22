function createElem(elName:string, clsName:string): any {
        var tmp = (<Element> document.createElement(elName)  );
        tmp.classList.add(clsName);
		return tmp;
	}

function addText(parent : any,txt : string){
        var tmp = (<Node> document.createTextNode(txt)  );
        parent.appendChild( tmp );
		//return tmp;
	}
    
    

export module HtmlBuilder{


    
	/**
	 * Build html li element from article object
	 * kkk
	 */
	export function buildArticle(article : any, parent : any){
    
        //var tmp_clearfix = createElem("div","clearfix");
        
        var root = createElem("div","result");
        
            var topic = createElem("div","container_topic");
                var topic_button = createElem("div","myButton");
                addText( topic_button, article.topic );
            topic.appendChild(topic_button);
        
        root.appendChild( topic );
        
        root.appendChild( createElem("div","clearfix") );
        
        
            var title = createElem("div","title");
                var a = <any> document.createElement('a');
                a.href = article.url;
                addText( a, article.title );
            title.appendChild(a);
        
        root.appendChild( title );
        
            var link = createElem("div","link");
                addText( link, article.url );        
        
        root.appendChild( link );
        
            var date = createElem("div","container_date");
                var date_button = createElem("div","myButton");
                var date_date = createElem("span","date");
                var raw_date = article.pubDate;
                
                //bug substr other behaviour than substring
                var date_y = raw_date.substring(0,4);
                // here firefox js browser bug on substr(5,7)
                var date_m = raw_date.substring(5,7).replace(/^0+(?!\.|$)/, '');
                var date_d = raw_date.substring(8,10).replace(/^0+(?!\.|$)/, '');

                var formatted_date = date_d + "." + date_m + "." + date_y
                addText( date_date, formatted_date );
                date_button.appendChild(date_date);
                //var date_time = createElem("span","time");
                //date_button.appendChild(date_time);
            date.appendChild(date_button);
        root.appendChild(date);
        
        root.appendChild( createElem("div","clearfix") );
        
            var content = createElem("div","content");
                addText( content, article.extractedText.substring(0,300));        
        
        root.appendChild( content );
        
            var author = createElem("div","author");
                addText( author, article.author );        
        
        root.appendChild( author );
        
        // img src="/CWA/resources/img/cache_arrow_down_small_grey.png";
        
        var container_buttons = createElem("div","container_buttons");
            // bug refac todo, here aufklappen langer text !
            var cache_button = createElem("div","myButton");
                 var a = <any> document.createElement('a');
                a.href = "#cache_id_1123243";
                var img = <any> document.createElement('img');
                img.src = "/CWA/resources/img/cache_arrow_down_small_grey.png";//"";
                a.appendChild(img);
                addText( a, "Cache" );
                
            cache_button.appendChild(a);
            container_buttons.appendChild(cache_button);
                
            var similar_button = createElem("div","myButton");
                 var a = <any> document.createElement('a');
                a.href = "#similar_id_1123243";
                addText( a, "Similar" );
            similar_button.appendChild(a);
                
            container_buttons.appendChild(similar_button);
            
        
        root.appendChild( container_buttons );
        
        root.appendChild( createElem("div","clearfix") );
        
        
        
        
        var _tmp = (<Node> document.createElement('span')  ); //: any;
        var el =  (<Node> document.createElement('li')  );
        var text_node = document.createTextNode("Topkic kk") ;
        el.appendChild( text_node );
        _tmp.appendChild(el);
        console.log("__builder__",_tmp);
		//parent.appendChild(_tmp);
        //return el;
        // unsauberer code, build und append trennen eventl?
        var li = (<Node> document.createElement('li')  );
        li.appendChild(root);
		parent.appendChild(li);
        //console.log("__builder__",root, topic);
        console.log("__builder__",li);
	}
    
    

}

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

