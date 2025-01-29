const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const express = require("express");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { dbName: "blogs" })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

module.exports = app;
