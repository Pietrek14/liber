const mongoose = require("mongoose");
const { Schema } = mongoose;

const sessionSchema = new Schema({
	email: String,
	session_creation_date: { type: Date, default: Date.now },
	lifetime: Number, // Czas do wygasniecia sesji w ms
});

const Session = mongoose.model("session", sessionSchema);

module.exports = Session;
