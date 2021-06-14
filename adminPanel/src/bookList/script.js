const { ipcRenderer, shell } = require("electron");
const { alert } = require("../scripts/alert");
const mongoose = require("mongoose");

const bookList = document.getElementById("book-list");

function refreshBookList() {
	bookList.innerHtml = "";

	const books = ipcRenderer.sendSync("get-books");

	books.forEach((book) => {
		const div = document.createElement("div");

		div.classList.add("book");
		div.classList.add("d-flex");
		div.classList.add("px-5");
		div.classList.add("py-4");
		div.classList.add("justify-content-between");

		const title = document.createElement("h5");

		title.innerText = book.title;

		title.classList.add("h5");
		title.classList.add("text-white");

		// mongo jest retarded

		console.log(book.id);
		title.onclick = () => {
			shell.openExternal(
				`http://127.0.0.1:5500/frontend/book/index.html?book=${book.id}`
			);
		};

		const deleteButton = document.createElement("div");

		deleteButton.innerHTML = `<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22.121"
			height="22.121"
			viewBox="0 0 22.121 22.121"
		>
			<g
				id="Component_8_1"
				data-name="Component 8 – 1"
				transform="translate(1.061 1.061)"
			>
				<line
					id="Line_9"
					data-name="Line 9"
					x1="20"
					y2="20"
					fill="none"
					stroke="#fff"
					stroke-width="3"
				/>
				<line
					id="Line_10"
					data-name="Line 10"
					x2="20"
					y2="20"
					fill="none"
					stroke="#fff"
					stroke-width="3"
				/>
			</g>
		</svg>`;

		deleteButton.onclick = () => {
			ipcRenderer.send("delete-book", book.id);
		};

		div.appendChild(title);
		div.appendChild(deleteButton);
		bookList.append(div);
	});
}

refreshBookList();

ipcRenderer.on("book-deletion-successful", () => {
	alert("Usunięto książkę.");
	refreshBookList();
});

ipcRenderer.on("book-deletion-failure", () => {
	alert("Nie udało się usunąć książki.");
});
