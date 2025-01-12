const joi = require("joi");
require("dotenv").config();

// validation schema for env files
const envSchema = joi
  .object({
    MONGODB_URI: joi.string().uri().required(),
    JWT_SECRET: joi.string().required(),
    SESSION_SECRET: joi.string().required(),
    PORT: joi.number().port().default(3000),
    JWT_EXPIRES: joi.string().required()
    // ... more env vars can be added here
  })
  .unknown(true);

// validation schema for user registration
const registerSchema = joi.object({
  username: joi.string().min(3).max(25).regex(/^[a-zA-Z0-9_]+$/).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(8)
    // Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required(),
  roles: joi
    .array()
    .items(joi.string().valid("trainer", "elite"))
    .default(["trainer"]),
});

// validation schema for username
const usernameSchema = joi.object({
  username: joi.string().min(3).max(25).regex(/^[a-zA-Z0-9_]+$/).required()});

// validation schema for password (asked once username is found)
const passwordSchema = joi.object({
  password: joi.string().min(8).required(),
});

const validateEnv = (data) => {
  const { error, value: envVars } = envSchema.validate(process.env);

  if (error) {
    console.error(`Environment variable validation error: ${error.message}`);
    process.exit(1);
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
