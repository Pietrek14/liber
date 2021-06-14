const { ipcRenderer } = require("electron");
const { alert } = require("../scripts/alert");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const authorInput = document.getElementById("author");
const publisherInput = document.getElementById("publisher");
const releaseDateInput = document.getElementById("release-date");
const coverUrlInput = document.getElementById("cover-url");
const contentUrlInput = document.getElementById("content-url");
const tagsInput = document.getElementById("tags");
const submitButton = document.getElementById("submit");

submitButton.onclick = () => {
	if (!titleInput.value) {
		alert("Nie podano tytułu książki.");
		return;
	}

	if (!authorInput.value) {
		alert("Nie podano autora książki.");
		return;
	}

	if (!descriptionInput.value) {
		alert("Nie podano opisu książki.");
		return;
	}

	if (!releaseDateInput.value) {
		alert("Nie podano daty wydania książki.");
		return;
	}

	if (!publisherInput.value) {
		alert("Nie podano wydawcy książki.");
		return;
	}

	if (!coverUrlInput.value) {
		alert("Nie podano linku do okładki książki.");
		return;
	}

	if (!tagsInput.value) {
		alert("Nie podano tagów książki.");
		return;
	}

	if (!tagsInput.value.match(/^[a-ząćęłńóśźżĄĘŁŃÓŚŹŻ\s-]+$/)) {
		alert(
			"Tagi muszą być porozdzielane spacjami i składać się jedynie z małych liter i myślników."
		);
		return;
	}

	ipcRenderer.send("register-book", [
		titleInput.value,
		authorInput.value,
		descriptionInput.value,
		releaseDateInput.value,
		publisherInput.value,
		coverUrlInput.value,
		tagsInput.value.split(" "),
		contentUrlInput.value,
	]);
};

ipcRenderer.on("book-register-failure", (event, arg) => {
	alert("Dodawanie książki nie powiodło się");
});

ipcRenderer.on("book-register-successful", (event, arg) => {
	alert(`Dodano książkę ${arg}.`);
	window.location = "../bookList/index.html";
});
