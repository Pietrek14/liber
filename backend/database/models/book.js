const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
	title: String,
  author: String,
  url: String,
	description: String,
	release_date: Date,
	publisher: String,
	cover: String, // URL do okładki
	tags: [String],
	content: String, // URL do pdf'a (jeśli istnieje)
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
