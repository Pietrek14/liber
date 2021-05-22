const Session = require("../../database/models/session");
const Reader = require("../../database/models/reader");
const ObjectId = require("mongoose").Types.ObjectId;

async function getUserBySession(sessionID) {
	// // Sprawdź, czy podane ID jest poprawne
	if (!ObjectId.isValid(sessionID)) {
		return false;
	}

	const session = await Session.findById(new ObjectId(sessionID));
	if (!session) return false;

	const user = await Reader.findOne({ email: session.email });
	return user;
}

async function getUserByEmail(email) {
	const user = await Reader.findOne({ email: email });
	return user;
}

module.exports = { getUserBySession, getUserByEmail };
