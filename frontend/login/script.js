import { serverAddress } from "../scripts/constants.js";
import { alert } from "../scripts/alert.js";

const submitButton = document.getElementById("submit-button");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

function validateIfNotEmpty(value, errorMessage) {
	if (value.length === 0) {
		alert(errorMessage);
		return false;
	}
	return true;
}

function validateRegex(value, regex, errorMessage) {
	if (regex.test(value)) return true;
	alert(errorMessage);
	return false;
}

function validateEmail(email, errorMessage) {
	const re =
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return validateRegex(String(email).toLowerCase(), re, errorMessage);
}

function validateMinLength(value, length, errorMessage) {
	if (value.length < length) {
		alert(errorMessage);
		return false;
	}
	return true;
}

function validateMaxLength(value, length, errorMessage) {
	if (value.length > length) {
		alert(errorMessage);
		return false;
	}
	return true;
}

submitButton.onclick = async (e) => {
	e.preventDefault();

	const email = emailInput.value;
	const password = passwordInput.value;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(email, "Email nie może być pusty!")) return;
	if (!validateIfNotEmpty(password, "Hasło nie może być puste!")) return;

	// Sprawdz, czy email jest poprawny
	if (!validateEmail(email, "Podano niepoprawny adres email!")) return;

	// Sprawdz, czy haslo ma odpowiednią długość
	if (
		!validateMinLength(
			password,
			8,
			"Hasło musi składać się z przynajmniej ośmiu znaków!"
		)
	) {
		return;
	}

	if (
		!validateMaxLength(password, 64, "Hasło nie może być dłuższe niż 64 znaki!")
	) {
		return;
	}

	if (
		!validateRegex(
			password,
			/[a-z]/g,
			"Hasło musi zawierać przynajmniej jedną małą literę!"
		)
	) {
		return;
	}

	if (
		!validateRegex(
			password,
			/[A-Z]/g,
			"Hasło musi zawierać przynajmniej jedną wielką literę!"
		)
	) {
		return;
	}

	if (
		!validateRegex(
			password,
			/[0-9]/g,
			"Hasło musi zawierać przynajmniej jedną cyfrę!"
		)
	) {
		return;
	}

	const res = await fetch(`${serverAddress}/login`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	});

	const data = await res.json();

	if (res.status !== 200) {
		alert(data.message);
		return;
	}

	window.location = "../index.html";
};
