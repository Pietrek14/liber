const { Router } = require("express");
const { registerReader } = require("../database/scripts/register");
const fs = require("fs");
const mongoose = require("mongoose");
const Reader = require("../database/models/reader");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const router = Router();

function error(errorMessage, res, code = 400) {
	res.status(code).json({ message: errorMessage });
}

function generateCode(length) {
	let result = [];
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result.push(
			characters.charAt(Math.floor(Math.random() * charactersLength))
		);
	}

	return result.join("");
}

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

	fs.readFile("./email.html", "utf8", async (err, email_content) => {
		if (err) {
			console.log(err);
			error("Wystąpił błąd serwera", res, 500);
			return;
		}

		email_content = email_content.replace("${code}", verification_code);

		const mailOptions = {
			from: process.env.EMAIL,
			to: email,
			subject: "Weryfikacja utworzenia konta na Liberze",
			html: email_content,
		};

		transporter.sendMail(mailOptions, async (error, info) => {
			if (error) {
				console.log(error);
				error("Wystąpił błąd serwera", res, 500);
				return;
			}

			console.log("Email sent: " + info.response);

			const user = await registerReader(
				name,
				email,
				password,
				verification_code
			);

			if (!user) {
				error("Wystąpił błąd serwera.", res, 500);
				return;
			}

			res.status(200).json({ message: `Witaj na Liberze, ${user.name}` });
		});
	});
});

module.exports = router;
