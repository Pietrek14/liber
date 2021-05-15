const { Router } = require("express");

const router = Router();

router.get("/", async (req, res) => {
	res.status(200).json({ name: req.user.name });
});

module.exports = router;
