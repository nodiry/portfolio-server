import express from "express";
import {
  requireField,
  serverError,
  success,
  validateMatch,
} from "../utils/responder";
import { Project } from "../models/project";
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const projects = await Project.find();
    success(res, { projects });
  } catch (error) {
    serverError(res, "Error happened while fetching all the projects", error);
  }
});
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug });
    success(res, { project });
  } catch (error) {
    serverError(res, "Error happened while fetching all the projects", error);
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const {
      title,
      slug,
      short,
      full,
      tags,
      tech,
      github,
      demo,
      thumbnail,
      key,
    } = req.body;
    if (requireField(title, res, "title is needed")) return;
    if (requireField(key, res, "Key needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;

    const project = await Project.create({
      title,
      slug,
      tech,
      github,
      demo,
      short,
      full,
      tags,
      thumbnail,
    });
    success(res, { project });
  } catch (error) {
    serverError(res, "Error happened while creating the project", error);
  }
});
router.put("/", async (req, res): Promise<void> => {
  try {
    const {
      id,
      title,
      slug,
      short,
      full,
      tags,
      tech,
      github,
      demo,
      thumbnail,
      key,
    } = req.body;
    if (requireField(title, res, "title is needed")) return;
    if (requireField(key, res, "Key needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;

    const project = await Project.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        tech,
        github,
        demo,
        short,
        full,
        tags,
        thumbnail,
      },
      { new: true },
    );
    success(res, { project });
  } catch (error) {
    serverError(res, "Error happened while updating the project", error);
  }
});
router.delete("/", async (req, res): Promise<void> => {
  try {
    const { id, key } = req.body;
    if (requireField(id, res, "id of project is needed")) return;
    if (requireField(key, res, "Key needed")) return;
    if (validateMatch(key, process.env.KEY, res, "key should match")) return;
    await Project.findByIdAndDelete(id);
    success(res, { message: "Project deleted" });
  } catch (error) {
    serverError(res, "Error happened while updating the project", error);
  }
});

export default router;
