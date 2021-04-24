const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
	title: String,
	author: String,
	description: String,
	release_date: Date,
	publisher: String,
	cover: String,  // URL do okładki
	tags: [String],
	content: String // URL do pdf'a (jeśli istnieje)
});

const book = mongoose.model("book", bookSchema);

module.exports = book;