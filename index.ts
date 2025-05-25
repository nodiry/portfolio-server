import "bun";
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import blog from "./routes/blog";
import project from "./routes/project";
import logger from "./middleware/logger";
import config from "./config/config";
import cors from "cors";
import { Blog } from "./models/blog";
import { Project } from "./models/project";
import {
  badRequest,
  requireField,
  serverError,
  success,
  validateMatch,
} from "./utils/responder";
import path, { join } from "path";
import morgan from "morgan";
import multer from "multer";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import Limiter from "express-rate-limit";

const limiter = Limiter({
  windowMs: 30 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 3033;
const db = config.db || "";
app.use(cors({ origin: config.origin, credentials: true }));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morgan(config.morgan));
app.use(limiter);

mongoose
  .connect(db)
  .then(() => logger.info("db connected"))
  .catch((err) => logger.error(err.message));

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/blog", blog);
app.use("/project", project);
app.get("/latest", async (req, res) => {
  try {
    const [blogs, projects] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).limit(3),
      Project.find().sort({ createdAt: -1 }).limit(3),
    ]);
    success(res, { blogs, projects });
  } catch (error) {
    serverError(res, "error happened while fetching latest data", error);
  }
});

app.post("/media", upload.single("media"), async (req, res): Promise<void> => {
  try {
    const file = req.file;
    const key = req.body.key;
    if (requireField(key, res, "key is needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;
    if (!file) {
      badRequest(res, "file does not exist");
      return;
    }

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    const uploadPath = join(process.cwd(), "public/uploads", filename);

    writeFileSync(uploadPath, new Uint8Array(file.buffer));

    const url = `uploads/${filename}`;
    res.status(200).json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Server error while uploading media");
  }
});
app.delete("/media", async (req, res): Promise<void> => {
  try {
    const { url, key } = req.body;

    if (!url || typeof url !== "string" || !url.startsWith("uploads/")) {
      badRequest(res, "url is either not provided or incorrect");
      return;
    }
    if (requireField(key, res, "key is needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;
    const filePath = join(process.cwd(), "public", url);

    if (existsSync(filePath)) {
      unlinkSync(filePath); // delete the image
      res.status(200).send("Image deleted");
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Error deleting media");
  }
});

app.listen(port, () => logger.info(`Server is running on ${port}`));
