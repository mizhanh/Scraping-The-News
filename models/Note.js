var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new noteSchema object
var noteSchema = new Schema({
  _headlineId: {
  	type: Schema.Types.ObjectId,
  	ref: "Headline"
  },
  date: {
  	type: Date,
  	default: Date.now,
  },
  // `note body` is of type String
  noteBody: String
});
// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;