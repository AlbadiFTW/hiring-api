import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: "Validation error",
      issues: err.issues,
    });
    return;
  }

  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
}
