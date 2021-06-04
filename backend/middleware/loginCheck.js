const { getUserBySession } = require("../endpoints/scripts/getUser");
const { deleteSession } = require("../database/scripts/delete");
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

	// Jeśli użytkownik nie jest zwhitelistowany
	if (!user.whitelisted) {
		error("Konto nie zostało zweryfikowane przez bibliotekarza.", res, 401);

		// Usuń cookie sesji z klienta
		res.clearCookie("session");

		// Usuń sesję z bazy danych
		deleteSession(req.session);

		return;
	}

	// Przekaż dane sesji i użytkownika w obiekcie req
	req.session = req.cookies.session;
	req.user = user;

	next();
};
