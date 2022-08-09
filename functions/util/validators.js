// validators.js

//cleaned this function up a bit from the original
const isEmpty = (string) => !string.trim()

exports.validateLoginData = (data) => {
   let errors = {};
   if (isEmpty(data.email)) errors.email = 'Must not be empty';
   if (isEmpty(data.password)) errors.password = 'Must not be  empty';
   return {
       errors,
       valid: Object.keys(errors).length === 0 ? true : false
    };
};