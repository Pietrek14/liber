function error(errorMessage, res, code = 400) {
	res.status(code).json({ message: errorMessage });
}

module.exports = error;
