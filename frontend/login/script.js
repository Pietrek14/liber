import { serverAddress } from "../scripts/constants.js";

const submitButton = document.getElementById("submit-button");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

const alertBox = document.getElementById("alert-box");
const alertBoxContent = document.getElementById("alert-box-content");
const alertBoxClose = document.getElementById("alert-box-close");

const cookiesBox = document.getElementById("cookies-section");
const cookiesButton = document.getElementById("allowing-cookies");

function getCookie(c_name){
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1){
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1){
        c_value = null;
    }
    else{
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1){
                c_end = c_value.length;
            }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

function isCookie(){
	let cookieAccept = getCookie("allowCookies");
	
	if (cookieAccept === "True"){
		cookiesBox.style.display = "none";
		console.log("masz cookie");
		
	} else{
		console.log("NO NIE MASZ NO")
		emailInput.disabled = true;
		passwordInput.disabled = true;
		submitButton.disabled = true;
	}
}
function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;

	emailInput.disabled = false;
	passwordInput.disabled = false;
	submitButton.disabled = false;

	cookiesBox.style.display = "none";
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

cookiesButton.addEventListener("click", 
	function () {
		setCookie("allowCookies", "True", null);
	})
window.onload = isCookie();