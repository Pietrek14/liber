const { Router } = require("express");
const error = require("./scripts/error");
const Borrows = require("../database/models/borrow");

const router = Router();



router.post("/", async (req, res) => {
	const id = req.body.id;

	const exist = await Borrows.find({_id: id});

	if(!exist) {
		error("ale jak?????", res);
		return;
	}

	// if(exist.)

	const delete_borrow = await Borrows.deleteOne({_id: id});

	if(!delete_borrow) {
		error("mongus nie dziala", res, 500);
		return;
	}
	else {
		res.status(200).json({confirm: "yes"});
		return
	}
	
});

module.exports = router;
