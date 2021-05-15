const Reader = require("../database/models/reader");

const UNVERIFIED_USER_LIFETIME = 24 * 60 * 60 * 1000;

async function deleteOldUsers() {
	const time = new Date(Date.now() - UNVERIFIED_USER_LIFETIME);

	await Reader.deleteMany({
		verified: false,
		account_creation_date: { $lt: time },
	}).exec();
}

module.exports = deleteOldUsers;
