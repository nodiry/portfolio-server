// utils/responder.ts
import type { Response } from "express";
import logger from "../middleware/logger";
import { HttpStatus } from "./status";

export const serverError = (res: Response, context = "", error?: any) => {
  if (error) logger.error(`${context}:`, error);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
};

export const success = (
  res: Response,
  data: any = {},
  code: number = HttpStatus.OK
) => {
  res.status(code).json(data);
};

export const badRequest = (res: Response, msg: string = "Bad request") => {
  res.status(HttpStatus.BAD_REQUEST).json({ error: msg });
};

const respondIf = (
  condition: boolean,
  res: Response,
  code: HttpStatus,
  msg: string
): boolean => {
  if (condition) {
    res.status(code).json({ message: msg });
    return true;
  }
  return false;
};
export const requireField = (
  field: unknown,
  res: Response,
  name: string
): boolean =>
  respondIf(
    field === null || field === undefined || field === "",
    res,
    HttpStatus.BAD_REQUEST,
    `${name} is required`
  );

export const validateMatch = (
  a: string | undefined | number | null,
  b: string | undefined | number,
  res: Response,
  msg = "Values do not match"
) => respondIf(!a || a !== b, res, HttpStatus.BAD_REQUEST, msg);
