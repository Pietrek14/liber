const { Router } = require("express");
const { registerSession } = require("../database/scripts/register");
const Reader = require("../database/models/reader");
const hash = require("../hash");

const router = Router();

const error = require("./scripts/error");
const {
	validateIfUndefined,
	validateIfNotEmpty,
} = require("./scripts/validation");

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

	const session = await registerSession(data.email, 30 * 24 * 60 * 60 * 1000);

	if (session === false) {
		error("Wystąpił błąd serwera.", res, 500);
		return;
	}

	let expirationDate = new Date();
	expirationDate.setMonth(expirationDate.getMonth() + 1);

	res
		.status(200)
		.cookie("session", `${session._id}`, {
			httpOnly: true,
			expires: expirationDate,
		})
		.json({ message: "Zalogowano poprawnie." });
});

module.exports = router;
