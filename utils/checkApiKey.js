const AppError = require("../utils/appError");

module.exports = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.API_KEY) {
    return next(new AppError("Invalid API key", 403));
  }
  next();
};
