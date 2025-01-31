const blogsRouter = require("express").Router();
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const { tokenExtractor } = require("../utils/middleware");

blogsRouter.use(tokenExtractor);

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
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
    const body = request.body;

    if (!request.token) {
      return response.status(401).json({ error: "token missing" });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(404).json({ error: "user not found" });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    response.status(201).json(result);
  } catch (error) {
    logger.error("Error adding blog:", error.message);
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: "token missing" });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(404).json({ error: "user not found" });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      logger.info(`Blog with id ${request.params.id} not found.`);
      return response.status(404).json({ error: "Blog not found" });
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    logger.info(`Blog with id ${request.params.id} removed successfully.`);
    response.status(204).end();
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
