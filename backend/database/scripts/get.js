const Book = require("../models/book");
const ObjectId = require("mongoose").Types.ObjectId;

async function getBookInfo(sessionId) {
	if (!ObjectId.isValid(sessionId)) return null;

	return Book.findById(sessionId).lean();
}

async function getAuthorBooks(name) {
	return Book.find({ author: name });
}

module.exports = { getBookInfo, getAuthorBooks };
