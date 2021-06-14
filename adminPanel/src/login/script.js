const { ipcRenderer } = require("electron");
const { alert } = require("../scripts/alert");

const loginInput = document.getElementById("login-input");
const passwordInput = document.getElementById("password-input");
const submitButton = document.getElementById("submit-button");

ipcRenderer.on("connection-error", (e, err) => {
	alert(`Nie udało się zalogować.<br>Błąd: ${err}`);
});

ipcRenderer.on("connection-successful", (e, arg) => {
	window.location = "../index.html";
});

submitButton.onclick = (e) => {
	e.preventDefault();

	ipcRenderer.send("connect-mongoose", loginInput.value, passwordInput.value);
};
