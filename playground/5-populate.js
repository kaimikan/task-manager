// copy-paste in index.js to test

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  const task = await Task.findById("6257e5916798fa9ba9871805");
  await task.populate("creator");
  console.log(task.creator);

  const user = await User.findById("6257e5106ffd6628fc0be249");
  await user.populate("tasks");
  console.log("tasks:", user.tasks);
};

main();
