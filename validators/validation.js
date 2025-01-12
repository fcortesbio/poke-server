const joi = require("joi");

// validation schema for user registration

const registerSchema = joi.object({
  username: joi.string().min(6).max(25).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  roles: joi.array().items(joi.string()).default(["trainer"]),
});

// validation schema for user login

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const validateRegistration = (data) => {
  return registerSchema.validate(data);
};

const validateLogin = (data) => {
  return loginSchema.validate(data);
};

// Export the validation functions to be used by routers
module.exports = {
  validateRegistration,
  validateLogin,
};
