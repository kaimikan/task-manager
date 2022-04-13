const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      // check status codes at https://www.webfx.com/web-development/glossary/http-status-codes/
      res.status(201).send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      res.status(500).send();
    });
});

app.get("/users/:id", (req, res) => {
  // notice how findById auto converts to new Object(req.params.id)
  User.findById(req.params.id)
    .then((user) => {
      if (user) return res.send(user);
      return res.status(404).send();
    })
    .catch((error) => {
      res.status(500).send();
    });
});

app.post("/tasks", (req, res) => {
  console.log(req.body);
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.status(200).send(tasks);
    })
    .catch((error) => {
      res.status(500).send();
    });
});

app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (task) return res.send(task);
      return res.status(404).send();
    })
    .catch((error) => {
      res.status(500).send();
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
