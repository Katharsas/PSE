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
    
        const tmp_clearfix = createElem("div","clearfix");
        
        var root = createElem("div","result");
        
            var topic = createElem("div","container_topic");
                var topic_button = createElem("div","myButton");
                addText( topic_button, article.topic );
            topic.appendChild(topic_button);
        
        root.appendChild( topic );
        
        root.appendChild( tmp_clearfix );
        
        
            var title = createElem("div","title");
                var a = <any> document.createElement('a');
                a.href = article.url;
                addText( a, article.title );
            title.appendChild(a);
        
        root.appendChild( title );
        
        
        
        
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

