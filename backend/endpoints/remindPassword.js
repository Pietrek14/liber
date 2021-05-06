const { Router } = require("express");
const nodemailer = require("nodemailer");
const Reader = require("../database/models/reader");

const sendMail = require("./scripts/sendMail");
const error = require("./scripts/error");

const router = Router();

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


    // to chyba pobiera dane uzytkownika o e-mialu ktory biore,
    // nie mam pojecia z kad biore ten email, ale wsadza go to tej ladnej zmiennej
    const user = await Reader.findOne({ email: email }).exec();

    if (!user) {
		error("Nie ma takiego użytkownika.", res);
		return;
	}

    
});

module.exports = router;