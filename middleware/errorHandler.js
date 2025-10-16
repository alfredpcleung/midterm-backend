function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
}
module.exports = errorHandler;

/*
// Centralized error handler middleware
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Default values
  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific Mongoose errors
  if (err.name === 'CastError') {
    // e.g. invalid ObjectId format
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.name === 'ValidationError') {
    // e.g. required field missing, wrong type
    statusCode = 422;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (err.code && err.code === 11000) {
    // Duplicate key error (unique constraint)
    statusCode = 409;
    message = 'Duplicate key error: ' + JSON.stringify(err.keyValue);
  }

  // Handle HTTP errors thrown with http-errors package
  if (err.status && err.expose) {
    statusCode = err.status;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
*/