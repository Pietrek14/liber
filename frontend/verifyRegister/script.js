const serverAddress = "http://localhost:3000";

const submitButton = document.getElementById("submit-button");
const codeInput = document.getElementById("verification-code");
const resendCode = document.getElementById("resend-code");

const alertBox = document.getElementById("alert-box");
const alertBoxContent = document.getElementById("alert-box-content");
const alertBoxClose = document.getElementById("alert-box-close");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const email = urlParams.get("email");

if (!email) {
	window.location = "../index.html";
}

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

resendCode.onclick = async (e) => {
	e.preventDefault();

	const res = await fetch(`${serverAddress}/resendcode`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
		}),
	});

	const data = await res.json();

	if (res.status !== 200) {
		alert(data.message);
		return;
	}

	alert("Wysłano emaila ponownie.");
};

submitButton.onclick = async (e) => {
	e.preventDefault();

	const code = codeInput.value;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(code, "Nie wpisano kodu.")) return;

	const res = await fetch(`${serverAddress}/verifyemail`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
			code: code,
		}),
	});
	const data = await res.json();

	if (res.status === 400) {
		alert(data.message);
	} else if (res.status === 200) {
		window.location = "../verified/";
	}
};
