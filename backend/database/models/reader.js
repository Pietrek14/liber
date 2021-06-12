const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
	rating: Number, // 1 - 5 gwiazdek (z połówkami)
	book: Number, // ID książki
});

const readerSchema = new Schema({
	name: String,
	email: String,
	password: String, // hash
	ratings: [ratingSchema],
	verified: Boolean,
	verification_code: String,
	account_creation_date: { type: Date, default: Date.now },
	whitelisted: { type: Boolean, default: false },
});

const Reader = mongoose.model("Reader", readerSchema);

module.exports = Reader;
