const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

// Importy endpointów

// POST
const register = require("./endpoints/register");
const login = require("./endpoints/login");
const verifyEmail = require("./endpoints/verifyEmail");
const resendCode = require("./endpoints/resendCode");

// GET

const getName = require("./endpoints/getName");

// Middleware

const loginCheck = require("./middleware/loginCheck");

// Importy rutyn
const deleteOldUsers = require("./routines/deleteOldUsers");
const deleteOldSessions = require("./routines/deleteOldSessions");

const DELETE_OLD_RECORDS_INTERVAL = 24 * 60 * 60 * 1000;

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

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

// Endpointy

// POST
app.use("/register", register);
app.use("/login", login);
app.use("/verifyemail", verifyEmail);
app.use("/resendcode", resendCode);
app.use("/confimation", confirmation);

// GET
app.use("/getname", loginCheck, getName);

// Routines
setInterval(deleteOldUsers, DELETE_OLD_RECORDS_INTERVAL);
setInterval(deleteOldSessions, DELETE_OLD_RECORDS_INTERVAL);

db.on("error", () => {
	console.log("ojoj");
});

db.once("open", () => {
	app.listen(3000);
});
