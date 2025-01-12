const joi = require("joi");

// validation schema for user registration

const registerSchema = joi.object({
  username: joi.string().min(6).max(25).alphanum().required(), 
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(8)
    // Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required(),
  roles: joi
    .array()
    .items(joi.string().valid("trainer", "elite", "professor"))
    .default(["trainer"]),
});

// validation schema for username
const usernameSchema = joi.object({
  username: joi.string(6).min(25).alphanum().required,
});

// validation schema for password (asked once username is found)
const passwordSchema = joi.object({
  password: joi.string(8).required(),
});

// validation schema for user login
// const loginSchema = joi.object({
//   email: joi.string().email().required(),
//   password: joi.string().min(8).required(),
// });

// const validateLogin = (data) => {
//   const { error, value } = loginSchema.validate(data);
//   return { error, value };
// };

const validateRegistration = (data) => {
  const { error, value } = registerSchema.validate(data);
  return { error, value };
};

const validateUsername = (data) => {
  const {error, value} = usernameSchema.validate(data)
  return {error, value}
}

const validatePassword = (data) => {
  const {error, value} = passwordSchema.validate(data);
  return {error, value}
}

// Export the validation functions to be used by routers
module.exports = {
  validateRegistration,
  validateUsername,
  validatePassword
};
