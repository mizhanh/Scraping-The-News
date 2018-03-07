$(document).ready(function(){

	var articleDisplay = $("#articleDisplay");

	$(document).on("click", ".btn.save", savedArticles);

	initPage();

	//=================================================================================
	// Scrape new articles
	//==================================================================================
	$("#scrape").on("click", function(event){
		event.preventDefault();
	
		$.get("/api/fetch").then(function(data){
			initPage();
			// alert("Scrape 20 new articles!");		
			mbox.alert("<h2 class='text-center m-top-200'>" + data.message + "<h2>");
			console.log(data.message);
			renderArticles(data);
			
			});
		})

	//=================================================================================
	// Initialize the homepage
	//==================================================================================
	function initPage(){
		articleDisplay.empty();
		$.get("/api/headlines?saved=false").then(function(data) {
			if (data && data.length) {
				renderArticles(data);
			} else {
				renderEmpty();
			}
		})
	}

	//=================================================================================
	// Empty display function if no articles on homepage
	//==================================================================================
	function renderEmpty() {
		var emptyDisplay = $("<div>");
		
		emptyDisplay.append('<h3>Uh Oh.  No new articles to display.  Try Scraping New Articles!');
		articleDisplay.append(emptyDisplay);
	}

	//=================================================================================
	// Set up a panel for each article
	//==================================================================================
	function setPanel(article) {
		var panel = $(
			[
			  "<div class='row'>",
			  "<div class='col-md-10'>",
			  	"<h2 style='font-size:20px; color:white; font-weight:bold; background-color:#ffe0b1; padding:10px;'>",
			  	"<a  class='article-link' target='_blank' href='" + article.link + "'>", article.headline,"</a>",
			  "</h2>",
			  "</div>",
        	  "<div>",
        		"<button style='background-color:#737373; color:#fff; padding:6px 12px; font-size:14px; text-line:center; border-radius:8px; font-weight:400; border:2px solid #343a40;' class='btn save'>Save Article</button>",
        	  "</div>",
        	  "<div class='col-md-10'>",
        		"<p style='font-size:10px'><span style='font-weight:med; margin-left:15px; margin-top:10px;' class ='article-author'>" + article.author + "</p>",
        		"<p style='font-size:16px'>" + "<span style='font-weight:med; margin-left:15px; margin-top:5px;' class ='article-summary'>" + article.summary + "</p>",
       		  "</div>",
       		  "<hr>",
       		  "</div>" 

			].join(""));
			panel.data("_id", article._id);
			return panel;
	}


	//=================================================================================
	// Data rendering function on the homepage
	//==================================================================================
	function renderArticles(articles) {
		
		var articleResults = [];

		for (var i = 0; i < 20; i++) {
			articleResults.push(setPanel(articles[i]))		
		}

		articleDisplay.append(articleResults);
	}

	//=================================================================================
	// Save articles
	//==================================================================================
	function savedArticles() {
    
    	var articleToSave = $(this)
      	.parents(".row")
      	.data();

    	articleToSave.saved = true;

    	console.log(articleToSave);
    	
    	$.ajax({
      		method: "PUT",
      		url: "/api/headlines/" + articleToSave._id,
      		data: articleToSave
    	}).then(function(data) {
      	if (data.saved) {
        	initPage();
      }
    });
  }

  	




});


