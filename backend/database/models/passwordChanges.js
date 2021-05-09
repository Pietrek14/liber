const mongoose = require("mongoose");
const { Schema } = mongoose;

const passwordChangeSchema = new Schema({
	email: String,
    code: String,
    creationDate: Date,
	lifetime: Number, // Czas do wygasniecia sesji w ms
});

const PasswordChange = mongoose.model("passwordChange", passwordChangeSchema);

module.exports = PasswordChange;
