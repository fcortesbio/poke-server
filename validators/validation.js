const joi = require("joi");
require("dotenv").config();

// validation schema for env files
const envSchema = joi.object({
  MONGODB_URI: joi.string().uri().required(),
  PORT: joi.number().port().default(3000),
  // more env vars can be added here
});

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

const validateEnv = (data) => {
  const { error, value: envVars } = envSchema.validate(process.env);

  if (error) {
    console.error(`Environment variable validation error: ${error.message}`);
    process.exit(1);
  } else {
    const mongodbUri = envVars.MONGODB_URI;
    const port = envVars.PORT;
  }
};

const validateRegistration = (data) => {
  const { error, value } = registerSchema.validate(data);
  return { error, value };
};

const validateUsername = (data) => {
  const { error, value } = usernameSchema.validate(data);
  return { error, value };
};

const validatePassword = (data) => {
  const { error, value } = passwordSchema.validate(data);
  return { error, value };
};

// Export the validation functions to be used by routers
module.exports = {
  validateEnv,
  validateRegistration,
  validateUsername,
  validatePassword,
};
