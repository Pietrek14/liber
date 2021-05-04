const { Router } = require("express");
const { registerReader } = require("../database/scripts/register");

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

function validateRegex(value, regex, errorMessage, res) {
	if (regex.test(value)) return true;
	error(errorMessage, res);
	return false;
}

function validateEmail(email, errorMessage, res) {
	const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return validateRegex(String(email).toLowerCase(), re, errorMessage, res);
}

function validateMinLength(value, length, errorMessage, res) {
	if (value.length < length) {
		error(errorMessage, res);
		return false;
	}
	return true;
}

function validateMaxLength(value, length, errorMessage, res) {
	if (value.length > length) {
		error(errorMessage, res);
		return false;
	}
	return true;
}

router.post("/", async (req, res) => {
	const data = req.body;
	const name = data.name,
		email = data.email,
		password = data.password;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(name, "Imię nie może być puste!", res)) return;
	if (!validateIfNotEmpty(email, "Email nie może być pusty!", res)) return;
	if (!validateIfNotEmpty(password, "Hasło nie może być puste!", res)) return;

	// Sprawdz, czy email jest poprawny
	if (!validateEmail(email, "Podano niepoprawny adres email!", res)) return;

	// Sprawdz, czy haslo ma odpowiednią długość
	if (
		!validateMinLength(
			password,
			8,
			"Hasło musi składać się z przynajmniej ośmiu znaków!",
			res
		)
	) {
		return;
	}

	if (
		!validateMaxLength(
			password,
			64,
			"Hasło nie może być dłuższe niż 64 znaki!",
			res
		)
	) {
		return;
	}

	if (
		!validateRegex(
			password,
			/[a-z]/g,
			"Hasło musi zawierać przynajmniej jedną małą literę!",
			res
		)
	) {
		return;
	}

	if (
		!validateRegex(
			password,
			/[A-Z]/g,
			"Hasło musi zawierać przynajmniej jedną wielką literę!",
			res
		)
	) {
		return;
	}

	if (
		!validateRegex(
			password,
			/[0-9]/g,
			"Hasło musi zawierać przynajmniej jedną cyfrę!",
			res
		)
	) {
		return;
	}

	const registered = await registerReader(name, email, password);

	if (registered) {
		res.status(200).json({ message: "pog" });
	} else {
		res
			.status(400)
			.json({ message: "Istnieje już użytkownik o takim emailu." });
	}
});

module.exports = router;
