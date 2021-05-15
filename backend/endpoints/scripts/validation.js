const error = require("./error");

function validateIfUndefined(value, errorMessage, res, code = 200) {
	if (value === undefined) {
		error(errorMessage, res, code);
		return false;
	}
	return true;
}

function validateIfNotEmpty(value, errorMessage, res, code = 200) {
	if (value.length === 0) {
		error(errorMessage, res, code);
		return false;
	}
	return true;
}

function validateRegex(value, regex, errorMessage, res, code = 200) {
	if (regex.test(value)) return true;
	error(errorMessage, res, code);
	return false;
}

function validateEmail(email, errorMessage, res, code = 200) {
	const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return validateRegex(
		String(email).toLowerCase(),
		re,
		errorMessage,
		res,
		code
	);
}

function validateMinLength(value, length, errorMessage, res, code = 200) {
	if (value.length < length) {
		error(errorMessage, res, code);
		return false;
	}
	return true;
}

function validateMaxLength(value, length, errorMessage, res, code = 200) {
	if (value.length > length) {
		error(errorMessage, res, code);
		return false;
	}
	return true;
}

module.exports = {
	validateIfUndefined,
	validateIfNotEmpty,
	validateMaxLength,
	validateMinLength,
	validateRegex,
	validateEmail,
};
