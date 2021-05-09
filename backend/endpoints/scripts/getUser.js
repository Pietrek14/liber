const Session = require("../../database/models/session");
const Reader = require("../../database/models/reader");

async function getUserBySession(sessionID) {
	const session = await Session.findById(sessionID);
	const user = await Reader.findOne({ email: session.email });
	return user;
}

async function getUserByEmail(email) {
	const user = await Reader.findOne({ email: email });
	return user;
}

module.exports = { getUserBySession, getUserByEmail };
