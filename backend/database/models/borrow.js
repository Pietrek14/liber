const mongoose = require("mongoose");
const { Schema } = mongoose;

const borrowSchema = new Schema({
	// Wypożyczenie książki
	borrow_date: { type: Date, default: Date.now },
	book: String, // ID książki
	user: String, // ID użytkownika
	received: { type: Boolean, default: false }, // czy ksiazka zostala odebrana z biblioteki
});

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
