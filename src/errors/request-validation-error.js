import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(errors) {
    super('Invalid Request');
    this.errors = errors;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
