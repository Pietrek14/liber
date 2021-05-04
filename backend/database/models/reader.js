const mongoose = require("mongoose");
const { Schema } = mongoose;

const borrowSchema = new Schema({
	// Wypożyczenie książki
	borrow_date: Date,
	book: Number, // ID książki
});

const ratingSchema = new Schema({
	rating: Number, // 1 - 5 gwiazdek (z połówkami)
	book: Number, // ID książki
});

const readerSchema = new Schema({
	name: String,
	email: String,
	password: String, // hash
	borrows: [borrowSchema],
	ratings: [ratingSchema],
	verified: Boolean,
	verification_code: String,
	account_creation_date: { type: Date, default: Date.now },
});

const Reader = mongoose.model("Reader", readerSchema);

module.exports = Reader;
