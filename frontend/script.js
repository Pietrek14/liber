import { serverAddress } from "./scripts/constants.js";

const content = document.getElementById("content");

const res = await fetch(`${serverAddress}/getname`, {
	method: "GET",
	credentials: "include",
	headers: {
		"Content-Type": "application/json",
	},
});

const data = await res.json();

if (res.status === 401) {
	// window.location = "./login/";
	console.log(data.message);
}

const name = data.name;

content.innerText = `Witaj, ${name}!`;
