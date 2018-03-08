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
			$.alert({
				columnClass: 'col-md-6 col-md-offset-3',
				title: data.message,
				content: 'Happy Reading.',
				type: 'blue',
			});
			// console.log(data.message);
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
	// When no articles on homepage, display empty message
	//==================================================================================
	function renderEmpty() {
		var emptyDisplay = $("<div>");
		
		emptyDisplay.append('<h3>Uh Oh.  No new articles to display.  Try Scraping New Articles!');
		articleDisplay.append(emptyDisplay);
	}

	//=================================================================================
	// Set up how results will be displayed
	//==================================================================================
	function dataDisplay(article) {
		var display = $(
			[
			  "<div class='row'>",
			  "<div class='col-md-9'>",
			  	"<h2 style='font-size:20px; color:white; font-weight:bold; background-color:#ffe0b1; padding:10px;'>",
			  	"<a  class='article-link' target='_blank' href='" + article.link + "'>", article.headline,"</a>",
			  "</h2>",
			  "</div>",
        	  "<div class='col-md-2'>",
        		"<button style='background-color:#737373; color:#fff; font-size:14px; text-line:center; border-radius:8px; font-weight:400; border:2px solid #343a40; margin-top:30px;' class='btn save'>Save Article</button>",
        	  "</div>",
        	  "</div>",
        	  "<div class='col-md-9'>",
        		"<p style='font-size:10px'><span style='font-weight:med; margin-left:15px;' class ='article-author'>" + article.author + "</p>",
        		"<p style='font-size:16px'>" + "<span style='font-weight:med; margin-left:15px;' class ='article-summary'>" + article.summary + "</p>",
       		  "</div>",
       		  "<hr>",
       		  "</div>" 

			].join(""));
			display.data("_id", article._id);
			return display;
	}


	//=================================================================================
	// Data rendering function on the homepage
	//==================================================================================
	function renderArticles(articles) {
		
		var articleResults = [];

		for (var i = 0; i < 20; i++) {
			articleResults.push(dataDisplay(articles[i]))		
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


