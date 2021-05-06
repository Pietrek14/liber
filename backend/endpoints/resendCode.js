const { Router } = require("express");
const fs = require("fs");
const Reader = require("../database/models/reader");
const nodemailer = require("nodemailer");

const error = require("./scripts/error");
const {
	validateIfUndefined,
	validateIfNotEmpty,
} = require("./scripts/validation");
const sendMail = require("./scripts/sendMail");

const emailContents = fs
	.readFileSync("../assets/emails/verificationEmail.html")
	.toString();

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

	const email = data.email;

	if (!validateIfUndefined(email, "Email nie może być pusty!", res)) return;
	if (!validateIfNotEmpty(email, "Email nie może być pusty!", res)) return;

	const user = await Reader.findOne({ email: email }).exec();

	if (!user) {
		error("Nie ma takiego użytkownika.", res);
		return;
	}

	const email_content = emailContents.replace(
		"${code}",
		user.verification_code
	);

	sendMail(
		transporter,
		process.env.EMAIL,
		email,
		"Weryfikacja utworzenia konta na Liberze",
		email_content
	);

	res.status(200).json({ message: "Wysłano emaila ponownie." });
});

module.exports = router;
