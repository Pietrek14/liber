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
const logout = require("./endpoints/logout");
const verifyEmail = require("./endpoints/verifyEmail");
const resendCode = require("./endpoints/resendCode");
const changeUserData = require("./endpoints/changeUserData");
const sendPasswordChange = require("./endpoints/sendPasswordChangeCode");
const borrowBook = require("./endpoints/borrowBook");
const addRate = require("./endpoints/addRate");
const resetPassword = require("./endpoints/resetPassword");
const checkChangePasswordCode = require("./endpoints/checkChangePasswordCode");
const deleteBorrow = require("./endpoints/deleteBorrow");

// GET

const getName = require("./endpoints/getName");
const getEmail = require("./endpoints/getEmail");
const getBookInfo = require("./endpoints/getBookInfo");
const getAuthorBooks = require("./endpoints/getAuthorBooks");
const getRates = require("./endpoints/getRates");
const recommendBooks = require("./endpoints/recommendBooks");
const checkIfAvailable = require("./endpoints/checkIfAvailable");
const getBorrows = require("./endpoints/getBorrows");

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
app.use("/logout", loginCheck, logout);
app.use("/verifyemail", verifyEmail);
app.use("/resendcode", resendCode);
app.use("/sendpasswordchange", sendPasswordChange);
app.use("/resetpassword", resetPassword);
app.use("/checkchangepasswordcode", checkChangePasswordCode);
app.use("/addrate", loginCheck, addRate);
app.use("/changeuserdata", loginCheck, changeUserData);
app.use("/borrowbook", loginCheck, borrowBook);
app.use("/deleteborrow", loginCheck ,deleteBorrow);

// GET
app.use("/getname", loginCheck, getName);
app.use("/getemail", loginCheck, getEmail);
app.use("/getrates", loginCheck, getRates);
app.use("/getbookinfo", getBookInfo);
app.use("/getauthorbooks", getAuthorBooks);
app.use("/recommendbooks", loginCheck, recommendBooks);
app.use("/checkifavailable", checkIfAvailable);
app.use("/getborrows", loginCheck, getBorrows);

// Routines
setInterval(deleteOldUsers, DELETE_OLD_RECORDS_INTERVAL);
setInterval(deleteOldSessions, DELETE_OLD_RECORDS_INTERVAL);

db.on("error", () => {
	console.log("ojoj");
});

db.once("open", () => {
	app.listen(3000);
});
