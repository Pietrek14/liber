const { ipcRenderer } = require("electron");
const { alert } = require("../scripts/alert");

const emailInput = document.getElementById("email-input");
const submitButton = document.getElementById("submit-button");
const whitelistedUsersDiv = document.getElementById("whitelisted-users");

submitButton.onclick = async (e) => {
	e.preventDefault();

	ipcRenderer.send("verify-user", emailInput.value);
};

function refreshWhitelistedUsers() {
	const whitelistedUsers = JSON.parse(
		ipcRenderer.sendSync("get-whitelisted-users")
	);

	whitelistedUsersDiv.innerHTML = "<hr />";

	whitelistedUsers.forEach((user) => {
		const userDiv = document.createElement("div");

		userDiv.classList.add("verified-user");
		userDiv.classList.add("d-flex");
		userDiv.classList.add("justify-content-between");

		const nameSpan = document.createElement("span");
		const emailSpan = document.createElement("span");

		nameSpan.innerText = user.name;
		emailSpan.innerText = user.email;

		const deleteButton = document.createElement("button");

		deleteButton.innerText = "Usuń";

		deleteButton.onclick = () => {
			ipcRenderer.send("unverify-user", user.email);
		};

		userDiv.appendChild(nameSpan);
		userDiv.appendChild(emailSpan);
		userDiv.appendChild(deleteButton);

		whitelistedUsersDiv.appendChild(userDiv);

		const hrDiv = document.createElement("div");
		hrDiv.classList.add("px-5");
		hrDiv.classList.add("mx-5");

		const innerHrDiv = document.createElement("div");
		innerHrDiv.classList.add("px-5");

		const hr = document.createElement("hr");

		innerHrDiv.appendChild(hr);
		hrDiv.appendChild(innerHrDiv);

		whitelistedUsersDiv.appendChild(hrDiv);
	});
}

refreshWhitelistedUsers();

ipcRenderer.on("verification-error", (event, arg) => {
	alert(arg);
});

ipcRenderer.on("unverification-error", (event, arg) => {
	alert(arg);
});

ipcRenderer.on("verification-successful", (event, arg) => {
	alert(`Zweryfikowano użytkownika ${arg}.`);
	refreshWhitelistedUsers();
});

ipcRenderer.on("unverification-successful", (event, arg) => {
	alert(`Usunięto weryfikację użytkownika ${arg}.`);
	refreshWhitelistedUsers();
});
