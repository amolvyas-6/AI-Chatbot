export const errorHandler = (err, req, res, next) => {
  // Log the error for devs
  console.log(err);
  // Send error response
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message || "Internal Server Error",
  });
};
