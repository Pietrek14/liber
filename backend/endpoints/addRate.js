const { Router } = require("express");
const Reader = require("../database/models/reader");
const Book = require("../database/models/book");
const ObjectId = require("mongoose").Types.ObjectId;
const {
  validateIfUndefined,
  validateIfNotEmpty,
} = require("./scripts/validation");
const error = require("./scripts/error");

const router = Router();

router.post("/", async (req, res) => {
  const data = req.body;
  const rating = data.rating;
  const book = data.book;
  const user = req.user;
  const ratings = user.ratings;

  // Walidacja
  if (!validateIfNotEmpty(rating, "Nie podano oceny", res)) return;
  if (!validateIfNotEmpty(book, "Nie podano książki", res)) return;

  if (!validateIfUndefined(rating, "Nie podano oceny", res)) return;
  if (!validateIfUndefined(book, "Nie podano książki", res)) return;

  if (rating > 5 || rating < 1 || !Number.isInteger(rating)) {
    error("Ocena książki musi być liczbą całkowitą pomiędzy 1 a 5.", res);
    return;
  }

  if (!ObjectId.isValid(book)) {
    error("Podano niepoprawne id ksiazki :(", res);
    return;
  }

  const _book = await Book.findById(book).exec();
  if (!_book) {
    error("Nie ma takiej książki w bazie danych", res);
    return;
  }

  //sprawdz czy uzytkownik juz ocenil dana ksiazke

  let check = false;
  for (let rate of ratings) {
    if (rate.book === book) {
      check = true;
      rate.rating = rating;
      break;
    }
  }

  // Dodaj ocenę książki do bazy danych

  console.log(ratings);
  if (!check) {
    req.user.ratings.push({ rating: rating, book: book });
  }
  req.user.save((err) => {
    if (err) console.error(err);
  });
  res.json({ message: "Oceniono książkę" });
});

module.exports = router;
