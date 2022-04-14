const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error(`Your password cannot contain the word "password"`);
      }
    },
  },
  email: {
    type: String,
    // previous entries need to be wiped if unique is introduced mid-development
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive");
      }
    },
  },
});

// custom login check
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email /* : email */ });
  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Uanble to login");

  return user;
};

// middleware added to schema
// we use a normal function because we need the .this binding
// hash the plain text pass before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  // next is called when we're done, similar to done in jest testing
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
