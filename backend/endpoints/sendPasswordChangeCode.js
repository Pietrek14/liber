// musze na poczatku wyslac email z kodem ktory gdzies zapisuje
// email biore z formularza (ktore musze ogarnac) 
// chyba musze mie drugi plik ktory sprawdzi czy kod podany przez uzytkowinka zgadza sie z tym gdzies zapisanym
// na koncu chyba moge po prostu skopiowac kod z rejestracji uzytkowika


const { Router } = require("express");
const { registerPasswordChange } = require("../database/scripts/register");
const nodemailer = require("nodemailer");
const Reader = require("../database/models/reader");
const PasswordChange = require("../database/models/passwordChanges");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const generateCode = require("./scripts/generateCode");

const sendMail = require("./scripts/sendMail");
const error = require("./scripts/error");

const router = Router();

const emailContents = fs
	.readFileSync("./assets/emails/passwordChangeEmail.html")
	.toString();

// nie mam pojecia co sie tu dzieje, nawet nie wiem czy
// to dziala ale zaufam dawidowi


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


// to chyba bledy gdzies zapisuje albo cos 
// naprawde nie wiem
function error(errorMessage, res, code = 400) {
	res.status(code).json({ message: errorMessage });
}

// o ile rozumiem to jest glowna funkcja ale tego tez nie jestem pewnien
router.get("/", async (req, res) => {
    const data = req.body;

    const email = data.email;

	// sprawdzanie czy dany uzytkownik istnieje
    const user = await Reader.findOne({ email: email }).exec();
	const emailInDatabase = await PasswordChange.findOne({email: email}).exec();

    if (!user) {
		error("Nie ma takiego użytkownika.", res);
		return;
	}

	// idiotyczne rozwiazanie dla debili
	if(!emailInDatabase) {
		error("Email został już wysłany.", res);
	}

	const code = generateCode(16);
	const link = "" + code + ""; // sex


	// email shit here
	const email_content = emailContents.replace(
		"${code}",
		link
	);

	sendMail(
		transporter,
		process.env.EMAIL,
		email,
		"Przywrócenie konta na Liberze",
		email_content
	);

	// database shit here
	const passwordChange = await registerPasswordChange(email, code);

	if (!passwordChange) {
		error("Wystąpił błąd serwera.", res, 500);
		return;
	}

	res.status(200).json({ message: "Wysłano email" });
});


module.exports = router;