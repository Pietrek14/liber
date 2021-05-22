const Book = require("../models/book");
const hash = require("../../hash");

async function addBook(name = "", author = "", url = "", description = "", release_date = new Date(), publisher = "", cover = "", tags = [], content = "",) {
  const same_name = await Book.find({ name }).exec();

  if (same_name.length !== 0) return;

  const book = new Book({
    name,
    author,
    url,
    description,
    release_date,
    publisher,
    cover,
    tags,
    content,
  })

  book.save((err, user) => {
    if (err) {
      console.error(err, user);
      return false;
    }
  });

  console.debug(`Dodano ksiazke: ${name}`);

  return book
};

module.exports = addBook