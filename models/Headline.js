
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new HeadlineSchema object
var headlineSchema = new Schema({
  // `headline` is required and of type String
  headline: {
    type: String,
    required: true,
    unique: {index: {unique: true}}
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  author: {
  	type: String,
    require: true
  },
  summary: {
  	type: String,
  	required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  }
});
// This creates our model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", headlineSchema);

// Export the Headline model
module.exports = Headline;