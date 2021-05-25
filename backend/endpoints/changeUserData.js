const { Router } = require("express");
const Reader = require("../database/models/reader");

const error = require("./scripts/error");

const {
	validateIfUndefined, 
	validateIfNotEmpty
} = require("./scripts/validation");


const router = Router();

router.post("/", async (req, res) => {
	//code hit here

	const data = req.body;
	const name = data.name;
	email = req.user.email;

	if (!validateIfUndefined(name, "Imię nie może być puste!", res)) return;

	if (!validateIfNotEmpty(name, "Imię nie może być puste!", res)) return;

	Reader.updateOne({ email: email }, { name: name }, (err, _res) => {
		if (err) {
			console.error(err);
			error("Wystąpił błąd serwera.", res, 500);
			return;
		}

		res.status(200).json({ message: "Zmieniono Nazwe" });
	});

});


module.exports = router;