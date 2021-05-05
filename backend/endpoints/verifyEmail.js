const { Router } = require("express");
const Reader = require("../database/models/reader");

const router = Router();

const error = require("./scripts/error");
const {
	validateIfUndefined,
	validateIfNotEmpty,
} = require("./scripts/validation");

router.post("/", async (req, res) => {
	const data = req.body;

	const email = data.email,
		code = data.code;

	// Sprawdz, czy wszystkie pola są defined
	if (!validateIfUndefined(email, "Email nie może być pusty!", res)) return;
	if (!validateIfUndefined(code, "Nie podano kodu weryfikacyjnego.", res))
		return;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(email, "Email nie może być pusty!", res)) return;
	if (!validateIfNotEmpty(code, "Nie podano kodu weryfikacyjnego.", res))
		return;

	const users = await Reader.find({ email: email }).exec();

	if (users.length === 0) {
		error("Nie istnieje użytkownik o takim emailu.", res);
		return;
	}

	if (users.length > 1) {
		error("Wystąpił błąd serwera.", res, 500);
		return;
	}

	const user = users[0];

	if (code !== user.verification_code) {
		error("Podano błędny kod weryfikacyjny.", res);
		return;
	}

	if (user.verified) {
		error("Ten użytkownik został już zweryfikowany.", res);
		return;
	}

	Reader.updateOne({ email: email }, { verified: true }, (err, _res) => {
		if (err) {
			console.error(err);
			error("Wystąpił błąd serwera.", res, 500);
			return;
		}

		res.status(200).json({ message: "Zweryfikowano użytkownika." });
	});
});

module.exports = router;
