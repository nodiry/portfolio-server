import express from "express";
import { success } from "../utils/responder.ts";
const router = express.Router();

router.get("/latest", (req, res) => {
  res.send("hello from blog glasscube");
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const { title, text } = req.body;
    success(res);
  } catch {}
});

export default router;
