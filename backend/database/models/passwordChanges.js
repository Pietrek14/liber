const mongoose = require("mongoose");
const { Schema } = mongoose;

const passwordChangeSchema = new Schema({
	email: String,
    code: String,
    creationDate: { type: Date, default: Date.now },
	lifetime: Number, // Czas do wygasniecia sesji w ms
});

const PasswordChange = mongoose.model("passwordChange", passwordChangeSchema);

module.exports = PasswordChange;
