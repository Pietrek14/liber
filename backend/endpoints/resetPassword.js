// dostaje kod i nowe haslo  dopasowuje code to tego w bazie danych
// pobieram email z bazy danych kodow i dopasowuje email do bazy danych uzytkowiknow
// jesli nowe haslo przejdze cala weryfikacje oraz nie jest taki samo jak stare haslo
// to zmienam stare haslo na nowe i zapisuje w bazie danych
// pogchamp


const { Router } = require("express");
const { registerPasswordChange } = require("../database/scripts/register");
const Reader = require("../database/models/reader");

const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const error = require("./scripts/error");
const PasswordChange = require("../database/models/passwordChanges");

const router = Router();

// glowna funkcja teraz juz na pewno
router.post("/", async (req, res) => {
    const data = req.body;

	const newPassword = data.newPassword;
	const code = data.code;

	// pobieram z bazy danych profil o kodzie ktory dostaje z linku
	const passwordChangeSession = await PasswordChange.findOne({code: code}).exec();

	
	if (!passwordChangeSession) {
		error("Nie znaleziono sesji zmiany hasła", res);
		return;
	}



});


module.exports = router;