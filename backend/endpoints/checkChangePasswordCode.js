// sprawdzam czy kod istnieje w bazie danych i jesli tak to wysylam 200 jesli nie to wysylam ???


const { Router } = require("express");

const error = require("./scripts/error");
const PasswordChange = require("../database/models/passwordChanges");

const router = Router();


// glowna funkcja
router.post("/", async (req, res) => {
    const data = req.body;

	const code = data.code;

	// pobieram z bazy danych profil o kodzie ktory dostaje z linku
	const passwordChangeSession = await PasswordChange.findOne({code: code});

	
	if (!passwordChangeSession) {
		error("nie pog", res);
		return;
	}
	else {
		error("pogchampy", res);
		return;
	}

});


module.exports = router;