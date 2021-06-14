const { Router } = require("express");
const fetch = require("node-fetch");

const router = Router();

router.get("/", async (req, res) => {
	const user = req.user.id;

	const pythonRequest = await fetch("http://localhost:5000/recommendbooks", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			user: user,
		}),
	});

	const data = await pythonRequest.json();

	res.status(pythonRequest.status).json(data);
});

module.exports = router;
