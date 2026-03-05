// middleware/adminAuthMiddleware.js
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./Routes/controllers/web/AdminDataFolder");


function verifyAdmin(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token"});
  }
}

module.exports = verifyAdmin;