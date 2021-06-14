import { serverAddress } from "./scripts/constants.js";
import { alert } from "./scripts/alert.js";

const content = document.getElementById("content");

const init = async () => {
	const res = await fetch(`${serverAddress}/getname`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (res.status === 401) {
		window.location = "./login/";
	}

	const recommendBooksRequest = await fetch(`${serverAddress}/recommendbooks`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const recommendedBooks = await recommendBooksRequest.json();

	if (!recommendBooksRequest.ok) {
		alert(recommendBooks.message);
	}

	recommendedBooks.forEach(async (bookId) => {
		const bookRequest = await fetch(`${serverAddress}/getbookinfo/${bookId}`);

		const book = await bookRequest.json();

		if (!bookRequest.ok) {
			return;
		}

		const a = document.createElement("a");

		a.setAttribute("href", `./book/index.html?book=${bookId}`);

		const img = document.createElement("img");

		img.setAttribute("src", book.coverUrl);
		img.setAttribute("width", "176");
		img.setAttribute("height", "257");

		a.appendChild(img);
		content.appendChild(a);
	});
};

init();

import setUpSideBar from "./scripts/sideBar.js";

setUpSideBar("./login/", "./user/", "./userBooks/");
