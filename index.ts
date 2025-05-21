import "bun";
import express from "express";
import mongoose from "mongoose";
import Limiter from "express-rate-limit";
import blog from "./routes/blog";
import project from "./routes/project";
import logger from "./middleware/logger";
import config from "./config/config";
import morgan from "morgan";
import cors from "cors";
const limiter = Limiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const app = express();
const port = process.env.PORT || 3067;
const db = config.db || "";

// Middleware
app.use(express.json());
app.use(cors({ origin: config.origin, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.morgan));
app.use(limiter);

// MongoDB Connection
mongoose
  .connect(db)
  .then(() => logger.info("Database connected successfully"))
  .catch((error) => logger.error(`Error connecting to DB: ${error.message}`));

// Routes
app.use("/blog", blog);
app.use("/project", project);

app.get("/", (req, res) => {
  res.send("Hello from GlassCube!");
});

// Start Server
app.listen(port, () => logger.info(`Server running on port: ${port}`));
