const serverAddress = "http://localhost:3000";

const content = document.getElementById("content");
const notLoggedIn = document.getElementById("not-logged-in");

const session = window.localStorage.getItem("session");

if (session === undefined) {
	// Uzytkownik niezalogowany
	content.classList.add("d-none");

	console.log("aaaa");
} else {
	// Uzytkownik zalogowany
	notLoggedIn.classList.add("d-none");

	content.innerText = session._id;
	console.log(session.email);
}
