import { serverAddress } from "./constants.js";

const borgarMenu = document.getElementById("borgar-menu");
const sideBar = document.getElementById("side-bar");
const sideBarClose = document.getElementById("side-bar-close");

const nameField = document.getElementById("name");
const logoutButton = document.getElementById("logout-button");

function openSideBar() {
	borgarMenu.classList.add("active");
	sideBar.classList.add("active");
}

function closeSideBar() {
	borgarMenu.classList.remove("active");
	sideBar.classList.remove("active");
}

export default async function setUpSideBar(loginFileLocation = "../login/") {
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
			window.location = loginFileLocation;
			return;
		}

		const data = await res.json();

		alert(data.message);
	};

	const res = await fetch(`${serverAddress}/getname`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();

	if (res.status === 401) {
		window.location = loginFileLocation;
	}

	const name = data.name;

	nameField.innerText = name;
}
