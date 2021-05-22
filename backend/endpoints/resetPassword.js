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
const {
	validateIfUndefined,
	validateIfNotEmpty,
	validateMaxLength,
	validateMinLength,
	validateRegex,
	validateEmail,
} = require("./scripts/validation");
const { getUserByEmail } = require("./scripts/getUser");
const hash = require("../hash")

const router = Router();

// glowna funkcja teraz juz na pewno
router.post("/", async (req, res) => {
    const data = req.body;

	const newPasswordHash = hash(data.newPassword);
	const newPassword = data.newPassword;
	const code = data.code;

	// VALIDATION SHIT HERE 
	// ????????

	// czy nowe haslo jest defined
	if (!validateIfUndefined(newPassword, "Hasło nie może być puste!", res)) return;

	// czy nowe haslo nie jest puste
	if (!validateIfNotEmpty(newPassword, "Hasło nie może być puste!", res)) return;

	// Sprawdz, czy haslo ma odpowiednią długość
	if (
		!validateMinLength(
			newPassword,
			8,
			"Hasło musi składać się z przynajmniej ośmiu znaków!",
			res
		)
	) {
		return;
	}

	if (
		!validateMaxLength(
			newPassword,
			64,
			"Hasło nie może być dłuższe niż 64 znaki!",
			res
		)
	) {
		return;
	}

	if (
		!validateRegex(
			newPassword,
			/[a-z]/g,
			"Hasło musi zawierać przynajmniej jedną małą literę!",
			res
		)
	) {
		return;
	}

	if (
		!validateRegex(
			newPassword,
			/[A-Z]/g,
			"Hasło musi zawierać przynajmniej jedną wielką literę!",
			res
		)
	) {
		return;
	}

	if (
		!validateRegex(
			newPassword,
			/[0-9]/g,
			"Hasło musi zawierać przynajmniej jedną cyfrę!",
			res
		)
	) {
		return;
	}


	// pobieram z bazy danych profil o kodzie ktory dostaje z linku
	const passwordChangeSession = await PasswordChange.findOne({code: code});
	
	// sprawdzam poprawnosc codu z linku
	// na wszelki wypadek 
	if (!passwordChangeSession) {
		error("Nie znaleziono sesji zmiany hasła", res);
		return;
	}

	const email = passwordChangeSession.email;

	// pobieranie danych uzytkiwnika 
	const user = await getUserByEmail(email);

	// to trzeba poprawic
	// sprawdzam czy uzytkownik istnieje
	// nie wiem jakim cudem mialby nie istniec ale na wszelki wypadek
	if (!user) {
		error("nie wiem co sie stalo", res, 500);
		return;
	}

	// sprawdzam czy nowe haslo jest rowne staremu haslu
	if (user.password == newPasswordHash) {
		error("Nowe hasło nie może być takie samo jak stare hasło", res);
		return;
	}


	// jak wszysto poszlo dobrze to chyba mozna zmienic haslo
	await Reader.updateOne({ email: email }, { password: newPasswordHash }, (err, _res) => {
		if (err) {
			console.error(err);
			error("Wystąpił błąd serwera.", res, 500);
			return;
		}

		// jak jest dobrze i wszytko dziala to jest fajnie i wysyla to gowna
		res.status(200).send();
	});

	await PasswordChange.deleteOne({ email: email});
});


module.exports = router;