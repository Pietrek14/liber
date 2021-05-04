const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const register = require("./endpoints/register");
const login = require("./endpoints/login");

const app = express();

mongoose.connect(
	"mongodb+srv://admin:admin@liber.4efko.mongodb.net/liber?retryWrites=true&w=majority",
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
app.use(cors());

app.use("/register", register);
app.use("/login", login);

db.on("error", () => {
	console.log("ojoj");
});

db.once("open", () => {
	app.listen(3000);
});
