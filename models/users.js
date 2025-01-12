const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { required } = require("joi");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  birthday: {
    type: Date
  },

  country: {
    type: String
  },

  roles: {
    type: [String],
    default: ["trainer"],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  lastLogin: {
    type: Date,
    default: Date.now
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: {
    type: String,
    default: null
  },

  passwordResetToken: {
    type: String,
    default: null
  },

  passwordResetExpires: {
    type: Date,
    default: null
  }
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

userSchema.virtual("pokedex", {
  ref: "pokedexEntries",
  localField: "_id",
  foreignField: "user",
});

module.exports = mongoose.model("User", userSchema);
