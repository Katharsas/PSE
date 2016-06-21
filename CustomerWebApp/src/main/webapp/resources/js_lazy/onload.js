
         document.addEventListener("DOMContentLoaded", function(event) { 
           //do work
            //run the code here
            // if needed set intervall until webshims is defined
            //console.log(webshims);
            //webshims.setOptions('forms-ext', {types: 'date'});
            //webshims.polyfill('forms forms-ext');
            
            //on_load();
            
            
            
            
            
    function post(json_obj,callback){
       const_post_url = "http://localhost:8080/CWA/post";
       
       json = JSON.stringify(json_obj);
       console.log("sending",json);
       
        //var search = {}
		//search["username"] = $("#username").val();
		//search["email"] = $("#email").val();

		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : const_post_url, //"${home}search/api/getSearchResult",
			//data : JSON.stringify(search),
			data : JSON.stringify(json_obj),
			dataType : 'json',
			timeout : 100000,
			success : function(data) {
				console.log("SUCCESS: ", data);
				console.log(data);
                resp_json_obj = data; //JSON.parse(data);
				console.log("resp_json_obj",resp_json_obj);
				console.log("resp_json_obj",resp_json_obj.action);
				console.log("resp_json_obj",resp_json_obj.words);
			},
			error : function(e) {
				console.log("ERROR: ", e);
			},
			done : function(e) {
				console.log("DONE");
				//enableSearchButton(true);
			}
		});
       /*
       $.post(const_post_url,
        json,
        function(data,status){
           callback(data,status);
       });
       */
       
    }  
    
    function returnData(data,status){
            ds = data.split("\n");
            console.log("data by line");
            console.log(ds);
            console.log("status of request");
            console.log(status);
            obj = JSON.parse(ds[0]);
            //console.log(obj.name,obj.street,obj.phone);
            console.log(obj.action, obj.words);
            //var obj = JSON.parse(text);
            /*
            if (ds.length > 2){
               action = ds[1];
               val  = ds[2];
            }
            */
               
            $('#log').innerHTML = "kj";
    }      
    
    function do_post(){
        //p =  {action:"action_name"};
        p =  {action:"search_by_keyword", words:"ktwitter barack obama"};
        post(p,returnData);
    }
    // bug here todo refac, do_post laufen lassen?
    
    //do_post();
            
            //$('.sys input[type=text], .sys select').each(function() {...})
            /*
               $('input[type=date]').click(function(){
               console.loge("kk");
                     
                     
               var dateString = $("#date").val().replace(/-/g, "/");
               var date = new Date(dateString);
               //date.toString());	
               cs.log(date);
         
            });
            */
  });
         
         // Just lazy on_load function here
         
         /*/
         function on__load(){
            on_load();
         }
         window.onload = function(){ on__load(); };
         
         
         +2 +7 */