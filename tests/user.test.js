const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/User");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "hunt@example.com",
  password: "pass456!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await User(userOne).save();
});

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Kai",
      email: "kai@example.com",
      password: "pass123!",
    })
    .expect(201);

  // assert that the db was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // assertion about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Kai",
      email: "kai@example.com",
    },
    token: user.tokens[0].token,
  });
  // check hashing
  expect(user.password).not.toBe("pass123!");
});

test("Should signin an existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // check if login token is properly saved
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not signin a non-existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email + "asd",
      password: userOne.password + "asd",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete profile for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete profile for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
  /* notice the difference */
  /* expect({}).toBe({});
  expect({}).toEqual({}); */
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      name: "Kaio",
    })
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Kaio");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      location: "gorf",
    })
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(400);
});
