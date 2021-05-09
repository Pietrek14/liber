import { serverAddress } from "./scripts/constants.js";

const content = document.getElementById("content");
const notLoggedIn = document.getElementById("not-logged-in");

const res = await fetch(`${serverAddress}/getname`, {
	method: "GET",
	credentials: "include",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

if (res.status === 403) {
	// window.location = "./login/";
}

const data = await res.json();
const name = data.name;

content.innerText = `Witaj, ${name}!`;
