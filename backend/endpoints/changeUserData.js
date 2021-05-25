const { Router } = require("express");
const Reader = require("../database/models/reader");

const hash = require("../hash")
const error = require("./scripts/error");

const {
	validateIfUndefined, 
	validateIfNotEmpty
} = require("./scripts/validation");


const router = Router();

router.post("/", async (req, res) => {
	//code shit here

	const data = req.body;
	const name = data.name;
	const pass = data.password;
	const email = req.user.email;

	
	
	// sprawdzam czy pola sa puste jesssss
	if (!validateIfUndefined(name, "Imię nie może być puste!", res)) return;
	if (!validateIfUndefined(pass, "Hasło nie może być puste!", res)) return;
	
	if (!validateIfNotEmpty(name, "Imię nie może być puste!", res)) return;
	if (!validateIfNotEmpty(pass, "Hasło nie może być puste!", res)) return;

	
	const hashPass = hash(pass);

	// pobieram z bazy danych profil o kodzie ktory dostaje z linku
	const user = await Reader.findOne({email: email});
	
	// sprawdzam czy haslo jest dobre te co podal uzytkownik z tym co jest na a mongus
	if (hashPass != user.password) {
		error("Złe hasło", res, 401);
		return;
	}

	console.log(email);

	// nowa nazwa staje sie aktualna nazwa
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