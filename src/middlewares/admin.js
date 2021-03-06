import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_KEY);
    if (payload.app_role === 'admin') {
      next();
    } else {
      return res.status(401).send({ message: 'Not  authorized' });
    }
  } catch (error) {
    throw new NotAuthorizedError();
  }
};
