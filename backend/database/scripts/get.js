const Book = require("../models/book");
const ObjectId = require("mongoose").Types.ObjectId;

async function getBookInfo(sessionId) {
	if (!ObjectId.isValid(sessionId)) return null;

	return await Book.findById(sessionId);
}

module.exports = { getBookInfo };
