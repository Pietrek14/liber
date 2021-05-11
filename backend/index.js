const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const register = require("./endpoints/register");
const login = require("./endpoints/login");
const verifyEmail = require("./endpoints/verifyEmail");
const resendCode = require("./endpoints/resendCode");
const getName = require("./endpoints/getName");
const sendpasswordchange = require("./endpoints/sendPasswordChangeCode");
const resetPassword = require("./endpoints/sendPasswordChangeCode");

const UNVERIFIED_USER_LIFETIME = 24 * 60 * 60 * 1000;

const app = express();

mongoose.connect(
	`mongodb+srv://admin:${process.env.DATABASE_PASSWORD}@liber.4efko.mongodb.net/liber?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) console.error(err);
		else console.log("pog");
	}
);

const db = mongoose.connection;

app.use(express.json());
app.use(
	cors({
		origin: "http://127.0.0.1:5500",
		credentials: true,
	})
);
app.use(cookieParser());

// Endpointy
app.use("/register", register);
app.use("/login", login);
app.use("/verifyemail", verifyEmail);
app.use("/resendcode", resendCode);
app.use("/getname", getName);
app.use("/sendpasswordchange", sendpasswordchange);
app.use("/resetPassword", resetPassword);

const Reader = require("./database/models/reader");

// Usuwanie niezweryfikowanych kont
setInterval(async () => {
	const time = new Date(Date.now() - UNVERIFIED_USER_LIFETIME);

	await Reader.deleteMany({
		verified: false,
		account_creation_date: { $lt: time },
	}).exec();
}, UNVERIFIED_USER_LIFETIME);

db.on("error", () => {
	console.log("ojoj");
});

db.once("open", () => {
	app.listen(3000);
});
