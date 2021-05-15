const mongoose = require("mongoose");
const Reader = require("../models/reader");
const Session = require("../models/session");
const PasswordChange = require("../models/passwordChanges");
const hash = require("../../hash");

async function registerReader(name, email, password, verification_code) {
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
		verified: false,
		verification_code: verification_code,
	});

	user.save((err, user) => {
		if (err) {
			console.error(err);
			return false;
		}
	});

	console.log(`Zarejestrowano email: ${email}`);

	return user;
}

async function registerSession(email, lifetime) {
	const session = new Session({
		email: email,
	});

	session.save((err, session) => {
		if (err) {
			console.error(err);
			return false;
		}

		console.log(`Zarejestrowano sesję dla użytkownika: ${email}`);
	});

	return session;
}

async function registerPasswordChange(email, code) {
	const passwordChange = new PasswordChange({
		email: email,
		code: code,
		lifetime: 43200000, // 12h in ms
	});

	passwordChange.save((err, passwordChange) => {
		if (err) {
			console.error(err);
			return false;
		}

		console.log(`Zarejestrowano sesję zmiany hasla: ${email}`);
	});
	return passwordChange;
}

module.exports = { registerReader, registerSession, registerPasswordChange };
