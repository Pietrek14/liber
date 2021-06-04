const { getAuthorBooks } = require("../database/scripts/get");
const { Router } = require("express");
const error = require("./scripts/error");

const router = Router();

router.get("/:authorName", async (req, res) => {
	// Pobieramy dane autora
	const author = decodeURI(req.params.authorName);

	// Jeśli nie podano danych autora
	if (!author) {
		error("Nie podano autora.", res);
		return;
	}

	// Znajdź dane książek w bazie danych

	const books = await getAuthorBooks(author);

	// Jeśli autor nie napisał książek (nie ma takiego autora)

	if (books.length === 0) {
		error("Nie ma takiego autora.", res);
		return;
	}

	// Wysyłamy dane o książce w obiekcie
	res.json(books);
});

module.exports = router;
