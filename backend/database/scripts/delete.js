const Session = require("../models/session");

async function deleteSession(sessionId) {
	Session.findByIdAndDelete(sessionId, function (err) {
		if (err) console.error(err);
	});
}

module.exports = { deleteSession };
