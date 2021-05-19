import { serverAddress } from "./scripts/constants.js";

const content = document.getElementById("content");
const borgarMenu = document.getElementById("borgar-menu");
const sideBar = document.getElementById("side-bar");
const sideBarClose = document.getElementById("side-bar-close");

let sideBarOpened = false;

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
	sideBarOpened = true;
}

function closeSideBar() {
	borgarMenu.classList.remove("active");
	sideBar.classList.remove("active");
	sideBarOpened = false;
}

function toggleSideBar() {
	if (sideBarOpened) closeSideBar();
	else openSideBar();
}

borgarMenu.onclick = openSideBar;
sideBarClose.onclick = closeSideBar;
