const Reader = require("../database/models/reader");
const PasswordChanges = require("../database/models/passwordChanges");

const UNVERIFIED_USER_LIFETIME = 24 * 60 * 60 * 1000;

async function deleteOldSessions() {
	const time = new Date(Date.now() - UNVERIFIED_USER_LIFETIME);

	await Reader.deleteMany({
		verified: false,
		account_creation_date: { $lt: time },
	}).exec();

	await PasswordChanges.deleteMany({
		creationDate: { $lt: time },
	}).exec();

}

module.exports = deleteOldSessions;
