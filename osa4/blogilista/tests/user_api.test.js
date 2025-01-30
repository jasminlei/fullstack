const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { test, describe, beforeEach, after } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const mongoose = require("mongoose");

const api = supertest(app);

const initialUsers = [
  {
    username: "Norppa",
    name: "Saimaan Norppa",
    password: "password",
  },
  {
    username: "Mopsi",
    name: "Koira Mopsinen",
    password: "hauhau123",
  },
];

beforeEach(async () => {
  await User.deleteMany({});
  let userObject = new User(initialUsers[0]);
  await userObject.save();
  userObject = new User(initialUsers[1]);
  await userObject.save();
});

test("creation succeeds with a fresh username", async () => {
  const newUser = {
    username: "kisuli",
    name: "Kisu Misu",
    password: "salainen",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await api.get("/api/users");
  assert.strictEqual(usersAtEnd.body.length, initialUsers.length + 1);

  const usernames = usersAtEnd.body.map((u) => u.username);
  assert(usernames.includes(newUser.username));
});

test("creation fails with username that is already in use", async () => {
  const newUser = {
    username: "Norppa",
    name: "Kisu Misu",
    password: "salainen",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("creation fails with too short password", async () => {
  const newUser = {
    username: "kisu",
    name: "Kisu Misu",
    password: "s",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("creation fails with nonexistent password", async () => {
  const newUser = {
    username: "kisu",
    name: "Kisu Misu",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("creation fails with nonexistent username", async () => {
  const newUser = {
    name: "Kisu Misu",
    password: "password",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
