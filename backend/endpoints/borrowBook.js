const { Router } = require("express");
const Borrow = require("../database/models/borrow");
const Book = require("../database/models/book");
const { registerBorrow } = require("../database/scripts/register");
const mongoose = require("mongoose");
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

	const sameBookBorrow = await Borrow.findOne({ book: book });

	if (sameBookBorrow) {
		error("Ta książka nie jest dostępna.", res);
		return;
	}

	if (!mongoose.Types.ObjectId.isValid(book)) {
		error("Ta książka nie jest dostępna.", res);
		return;
	}

	const _book = await Book.findById(book);

	if (!_book) {
		error("Ta książka nie jest dostępna.", res);
		return;
	}

	const borrow = await registerBorrow(user._id, book);

	res.status(200).json(borrow);
});

module.exports = router;
