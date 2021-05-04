const { Router } = require("express");
const { registerSession } = require("../database/scripts/register");
const Reader = require("../database/models/reader");
const hash = require("../hash");

const router = Router();

function error(errorMessage, res, code = 400) {
	res.status(code).json({ message: errorMessage });
}

function validateIfUndefined(value, errorMessage, res) {
	if (value === undefined) {
		error(errorMessage, res);
		return false;
	}
	return true;
}

function validateIfNotEmpty(value, errorMessage, res) {
	if (value.length === 0) {
		error(errorMessage, res);
		return false;
	}
	return true;
}

router.post("/", async (req, res) => {
	const data = req.body;

	const email = data.email,
		password = data.password;

	// Sprawdz, czy wszystkie pola są defined
	if (!validateIfUndefined(email, "Email nie może być pusty!", res)) return;
	if (!validateIfUndefined(password, "Hasło nie może być puste!", res)) return;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(email, "Email nie może być pusty!", res)) return;
	if (!validateIfNotEmpty(password, "Hasło nie może być puste!", res)) return;

	const users = await Reader.find({ email: email });

	if (users.length === 0) {
		error("Nie istnieje konto o tym emailu.", res);
		return;
	}

	if (users.length > 1) {
		error("Wystąpił błąd serwera.", res, 500);
		return;
	}

	const user = users[0];

	if (hash(data.password) != user.password) {
		error("Niepoprawne hasło.", res);
		return;
	}

	const session = registerSession(data.email, 30 * 24 * 60 * 60 * 1000);

	if (!session) {
		error("Wystąpił błąd serwera.", res, 500);
		return;
	}

	res.status(200).json({ session: session });
});

module.exports = router;
