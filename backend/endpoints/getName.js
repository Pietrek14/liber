const { Router } = require("express");
const router = require("./register");
const { getUserBySession } = require("./scripts/getUser");

const error = require("./scripts/error");
const {
	validateIfUndefined,
	validateIfNotEmpty,
} = require("./scripts/validation");

router.get("/", async (req, res) => {
	const cookies = req.cookies;

	console.log(cookies);

	const session = cookies.session;

	// Sprawdź, czy sesja została podana
	if (!validateIfUndefined(session, "Nie podano sesji", res, 401)) return;
	if (!validateIfNotEmpty(session, "Nie podano sesji", res, 401)) return;

	const user = getUserBySession(session);

	if (!user) {
		error("Nie ma takiego użytkownika", res);
		return;
	}

	res.status(200).json({ name: user.name });
});

module.exports = router;
