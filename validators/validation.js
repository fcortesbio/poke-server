const Joi = require("joi").extend(require("@hapi/joi-date"));
require("dotenv").config();

// validation schema for env files
const envSchema = Joi.object({
  MONGODB_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  PORT: Joi.number().port().default(3000),
  JWT_EXPIRES: Joi.string().required(),
  // ... more env vars can be added here
}).unknown(true);

/// -- individual user data schemas ---

const usernameSchema = Joi.string()
  .min(3)
  .max(25)
  .regex(/^[a-zA-Z0-9_]+$/)
  .required();

const passwordSchema = Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
  .required();

const emailSchema = Joi.string().email().required();

const rolesSchema = Joi.array()
  .items(Joi.string().valid("trainer", "elite"))
  .default(["trainer"]);

const birthdaySchema = Joi.date().format("YYYY-MM-DD").raw().required();

const countrySchema = Joi.string().max(2).required();

/// -- Comprehensive validation for registration --
const validateRegistration = (data) => {
  const schemas = {
    username: usernameSchema,
    password: passwordSchema,
    email: emailSchema,
    roles: rolesSchema,
    birthday: birthdaySchema,
    country: countrySchema,
  };

  const errors = {};
  let validData = {};

  // Validate each field individually
  for (const [key, schema] of Object.entries(schemas)) {
    const { error, value } = schema.validate(data[key]);
    if (error) {
      errors[key] = error.message;
    } else {
      validData[key] = value;
    }
  }

  // Return errors if any, otherwise the validated data
  return Object.keys(errors).length > 0 ? { errors } : { value: validData };
};

const validateEnv = () => {
  const { error, value: envVars } = envSchema.validate(process.env);
  if (error) {
    console.error(`Environment variable validation error: ${error.message}`);
    process.exit(1);
  }
};

const validateUsername = (data) => {
  if (data === "Professor Oak") {
    return { value: data };
  }
  const { error, value } = usernameSchema.validate(data);
  return { error, value };
};

const validatePassword = (data) => {
  const { error, value } = passwordSchema.validate(data);
  return { error, value };
};

// Export the validation functions to be used by routers
module.exports = {
  validateRegistration,
  validateUsername,
  validatePassword,
  validateEnv,
  emailSchema,
  countrySchema,
  usernameSchema,
  passwordSchema,
};
