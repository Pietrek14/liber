const { Router } = require("express");
const Borrow = require("../database/models/borrow");
const { registerBorrow } = require("../database/scripts/register");
const router = Router();

const error = require("./scripts/error");
const {
	validateIfUndefined,
	validateIfNotEmpty,
} = require("./scripts/validation");

router.post("/", async (req, res) => {
	const data = req.body;
	const book = data.book,
		user = req.user;

	// Sprawdz, czy wszystkie pola są defined
	if (!validateIfUndefined(book, "Nie podano książki!", res)) return;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(book, "Nie podano książki!", res)) return;

	const sameBookBorrow = Borrow.findOne({ book: book });

	if (sameBookBorrow) {
		error("Ta książka nie jest dostępna.", res);
	}

	res.status(200).json({ name: req.user.name });
});

module.exports = router;
