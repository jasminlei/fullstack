const blogsRouter = require("express").Router();
const logger = require("../utils/logger");

const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (blog) {
      response.json(blog);
    } else {
      logger.info(`Blog with id ${id} not found.`);
      response.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    logger.error(
      `Error fetching blog with id ${request.params.id}:`,
      error.message
    );
    response.status(400).json({ error: "malformatted id" });
  }
});

blogsRouter.post("/", async (request, response) => {
  try {
    const blog = new Blog(request.body);
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    logger.error("Error adding blog:", error.message);
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id);

    if (blog) {
      logger.info(`Blog with id ${request.params.id} removed successfully.`);
      response.status(204).end();
    } else {
      logger.info(`Blog with id ${request.params.id} not found.`);
      response.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    logger.error(
      `Error when trying to delete blog with id ${request.params.id}:`,
      error.message
    );
    response.status(400).json({ error: "Invalid blog ID" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  try {
    const body = request.body;
    console.log(body);

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(blog);
  } catch (error) {
    logger.error("Error when trying to modify blog", error.message);
  }
});

module.exports = blogsRouter;
