const error = require("./error");

function validateIfUndefined(value, errorMessage, res) {
	if (value === undefined) {
		error(errorMessage, res);
		return false;
	}
	return true;
}

function validateIfNotEmpty(value, errorMessage, res) {
	if (value.length === 0) {
		error(errorMessage, res);
		return false;
	}
	return true;
}

function validateRegex(value, regex, errorMessage, res) {
	if (regex.test(value)) return true;
	error(errorMessage, res);
	return false;
}

function validateEmail(email, errorMessage, res) {
	const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return validateRegex(String(email).toLowerCase(), re, errorMessage, res);
}

function validateMinLength(value, length, errorMessage, res) {
	if (value.length < length) {
		error(errorMessage, res);
		return false;
	}
	return true;
}

function validateMaxLength(value, length, errorMessage, res) {
	if (value.length > length) {
		error(errorMessage, res);
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
