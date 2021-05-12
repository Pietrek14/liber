const Session = require("../database/models/session");

const SESSION_LIFETIME = 24 * 60 * 60 * 1000;

async function deleteOldSessions() {
	const time = new Date(Date.now() - SESSION_LIFETIME);

	await Session.deleteMany({
		session_creation_date: { $lt: time },
	}).exec();
}

module.exports = deleteOldSessions;
