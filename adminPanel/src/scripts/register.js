const Book = require("../models/book");

async function registerBook(
	title,
	author,
	description,
	releaseDate,
	publisher,
	coverUrl,
	tags,
	content = null
) {
	const book = new Book({
		title: title,
		author: author,
		description: description,
		releaseDate: releaseDate,
		publisher: publisher,
		coverUrl: coverUrl,
		tags: tags,
		content: content,
	});

	book.save((err, book) => {
		if (err) {
			console.error(err);
			return;
		}

		console.log(`Dodano książkę: ${title}`);
	});

	return book;
}

module.exports = { registerBook };
