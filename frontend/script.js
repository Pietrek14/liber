import { serverAddress } from "./scripts/constants.js";

const content = document.getElementById("content");
const borgarMenu = document.getElementById("borgar-menu");
const sideBar = document.getElementById("side-bar");
const sideBarClose = document.getElementById("side-bar-close");

const logoutButton = document.getElementById("logout-button");

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

	const name = data.name;

	content.innerText = `Witaj, ${name}!`;
};

init();

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
		window.location = "./login/";
		return;
	}

	const data = await res.json();

	alert(data.message);
};
