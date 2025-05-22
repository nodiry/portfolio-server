import Limiter from "express-rate-limit";
import logger from "./logger";

/**
 *
 * @param time - time in seconds
 * @param times - number of requests
 * @param message - message after the user reaches the limit
 * @returns
 */
export function putlimit(time: number, times: number, message?: string) {
  return Limiter({
    windowMs: time * 60 * 1000,
    limit: times,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: message || "Too many requests, slow down.",
    handler: (req, res) => {
      logger.warn(`Rate limit hit by ${req.ip}`);
      res.status(429).json({ error: message || "Too many requests" });
    },
  });
}
