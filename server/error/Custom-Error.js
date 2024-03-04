// customAPIError.js
import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (
  message,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR
) => {
  return new CustomAPIError(message, statusCode);
};

export { createCustomError, CustomAPIError };
