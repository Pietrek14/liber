import { serverAddress } from "../scripts/constants.js";

const content = document.getElementById("content");

// znowu z internetu
// dodaje dni do daty
Date.prototype.addDays = function (days) {
	let date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

// internet mnie lubi bardzo i ja go tez
// to formatuje date do stringa i fajnie
Date.prototype.yyyymmdd = function () {
	let mm = this.getMonth() + 1; // getMonth() is zero-based
	let dd = this.getDate();

	return [
		this.getFullYear(),
		(mm > 9 ? "" : "0") + mm,
		(dd > 9 ? "" : "0") + dd,
	].join("");
};

// ksiazki na ekran
const init = async () => {
	const res = await fetch(`${serverAddress}/getborrows`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (res.status === 401) {
		window.location = "../login/";
	}

	if (data.message === "nie ma") {
		// ez

		return;
	}

	// console.log(data);

	data.borrows.forEach(async (borrow) => {
		const res2 = await fetch(`${serverAddress}/getbookinfo/${borrow.book}`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const book = await res2.json();

		const tile = document.createElement("tile");
		tile.setAttribute(
			"class",
			"tile d-flex flex-column justify-content-center align-items-center"
		);

		const a = document.createElement("a");

		a.setAttribute("href", `../book/index.html?book=${borrow.book}`);

		const img = document.createElement("img");

		img.setAttribute("src", book.coverUrl);
		img.setAttribute("width", "176");
		img.setAttribute("height", "257");

		a.appendChild(img);

		tile.appendChild(a);

		let tempdate = new Date(borrow.borrow_date);

		const borrow_date = tempdate;
		const receive_date = tempdate.addDays(3);
		const giveback_date = tempdate.addDays(31);

		console.log(tempdate);

		const p1 = document.createElement("span");
		const p2 = document.createElement("span");
		const p3 = document.createElement("span");

		p1.innerHTML = `Data wypożyczenia: <b>${borrow_date
			.toISOString()
			.substring(0, 10)}</b>`;
		p2.innerHTML = `Data odebrania książki: <b>${receive_date
			.toISOString()
			.substring(0, 10)}</b>`;
		p3.innerHTML = `Data oddania książki: <b>${giveback_date
			.toISOString()
			.substring(0, 10)}</b>`;

		tile.appendChild(p1);
		tile.appendChild(p2);
		tile.appendChild(p3);

		content.appendChild(tile);
	});

	// console.log(`Witaj, ${name}! o email ${email}`);
	// nameContent.innerText = `Nazwa: ${name}`;
	// emailContent.innerText = `Email: ${email}`;
};

init();

// side menu stuff
import setUpSideBar from "../scripts/sideBar.js";
setUpSideBar("../login/");

// przyciski shite hee`
