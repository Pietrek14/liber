// Żeby wejść na stronę autora wpisujesz: "http://127.0.0.1:5500/frontend/author/?author=" + imię i nazwisko autora zakodowane procentowo (%20 zamiast spacji, https://meyerweb.com/eric/tools/dencoder/)

import { serverAddress } from "../scripts/constants.js";
import { alert } from "../scripts/alert.js";

const authorH1 = document.getElementById("author");
const bookList = document.getElementById("book-list");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const author = urlParams.get("author");

// Wstaw imię autora do h1
authorH1.textContent = decodeURI(author);

// Trzeba robić w funkcji asynchronicznej, żeby można używać awaitów

const init = async () => {
	// Sprawdzamy czy użytkownik jest zalogowany

	const res = await fetch(`${serverAddress}/getname`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (res.status === 401) {
		window.location = "../login/";
	}

	// Jeśli nie podano autora przejdź na stronę główną

	if (!author) {
		window.location = "../index.html";
	}

	// Pobieramy informacje o książkach autora

	const authorBooksRequest = await fetch(
		`${serverAddress}/getauthorbooks/${author}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	// Prawdopodobnie niepoprawny autor
	if (!authorBooksRequest.ok) {
		window.location = "../";
	}

	const books = await authorBooksRequest.json();

	books.forEach((book) => {
		const a = document.createElement("a");
		const img = document.createElement("img");

		a.setAttribute("href", `../book/?book=${book._id}`);
		img.setAttribute("src", book.coverUrl);
		img.setAttribute("alt", `Okładka książki "${book.title}"`);

		a.appendChild(img);
		bookList.appendChild(a);
	});
};

init();

// Menu boczne

import setUpSideBar from "../scripts/sideBar.js";

setUpSideBar();
