const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");

const User = mongoose.model("User", {
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

const me = new User({
  name: "Anon",
  password: "password123",
  email: "anon@email.com",
});

/* me.save()
  .then(() => {
    console.log(me);
  })
  .catch((error) => {
    console.log("Error: ", error);
  }); */

const Task = mongoose.model("Task", {
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const task = new Task({
  description: "Notice how you are existing right now",
  completed: true,
});

task
  .save()
  .then(() => {
    console.log(task);
  })
  .catch((error) => {
    console.log("Error: ", error);
  });
