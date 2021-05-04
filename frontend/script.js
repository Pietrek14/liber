const serverAddress = "http://localhost:3000";

const content = document.getElementById("content");
const notLoggedIn = document.getElementById("not-logged-in");

const session = JSON.parse(window.localStorage.getItem("session"));

if (session === null) {
	// Uzytkownik niezalogowany
	content.classList.add("d-none");
} else {
	// Uzytkownik zalogowany
	notLoggedIn.classList.add("d-none");

	content.innerText = `Zalogowano na sesji: ${session._id}`;
}
