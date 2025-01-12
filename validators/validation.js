const joi = require("joi");

// validation schema for user registration

const registerSchema = joi.object({
  username: joi.string().min(3).max(30).alphanum().required(), // Alphanumeric usernames
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

// validation schema for user login

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const validateRegistration = (data) => {
  const { error, value } = registerSchema.validate(data);
  return { error, value };
};
const validateLogin = (data) => {
  const { error, value } = loginSchema.validate(data);
  return { error, value };
};

// Export the validation functions to be used by routers
module.exports = {
  validateRegistration,
  validateLogin,
};
