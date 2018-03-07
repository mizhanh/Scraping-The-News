// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

//Require our routes
var routes = require("./routes");

//Public folder as static directory
app.use(express.static("public"));

// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

var MONGODB_URI = "mongodb://<dbuser>:<dbpassword>@ds257838.mlab.com:57838/heroku_sjcd465h";

mongoose.Promise = Promise;
var mongoDB = process.env.MONGODB_URI || "mongodb://localhost/Scraping-The-News";
mongoose.connect(mongoDB, function(error){
	if (error) throw error;
	useMongoClient: true;
	console.log("Mongoose connection is successful!");
});


// Listen on port 8080
app.listen(PORT, function() {
  console.log("App running on port 8080!");
});
