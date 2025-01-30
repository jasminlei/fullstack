const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");

const validateUsername = async (username, response) => {
  if (!username) {
    const error = "Username must be given";
    logger.error(error);
    return response.status(400).json({ error });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    const error = "Username already in use";
    logger.error(error);
    return response.status(400).json({ error });
  }

  return true;
};

const validatePassword = (password, response) => {
  if (!password || password.length < 3) {
    logger.error("Password must be at least 3 characters long");
    return response.status(400).json({ error: "Password too short" });
  }
  return true;
};

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if ((await validateUsername(username, response)) !== true) return;
  if (validatePassword(password, response) !== true) return;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
