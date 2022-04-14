const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();

    const token = await user.generateAuthToken();
    // check status codes at https://www.webfx.com/web-development/glossary/http-status-codes/
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  try {
    // notice how findById auto converts to new Object(req.params.id)
    const user = await User.findById(req.params.id);
    if (user) return res.send(user);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/:id", async (req, res) => {
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body);

    // we do this to make sure out middleware runs since findByIdAndUpdate bypasses it
    updates.forEach((update) => {
      // we dont know exact value so instead of .name for example we use [update]
      // this is done to trigger middleware form the model, since pathing is more complex than the save
      user[update] = req.body[update];
    });
    await user.save();

    if (user) return res.send(user);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) return res.send(user);
    return res.status(404).send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
