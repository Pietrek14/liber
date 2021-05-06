const { Router } = require("express");

const router = Router();

function error(errorMessage, res, code = 400) {
	res.status(code).json({ message: errorMessage });
}

router.get("/", async (req, res) => {
    const data = req.body;
    
});

module.exports = router;