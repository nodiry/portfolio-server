import "bun";
import express from "express";
import mongoose from "mongoose";
import blog from "./routes/blog";
import project from "./routes/project";
import logger from "./middleware/logger";
import config from "./config/config";
import cors from "cors";
import { Blog } from "./models/blog";
import { Project } from "./models/project";
import { serverError, success } from "./utils/responder";
import { putlimit } from "./middleware/limiter";

const app = express();
const port = process.env.PORT || 3067;
const db = config.db || "";

// Middleware
app.use(express.json());
app.use(cors({ origin: config.origin, credentials: true }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(db)
  .then(() => logger.info("Database connected successfully"))
  .catch((error) => logger.error(`Error connecting to DB: ${error.message}`));

// Routes
app.use("/blog", putlimit(15, 100, "get the fuck out!")).use("/", blog);
app
  .use("/project", putlimit(15, 100, "stop the ddos man."))
  .use("/project", project);

app.get("/latest", async (req, res) => {
  try {
    const [blogs, projects] = await Promise.all([Blog.find(), Project.find()]);
    success(res, { blogs, projects });
  } catch (error) {
    serverError(res, "error happened while fetching latest data", error);
  }
});

app.listen(port, () => logger.info(`Server running on port: ${port}`));
