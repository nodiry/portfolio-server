import express from "express";
import {
  requireField,
  serverError,
  success,
  validateMatch,
} from "../utils/responder.ts";
import { Blog } from "../models/blog.ts";
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const blogs = await Blog.find();
    success(res, { blogs });
  } catch (error) {
    serverError(res, "Error happened while fetching all the blogs", error);
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const { title, slug, description, tags, content, thumbnail, author, key } =
      req.body;
    if (requireField(title, res, "title is needed")) return;
    if (requireField(key, res, "Key needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;

    const blog = await Blog.create({
      title,
      slug,
      content,
      description,
      tags,
      thumbnail,
      author,
    });
    success(res, { blog });
  } catch (error) {
    serverError(res, "Error happened while creating the blog", error);
  }
});
router.put("/", async (req, res): Promise<void> => {
  try {
    const {
      id,
      title,
      slug,
      description,
      tags,
      content,
      thumbnail,
      author,
      key,
    } = req.body;
    if (requireField(title, res, "title is needed")) return;
    if (requireField(key, res, "Key needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
        description,
        tags,
        thumbnail,
        author,
      },
      { new: true }
    );
    success(res, { blog });
  } catch (error) {
    serverError(res, "Error happened while updating the blog", error);
  }
});
router.delete("/", async (req, res): Promise<void> => {
  try {
    const { id, key } = req.body;
    if (requireField(id, res, "id of blog is needed")) return;
    if (requireField(key, res, "Key needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;
    await Blog.findByIdAndDelete(id);
    success(res, { message: "Blog deleted" });
  } catch (error) {
    serverError(res, "Error happened while updating the blog", error);
  }
});

export default router;
