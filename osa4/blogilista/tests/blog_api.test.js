const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Test title",
    author: "Author 1",
    url: "ww.com",
  },
  {
    title: "Test title 2",
    author: "Author 2",
    url: "www.com",
  },
];

let token = "";
let userId = "";

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();

  const newUser = {
    username: "testuser",
    name: "Test User",
    password: "password123",
  };

  const user = await api
    .post("/api/users")
    .send({ username: newUser.username, password: newUser.password });

  const loginResponse = await api
    .post("/api/login")
    .send({ username: newUser.username, password: newUser.password });

  token = loginResponse.body.token;
  userId = loginResponse.body.id;
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs are returned with id field", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  response.body.forEach((blog) => {
    assert.strictEqual(blog.id !== undefined, true);
  });
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "NewTitle",
    author: "Test user",
    url: "ww.com",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const titles = response.body.map((r) => r.title);
  assert(titles.includes("NewTitle"));
});

test("401 unauthorized if no token with request", async () => {
  const newBlog = {
    title: "NewTitle",
    author: "Test user",
    url: "ww.com",
    likes: 2,
  };

  await api.post("/api/blogs").send(newBlog).expect(401);
});

test("if not likes are given the value is zero ", async () => {
  const newBlog = {
    title: "Title yay",
    author: "Someone",
    url: "ww.com",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("404 if title is not given ", async () => {
  const newBlog = {
    author: "Someone",
    url: "ww.fi",
    likes: 2,
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("404 if url is not given ", async () => {
  const newBlog = {
    title: "Title",
    author: "Someone",
    likes: 1,
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("removing blogs works", async () => {
  const newBlog = {
    title: "Blog to delete",
    author: "Author Name",
    url: "http://example.com",
  };
  const createResponse = await api
    .post("/api/blogs")
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send(newBlog)
    .expect(201);

  const blogToDelete = createResponse.body;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
});

test("modifying blog works", async () => {
  const newBlog = {
    title: "Blog to modify",
    author: "Author Name",
    url: "http://example.com",
    likes: 7,
    id: 123456,
  };
  const response = await api
    .post("/api/blogs")
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogToModify = response.body;

  const modifiedBlog = {
    title: "Modified",
    author: "Author Name New",
    url: "http://example.dev",
    likes: 8,
  };

  const createResponse = await api
    .put(`/api/blogs/${blogToModify.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(modifiedBlog)
    .expect(200);
});

after(async () => {
  await mongoose.connection.close();
});
