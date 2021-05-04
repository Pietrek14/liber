const serverAddress = "http://localhost:3000";

const submitButton = document.getElementById("submit-button");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

const alertBox = document.getElementById("alert-box");
const alertBoxContent = document.getElementById("alert-box-content");
const alertBoxClose = document.getElementById("alert-box-close");

function alert(message) {
	alertBoxContent.innerText = message;
	alertBox.classList.add("active");
}

function hideAlertBox() {
	alertBox.classList.remove("active");
}

alertBoxClose.onclick = hideAlertBox;

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		hideAlertBox();
	}
});

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
	const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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

	const name = nameInput.value;
	const email = emailInput.value;
	const password = passwordInput.value;

	// Sprawdz, czy wszystkie pola są defined
	if (!validateIfNotEmpty(name, "Imię nie może być puste!")) return;
	if (!validateIfNotEmpty(email, "Email nie może być pusty!")) return;
	if (!validateIfNotEmpty(password, "Hasło nie może być puste!")) return;

	// Sprawdz, czy wszystkie pola zostały wypełnione
	if (!validateIfNotEmpty(name, "Imię nie może być puste!")) return;
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

	const res = await fetch(`${serverAddress}/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: name,
			email: email,
			password: password,
		}),
	});
	const data = await res.json();

	if (res.status === 400) {
		alert(data.message);
	} else if (res.status === 200) {
		alert("Zarejestrowano pomyślnie.");
	}
};
