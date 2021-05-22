const { Router } = require("express");
const { deleteSession } = require("../database/scripts/delete");
const Book = require("../database/models/book");
const Session = require("../database/models/session");

const error = require("./scripts/error");
const { validateIfNotEmpty, validateIfUndefined } = require("./scripts/validation");

const router = Router();

router.get("/:search", async (req, res) => {
  const { search } = req.params;

  if (!validateIfUndefined(search, "Potrzeby parametr wyszukiwania", res)) return;
  if (!validateIfNotEmpty(search, "Potrzeby parametr wyszukiwania", res)) return;

  const book_list = await Book.find({ title: new RegExp(`${search}`, "i") }).exec();

  res.send(book_list);
});

module.exports = router