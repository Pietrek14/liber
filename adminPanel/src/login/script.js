global.mongoose = require("mongoose");
const { alert } = require("../scripts/alert");

const loginInput = document.getElementById("login-input");
const passwordInput = document.getElementById("password-input");
const submitButton = document.getElementById("submit-button");

submitButton.onclick = (e) => {
	e.preventDefault();

	global.mongoose.connect(
		`mongodb+srv://${loginInput.value}:${passwordInput.value}@liber.4efko.mongodb.net/liber?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		(err) => {
			if (err) {
				alert(`Nie udało się zalogować.<br>Błąd: ${err}`);
			} else {
				window.location = "../index.html";
			}
		}
	);
};
