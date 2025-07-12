/**
 * Standard API response utility
 */
export class ApiResponse {
  constructor(statusCode, message, data = null, success = true) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
    this.timestamp = new Date().toISOString();
  }

  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, message, data, true)
    );
  }

  static error(res, message = 'Internal Server Error', statusCode = 500, data = null) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, message, data, false)
    );
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, message, data, 201);
  }

  static badRequest(res, message = 'Bad Request', data = null) {
    return this.error(res, message, 400, data);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, 409);
  }

  static validationError(res, errors) {
    return this.error(res, 'Validation failed', 422, { errors });
  }
}