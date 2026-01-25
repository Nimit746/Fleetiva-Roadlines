class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message || 'Validation failed', 400);
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message || 'Authentication failed', 401);
  }
}

module.exports = { AppError, ValidationError, AuthError };