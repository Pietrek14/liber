// pietreks shit
import { serverAddress } from "../scripts/constants.js";

const submitPass1 = document.getElementById("password1");
const submitPass2 = document.getElementById("password2");
const submitButton = document.getElementById("submit-button");

const alertBox = document.getElementById("alert-box");
const alertBoxContent = document.getElementById("alert-box-content");
const alertBoxClose = document.getElementById("alert-box-close");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get("code");

// endpoint ktory sprawdza czy kod istnieje w bazie danych
const init = async () => {
	const checkCodeRequest = await fetch(`${serverAddress}/checkChangePasswordCode`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			code: code,
		}),
	});
	
	const body = await checkCodeRequest.json();
	
	if (body.message === "nie pog") {
		window.location.replace("http://127.0.0.1:5500/frontend/resetPassword/nogoodcode.html");
	}
}; 

init();

// alert box shit here
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

// sprawdza czy nie puste lmao
function validateIfNotEmpty(value, errorMessage) {
	if (value.length === 0) {
		alert(errorMessage);
		return false;
	}
	return true;
}
// glowna funkcja
submitButton.onclick = async (e) => {
	e.preventDefault();

	const pass1 = submitPass1.value;
	const pass2 = submitPass2.value;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(pass1, "Nie wpisano hasła")) return;
	if (!validateIfNotEmpty(pass2, "Nie wpisano hasła")) return;

	// sprawdz czy hasla sa takie same
	if (pass1 != pass2) {
		alert("Hasła nie są takie same")
		return;
	} 
	
	// wysylanie na serwer
	const res = await fetch(`${serverAddress}/resetpassword`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			newPassword: pass1,
			code: code,
		}),
	});

	if (!res.ok) {
		console.log("nie bylo ok", res);
	}
	const data = await res.json();

	
	alert(data.message);
	
};
