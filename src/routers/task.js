const express = require("express");
const Task = require("../models/task");

const router = new express.Router();

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) return res.send(task);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/tasks", async (req, res) => {
  console.log(req.body);
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) res.status(400).send({ error: "Invalid updates!" });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body);

    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    if (task) return res.send(task);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (task) return res.send(task);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
