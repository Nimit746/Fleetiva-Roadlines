const errorHandler = (err, req, res, next) => {
  // Use the status code from the custom error, or default to 500
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  console.error(`[Error]: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;