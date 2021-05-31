const alertBox = document.getElementById("alert-box");
const alertBoxContent = document.getElementById("alert-box-content");
const alertBoxClose = document.getElementById("alert-box-close");

// alert box shit here
function alert(message) {
	alertBoxContent.innerText = message;
	alertBox.classList.add("active");
}

function hideAlertBox() {
	alertBox.classList.remove("active");
}

alertBoxClose.onclick = hideAlertBox;

document.addEventListener("keydown", (e) => {
	hideAlertBox();
});

export { alert, hideAlertBox };
