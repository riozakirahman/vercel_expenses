const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = new Error("Authorization header is missing");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const isVerified = jwt.verify(token, process.env.secret_key || "1234");
    if (isVerified) {
      req.user = isVerified;
      next();
    } else {
      const err = new Error("Invalid signature");
      err.statusCode = 403;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyToken,
};
