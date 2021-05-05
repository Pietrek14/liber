const serverAddress = "http://localhost:3000";

const content = document.getElementById("content");
const notLoggedIn = document.getElementById("not-logged-in");

const session = JSON.parse(window.localStorage.getItem("session"));

// Jeśli użytkownik jest niezalogowany
if (session === null) {
	window.location = "./login/index.html";
}

content.innerText = `Zalogowano na sesji: ${session._id}`;
