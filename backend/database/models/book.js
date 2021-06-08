const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
	title: String,
	author: String,
	description: String,
	releaseDate: Date,
	publisher: String,
	coverUrl: String, // URL do okładki
	tags: [String],
	content: String, // URL do pdf'a (jeśli istnieje)
	available: { type: Boolean, default: true },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
