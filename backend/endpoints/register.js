const { Router } = require("express");
const { registerReader } = require("../database/scripts/register");
const fs = require("fs");
const Reader = require("../database/models/reader");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const error = require("./scripts/error");
const {
	validateIfUndefined,
	validateIfNotEmpty,
	validateMaxLength,
	validateMinLength,
	validateRegex,
	validateEmail,
} = require("./scripts/validation");
const generateCode = require("./scripts/generateCode");
const sendMail = require("./scripts/sendMail");

const emailContents = fs.readFileSync("./email.html").toString();

const router = Router();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

router.post("/", async (req, res) => {
	const data = req.body;
	const name = data.name,
		email = data.email,
		password = data.password;

	// Sprawdz, czy wszystkie pola są defined
	if (!validateIfUndefined(name, "Imię nie może być puste!", res)) return;
	if (!validateIfUndefined(email, "Email nie może być pusty!", res)) return;
	if (!validateIfUndefined(password, "Hasło nie może być puste!", res)) return;

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

	const sameEmailUsers = await Reader.find({ email: email }).exec();

	if (sameEmailUsers.length !== 0) {
		error("Istnieje już użytkownik o takim emailu.", res);
		return;
	}

	const verification_code = generateCode(6);

	const emailContent = emailContents.replace("${code}", verification_code);

	sendMail(
		transporter,
		process.env.EMAIL,
		email,
		"Weryfikacja utworzenia konta na Liberze",
		emailContent
	);

	const user = await registerReader(name, email, password, verification_code);

	if (!user) {
		error("Wystąpił błąd serwera.", res, 500);
		return;
	}

	res.status(200).json({ message: `Witaj na Liberze, ${user.name}` });
});

module.exports = router;
