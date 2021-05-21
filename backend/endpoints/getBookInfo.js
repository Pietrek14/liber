const { getBookInfo } = require("../database/scripts/get");
const { Router } = require("express");
const error = require("./scripts/error");

const router = Router();

router.get("/:id", async (req, res) => {
	const bookId = req.params.id;

	if (!bookId) {
		error("Nie podano id książki.", res);
		return;
	}

	const book = await getBookInfo(`${bookId}`);

	if (!book) {
		error("Podano niepoprawne id książki.", res);
		return;
	}

	res.json(book);
});

module.exports = router;