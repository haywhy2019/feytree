import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;
  message = '';

  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.message = message;
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
