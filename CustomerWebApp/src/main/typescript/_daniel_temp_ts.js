  
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
                