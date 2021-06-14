// sprawdzam czy sa jakeis ksiazki w bazie danych z uzytkownikiem
// o tym ID i jesli sa wysyalam je tablica,
// jesli nie ma to wysyla..... nie wiem......np "LOOOL"

const { Router } = require("express");
const Reader = require("../database/models/reader");
const Borrows = require("../database/models/borrow");
// const Book = require("../database/models/book");	//moze sie potem przyda


const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const error = require("./scripts/error");

const router = Router();


router.get("/", async (req, res) => {

	// tutaj koduje jak szef B)
	const userID = req.user._id;

	const borrowed = await Borrows.find({user: userID});

	if (!borrowed) {
		error("nie ma", res);
		return;
	}
	else {
		res.status(200).json({ borrows: borrowed});
		return;
	}

});


module.exports = router;