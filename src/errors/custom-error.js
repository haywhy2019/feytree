export class CustomError extends Error {
  statusCode = 400;
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Unknown Error' }];
  }
}
