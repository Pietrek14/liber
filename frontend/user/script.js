import { serverAddress } from "../scripts/constants.js";

const borgarMenu = document.getElementById("borgar-menu");
const sideBar = document.getElementById("side-bar");
const sideBarClose = document.getElementById("side-bar-close");

const logoutButton = document.getElementById("logout-button");
const logoutButton2 = document.getElementById("logout-button-2");
const nameContent = document.getElementById("name");
const emailContent = document.getElementById("email");
const nameChageButton = document.getElementById("namechange-button");
const passChageButton = document.getElementById("passchange-botton");


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
		window.location = "../login/";
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
		window.location = "../login/";
	}

	const name = data1.name;
	const email = data2.email;

	console.log(`Witaj, ${name}! o email ${email}`);
	nameContent.innerText = `Nazwa: ${name}`;
	emailContent.innerText = `Email: ${email}`;
};

init();

// side menu stuff 
import setUpSideBar from "../scripts/sideBar.js";
setUpSideBar("../login/");



// przyciski shite hee`


logoutButton2.onclick = async () => {
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

// zmiana nazwy
nameChageButton.onclick = async () => {
	window.location.replace("../nameChange");
};

// zmaina hasla
passChageButton.onclick = async () => {
	window.location.replace("../passwordForgot");
};