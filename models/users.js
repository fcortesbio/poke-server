const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  roles: {
    type: [String],
    default: ["trainer"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: {
    type: String,
    default: null,
  },

  passwordResetToken: {
    type: String,
    default: null,
  },

  passwordResetExpires: {
    type: Date,
    default: null,
  },

//   pokedexEntries: {
//     type: Object,
//     default: null
//   }
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

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.verificationToken; 
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    return user;
}

module.exports = mongoose.model("User", userSchema);
