import { serverAddress } from "../scripts/constants.js";
import { alert } from "../scripts/alert.js";

const submitemail = document.getElementById("email");
const submitButton = document.getElementById("submit-button");

function validateIfNotEmpty(value, errorMessage) {
	if (value.length === 0) {
		alert(errorMessage);
		return false;
	}
	return true;
}

submitButton.onclick = async (e) => {
	e.preventDefault();

	const email = submitemail.value;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(email, "Nie wpisano emailu.")) return;

	const res = await fetch(`${serverAddress}/sendpasswordchange`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
		}),
	});
	const data = await res.json();

	if (!res.ok) {
		alert(data.message);
		return;
	}

	if (res.status === 400) {
		alert(data.message);
	} else if (res.status === 200) {
		window.location.replace("./emailsend.html");
	}
};
