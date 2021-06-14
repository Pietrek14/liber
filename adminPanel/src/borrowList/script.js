const { ipcRenderer } = require("electron");
const { alert } = require("../scripts/alert");

const borrowList = document.getElementById("borrow-list");

const refresh = async () => {
	borrowList.innerHTML = "";

	const users = JSON.parse(ipcRenderer.sendSync("get-whitelisted-users"));

	users.forEach((user) => {
		const borrows = ipcRenderer.sendSync("get-user-borrows", user._id);

		if (!borrows.length > 0) {
			return;
		}

		const userDiv = document.createElement("div");

		userDiv.setAttribute("class", "d-flex align-items-center p-3");

		const userH3 = document.createElement("h3");

		userH3.classList.add("text-white");

		userH3.innerText = user.email;

		userDiv.appendChild(userH3);

		borrowList.appendChild(userDiv);

		borrows.forEach((borrow) => {
			const book = JSON.parse(
				ipcRenderer.sendSync("get-book-by-id", borrow.book)
			);

			const bookDiv = document.createElement("div");

			bookDiv.setAttribute(
				"class",
				"d-flex justify-content-between align-items-center ml-5 p-3"
			);

			const bookTitle = document.createElement("h5");
			bookTitle.innerText = book.title;

			bookDiv.appendChild(bookTitle);

			if (!borrow.received) {
				const borrowReceivedButton = document.createElement("button");

				borrowReceivedButton.innerText = "Potwierdź wypożyczenie ksiażki";

				borrowReceivedButton.onclick = () => {
					ipcRenderer.send("borrow-received", borrow.id);
				};

				bookDiv.appendChild(borrowReceivedButton);
			}

			borrowList.append(bookDiv);
		});
	});
};

refresh();

ipcRenderer.on("borrow-received-success", (event, arg) => {
	alert("Potwierdzono wypożyczenie książki.");
	refresh();
});

ipcRenderer.on("borrow-received-failure", (event, arg) => {
	alert(`Wystąpił błąd: ${arg}`);
});
