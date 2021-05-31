const { getBookInfo } = require("../database/scripts/get");
const { Router } = require("express");
const error = require("./scripts/error");

const router = Router();

router.get("/:id", async (req, res) => {
	// Pobieramy id książki
	const bookId = req.params.id;

	// Jeśli nie podano id książki
	if (!bookId) {
		error("Nie podano id książki.", res);
		return;
	}

	// Znajdź dane książki w bazie danych

	const book = await getBookInfo(`${bookId}`);

	// Jeśli takiej książki nie ma w bazie danych

	if (!book) {
		error("Podano niepoprawne id książki.", res);
		return;
	}

	// Dodajemy średnią ocen książki
	// Tutaj w przyszłości dać requesta do backendu pythonowego, który będzie zwracał średnią ocen danej książki przez wszystkich użytkowników
	book.rating = 5.0;

	// Wysyłamy dane o książce w obiekcie
	res.json(book);
});

module.exports = router;
