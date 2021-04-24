const mongoose = require("mongoose");
const { Schema } = mongoose;

const librarySchema = new Schema({
	name: String,
	librarian: Number,	// ID bibliotekarza
	books: [Number]	// ID książek
});

const library = mongoose.model("library", librarySchema);

module.exports = library;