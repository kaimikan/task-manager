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

const deleteTaskAndCount = async (id) => {
  /* const task =  */ await Task.findByIdAndDelete(id);
  const count = Task.countDocuments();
  return count;
};

deleteTaskAndCount("625798acbae58b839ffd2c3e")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
