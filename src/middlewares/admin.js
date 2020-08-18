import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_KEY);
    if (payload.app_role === 'super_admin') {
      next();
    } else {
      throw new NotAuthorizedError();
    }
  } catch (error) {
    throw new NotAuthorizedError();
  }
};
