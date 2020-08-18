import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Not  authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not  authorized' }];
  }
}
