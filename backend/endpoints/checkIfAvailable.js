const { Router } = require("express");
const Borrow = require("../database/models/borrow");

const router = Router();

router.get("/:id", async (req, res) => {
	const book = req.params.id;

	const borrow = await Borrow.findOne({ book: book });

	if (borrow) res.status(200).json({ available: false });
	else res.status(200).json({ available: true });
});

module.exports = router;
