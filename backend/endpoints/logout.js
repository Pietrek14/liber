const { Router } = require("express");
const { deleteSession } = require("../database/scripts/delete");
const Session = require("../database/models/session");

const error = require("./scripts/error");

const router = Router();

router.post("/", async (req, res) => {
	// Znajdź tą sesję, żeby sprawdzić czy istnieje
	const session = Session.findById(req.session);

	// Jeśli nie istnieje, daj errora i zakończ funkcję
	if (!session) return error("Nie jesteś zalogowany!", res);

	// Usuń cookie sesji z klienta
	res.clearCookie("session");

	// Usuń sesję z bazy danych
	deleteSession(req.session);

	// Zwróć komunikat, że wylogowano
	res.json({ message: "Wylogowano poprawnie" });
});

module.exports = router;
