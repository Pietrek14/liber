const { getUserBySession } = require("../endpoints/scripts/getUser");
const error = require("../endpoints/scripts/error");

module.exports = async (req, res, next) => {
	// Jeśli w ogóle nie ma cookies
	if (!req.cookies) {
		error("Brak plików cookie", res, 401);
		return;
	}

	// Jeśli nie ma cookie sesji
	if (!req.cookies.session) {
		error("Brak plików cookie sesji", res, 401);
		return;
	}

	// Znajdź użytkownika na podanej sesji
	const user = await getUserBySession(req.cookies.session);

	// Jeśli podano niepoprawne ID sesji
	if (!user) {
		error("Niepoprawna sesja", res, 401);
		return;
	}

	// Przekaż dane sesji i użytkownika w obiekcie req
	req.session = req.cookies.session;
	req.user = user;

	next();
};
