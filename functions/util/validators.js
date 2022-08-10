// validators.js

//cleaned this function up a bit from the original
const isEmpty = (string) => !string.trim()

const isEmail = (email) => {
	const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(emailRegEx)) return true;
	else return false;
};

exports.validateLoginData = (data) => {
   let errors = {};
   if (isEmpty(data.email)) errors.email = notEmpty;
   if (isEmpty(data.password)) errors.password = 'Must not be  empty';
   return {
       errors,
       valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateSignUpData = (data) => {
    notEmpty = 'Must not be empty'
	let errors = {};

	if (isEmpty(data.email)) {
		errors.email = notEmpty;
	} else if (!isEmail(data.email)) {
		errors.email = 'Must be a valid email address';
	}

	if (isEmpty(data.firstName)) errors.firstName = notEmpty;
	if (isEmpty(data.lastName)) errors.lastName = notEmpty;
	if (isEmpty(data.phoneNumber)) errors.phoneNumber = notEmpty;
	if (isEmpty(data.country)) errors.country = notEmpty;

	if (isEmpty(data.password)) errors.password = notEmpty;
	if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
	if (isEmpty(data.username)) errors.username = notEmpty;

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};