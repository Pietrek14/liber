const { Router } = require("express");

const router = Router();

router.get("/", async (req, res) => {
	res.status(200).json({ email: req.user.email});
});

module.exports = router;
