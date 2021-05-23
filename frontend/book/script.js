import { serverAddress } from "../scripts/constants.js";

const borgarMenu = document.getElementById("borgar-menu");
const sideBar = document.getElementById("side-bar");
const sideBarClose = document.getElementById("side-bar-close");

const logoutButton = document.getElementById("logout-button");

const title = document.getElementById("title");
const author = document.getElementById("author");
const description = document.getElementById("description");
const cover = document.getElementById("cover");
const rating = document.getElementById("rating");

const starsDiv = document.getElementById("stars");
const stars = starsDiv.children;

const borrowButton = document.getElementById("borrow-button");
const readButton = document.getElementById("read-button");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const book = urlParams.get("book");
// 60a6dedec11b102ca8443d03 - Autostopem przez Galaktykę

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

	// Pobieramy informacje o książce

	const bookInfoRequest = await fetch(`${serverAddress}/getbookinfo/${book}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const bookInfo = await bookInfoRequest.json();

	// Jeśli jest jakiś błąd (prawdopodobnie w linku zostało podany niepoprawne id książki), wróć na stronę główną

	if (bookInfoRequest.status !== 200) {
		window.location = "../index.html";
		return;
	}

	// Ustaw pola na odpowiednie wartości

	title.textContent = bookInfo.title;
	author.textContent = bookInfo.author;
	description.textContent = bookInfo.description;
	rating.textContent = bookInfo.rating.toLocaleString("en-US", {
		maximumFractionDigits: 1,
		minimumFractionDigits: 1,
	});
	cover.setAttribute("src", bookInfo.coverUrl);
	cover.setAttribute("alt", `Okładka książki "${bookInfo.title}"`);

	// Jeśli książka jest dostępna do czytania online, to też ustaw

	if (bookInfo.content !== null) {
		readButton.onclick = () => {
			window.location = bookInfo.content;
		};
	} else {
		readButton.classList.add("d-none");
	}

	// Tutaj dodać ocenianie książki przez użytkownika

	borrowButton.onclick = async () => {
		// Tutaj dodać wypożyczanie książki
	};
};

init();

// Menu boczne

function openSideBar() {
	borgarMenu.classList.add("active");
	sideBar.classList.add("active");
}

function closeSideBar() {
	borgarMenu.classList.remove("active");
	sideBar.classList.remove("active");
}

borgarMenu.onclick = openSideBar;
sideBarClose.onclick = closeSideBar;

logoutButton.onclick = async () => {
	const res = await fetch(`${serverAddress}/logout`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (res.status === 200) {
		window.location = "../login/";
		return;
	}

	const data = await res.json();

	alert(data.message);
};
