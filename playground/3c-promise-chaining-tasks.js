// Mongoose
require("../src/db/mongoose");
const Task = require("../src/models/task");

Task.findByIdAndDelete("625720578c3795fa92232010")
  .then((task) => {
    console.log(task);
    return Task.countDocuments();
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
