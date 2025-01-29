const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("assert");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Otsikko",
    author: "Blaa blaa",
    url: "ww.com",
  },
  {
    title: "Otsikko2 ",
    author: "Blaa blaa2",
    url: "www.com",
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("notes are returned as json", async () => {
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
  console.log(response.body);

  response.body.forEach((blog) => {
    assert.strictEqual(blog.id !== undefined, true);
  });
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "NewTitle",
    author: "Text text",
    url: "ww.com",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  console.log(response.body);

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const titles = response.body.map((r) => r.title);
  const authors = response.body.map((r) => r.author);

  assert(titles.includes("NewTitle"));
  assert(authors.includes("Text text"));
});

test("if not likes are given the value is zero ", async () => {
  const newBlog = {
    title: "Title yay",
    author: "Someone",
    url: "ww.com",
  };

  const response = await api
    .post("/api/blogs")
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

  const response = await api.post("/api/blogs").send(newBlog).expect(400);
});

test("404 if url is not given ", async () => {
  const newBlog = {
    title: "Title",
    author: "Someone",
    likes: 1,
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
