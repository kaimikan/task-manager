const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();

    // check status codes at https://www.webfx.com/web-development/glossary/http-status-codes/
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    // notice how findById auto converts to new Object(req.params.id)
    const user = await User.findById(req.params.id);
    if (user) return res.send(user);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

app.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  // every returns false if even one of the checks returns false
  const isValidOperation = updates.every(
    (update) =>
      /* {
    return */ allowedUpdates.includes(update)
    /* } */
  );

  if (!isValidOperation) res.status(400).send({ error: "Invalid updates!" });

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (user) return res.send(user);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) return res.send(user);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

app.post("/tasks", async (req, res) => {
  console.log(req.body);
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) return res.send(task);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) res.status(400).send({ error: "Invalid updates!" });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (task) return res.send(task);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (task) return res.send(task);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
