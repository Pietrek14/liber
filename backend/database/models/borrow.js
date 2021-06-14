const mongoose = require("mongoose");
const { Schema } = mongoose;

const borrowSchema = new Schema({
	// Wypożyczenie książki
	borrow_date: { type: Date, default: Date.now },
	book: String, // ID książki
	user: String, // ID użytkownika
});

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
