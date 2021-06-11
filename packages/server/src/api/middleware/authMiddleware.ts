import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
  isAdmin: boolean;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.SECRET);
    const { id, isAdmin } = data as TokenPayload;

    req.userId = id;
    req.isAdmin = isAdmin;

    return next();
  } catch {
    return res.sendStatus(401);
  }
}
