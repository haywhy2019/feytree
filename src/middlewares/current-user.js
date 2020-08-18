import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const currentUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_KEY);
    console.log('payload');
    next();
  } catch (error) {
    throw new NotAuthorizedError();
  }
};
