//Controller for scraper
//==========================================================
var db = require("../models");
var scrape = require("../scripts/scrape");

module.exports = {
	scrapeTheNews: function(req, res) {
		//scrape the NY Times
		return scrape().then(function(articles){
			console.log(articles);
			//insert articles into the db
			return db.Headline.create(articles);
		
		}).then(function(dbHeadline){
				if (dbHeadline.length === 0) {
					res.json({
						message: "Uh oh, no news today!"
					});
				} else {
					res.json({
						message: "Added 20 new articles!"
					});
				}
			})
			.catch(function(err){
				res.json({
					message: "Scrape complete!"
				});
			});
	}
};