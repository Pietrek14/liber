const mongoose = require("mongoose");
const Reader = require("../models/reader");
const hash = require("../../hash");

async function registerReader(name, email, password) {
	const sameEmailUsers = await Reader.find({ email: email }).exec();

	if (sameEmailUsers.length !== 0) {
		return false;
	}

	const user = new Reader({
		name: name,
		email: email,
		password: hash(password),
		borrows: [],
		ratings: [],
		verified: true,
		verification_code: "",
	});

	user.save((err, user) => {
		if (err) {
			console.error(err);
			return false;
		}
	});

	console.log(`Zarejestrowano email: ${email}`);

	return true;
}

module.exports = { registerReader };
