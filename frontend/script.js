import { serverAddress } from "./scripts/constants.js";
import { alert } from "./scripts/alert.js";

const content = document.getElementById("content");

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
		window.location.replace("./login/");
	}

	const name = data.name;

	content.innerText = `Witaj, ${name}!`;
};

init();

import setUpSideBar from "./scripts/sideBar.js";

setUpSideBar("./login/");
