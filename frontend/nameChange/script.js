import { serverAddress } from "../scripts/constants.js";

const submitname = document.getElementById("name");
const submitpass = document.getElementById("password");
const submitButton = document.getElementById("submit-button");

const alertBox = document.getElementById("alert-box");
const alertBoxContent = document.getElementById("alert-box-content");
const alertBoxClose = document.getElementById("alert-box-close");

async function init() {
	const res = await fetch(`${serverAddress}/getname`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if(res.status === 401) {
		window.location.replace("../index.html");
		return;
	}
}

await init();		

function alert(message) {
	alertBoxContent.innerText = message;
	alertBox.classList.add("active");
}

function hideAlertBox() {
	alertBox.classList.remove("active");
}

alertBoxClose.onclick = hideAlertBox;

document.addEventListener("keydown", (e) => {
	hideAlertBox();
});

function validateIfNotEmpty(value, errorMessage) {
	if (value.length === 0) {
		alert(errorMessage);
		return false;
	}
	return true;
}

submitButton.onclick = async (e) => {
	e.preventDefault();

	const name = submitname.value;
	const pass = submitpass.value;
	
	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(pass, "Nie wpisano hasła.")) return;
	if (!validateIfNotEmpty(name, "Nie wpisano nazwy.")) return;

	const res = await fetch(`${serverAddress}/changeuserdata`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			password: pass,
			name: name,
		}),
	});


	// do zmiany bo nie ma tej strony jeszcze

	const data = await res.json();

	if (!res.ok) {
		alert(data.message);
		return;
	}


	if (res.status === 400) {
		alert(data.message);
	} else if (res.status === 200) {
		window.location.replace("../index.html");
	}
};
