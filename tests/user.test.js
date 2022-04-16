const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

const userOne = {
  name: "Mike",
  email: "hunt@example.com",
  password: "pass456!",
};

beforeEach(async () => {
  await User.deleteMany();
  await User(userOne).save();
});

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Kai",
      email: "kai@example.com",
      password: "pass123!",
    })
    .expect(201);
});

test("Should signin an existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
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
