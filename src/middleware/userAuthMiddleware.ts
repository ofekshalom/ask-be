import express from "express";

const userAuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).end();
  } else {
    next();
  }
};

export default userAuthMiddleware;
