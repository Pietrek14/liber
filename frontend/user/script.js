import { serverAddress } from "../scripts/constants.js";

const borgarMenu = document.getElementById("borgar-menu");
const sideBar = document.getElementById("side-bar");
const sideBarClose = document.getElementById("side-bar-close");

const logoutButton = document.getElementById("logout-button");

// dane uzytkownika z serwera na jego ekran:)
const init = async () => {
	const res1 = await fetch(`${serverAddress}/getname`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data1 = await res1.json();

	if (res1.status === 401) {
		window.location = "./login/";
	}

	const res2 = await fetch(`${serverAddress}/getemail`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data2 = await res2.json();

	if (res2.status === 401) {
		window.location = "./login/";
	}

	const name = data1.name;
	const email = data2.email;

	console.log(`Witaj, ${name}! o email ${email}`);
	// content.innerText = `Witaj, ${name}! o email ${email}`;
};

init();

// side menu stuff 
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


// przyciski shite hee`

// logout
logoutButton.onclick = async () => {
	const res = await fetch(`${serverAddress}/logout`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (res.status === 200) {
		window.location = "./login/";
		return;
	}

	const data = await res.json();

	alert(data.message);
};
