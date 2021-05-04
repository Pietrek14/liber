const mongoose = require("mongoose");
const { Schema } = mongoose;

const librarianSchema = new Schema({
	name: String,
	password: String, // hash
	email: String,
	library: Number, // ID biblioteki
	last_payment: Date,
});

const Librarian = mongoose.model("Librarian", librarianSchema);

module.exports = Librarian;
