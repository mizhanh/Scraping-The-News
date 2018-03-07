// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

//Function to scrape the NY Times
var scrape = function(){
   return axios.get("https://www.nytimes.com").then(function(res){
    var $ = cheerio.load(res.data);
    var articles = [];

    $(".theme-summary").each(function(i, element) {

      var headline = $(this)
          .children(".story-heading")
          .text()
          .trim();

      var link = $(this)
          .children(".story-heading")
          .children("a")
          .attr("href");

      var author = $(this)
          .children(".byline")
          .text()
          .trim();

      var summary = $(this)
          .children(".summary")
          .text()
          .trim();

      var articleData = {
        headline: headline,
        link: link,
        author: author,
        summary: summary
      };

      articles.push(articleData);
      console.log(articles);

    });
    return articles;

    });
  };

  // Export function
  module.exports = scrape;
