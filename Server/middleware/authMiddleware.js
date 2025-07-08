const jwt = require("jsonwebtoken");

// Basic JWT verification
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains: userId, role
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token is invalid or expired" });
  }
};

// Role-based middleware
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Role not authorized." });
    }
    next();
  };
};

module.exports = {
  verifyJWT,
  allowRoles,
};
