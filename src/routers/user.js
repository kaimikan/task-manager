const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

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

const storage = multer.memoryStorage();
const upload = multer({
  limits: {
    // 1MB
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      cb(new Error("Upload a .jpg, .jpeg, or .png file"));
    cb(undefined, true);
  },
  storage,
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // we remove dest from const upload so multer file is directly passed here
    // we use sharp to convert image to png and resize it
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) throw new Error();

    // this is set automatically to application/json so we didn't need to type it previously
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
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
    // we do this to make sure out middleware runs since findByIdAndUpdate bypasses it
    updates.forEach((update) => {
      // we dont know exact value so instead of .name for example we use [update]
      // this is done to trigger middleware form the model, since pathing is more complex than the save
      req.user[update] = req.body[update];
    });
    await req.user.save();

    return res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    return res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    return res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
