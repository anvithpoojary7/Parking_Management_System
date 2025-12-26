const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    
    const authHeader = req.headers["authorization"];
    console.log("🔑 Auth header:", req.headers["authorization"]);

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Get the actual token
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Token is not valid" });

      req.user = decoded; // save user info in request
      next();
    });
  } catch (err) {
    return res.status(500).json({ error: "Auth middleware failed" });
  }
};

module.exports = authMiddleware;
