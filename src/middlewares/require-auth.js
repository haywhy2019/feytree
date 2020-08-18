import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors/not-authorized-error';
export const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
};
