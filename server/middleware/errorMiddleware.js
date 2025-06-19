const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.log(err.stack);
  res.json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

module.exports = errorHandler;
