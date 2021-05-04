const mongoose = require("mongoose");
const { Schema } = mongoose;

const librarySchema = new Schema({
	name: String,
	librarian: Number, // ID bibliotekarza
	books: [Number], // ID książek
	whitelist: [String], // Emaile czytelników
});

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
