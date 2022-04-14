// Mongoose
require("../src/db/mongoose");
const User = require("../src/models/user");
const Task = require("../src/models/task");

User.findByIdAndUpdate("6257243a99db3acd3b1e6d8d", { age: 0 })
  .then((user) => {
    console.log(user);
    return User.countDocuments({ age: 1 });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age /* : age */ });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("6257243a99db3acd3b1e6d8d", 2)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
