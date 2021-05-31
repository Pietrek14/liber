const Book = require("../models/book");
const ObjectId = require("mongoose").Types.ObjectId;

async function getBookInfo(sessionId) {
	if (!ObjectId.isValid(sessionId)) return null;

	return Book.findById(sessionId).lean();
}

module.exports = { getBookInfo };
