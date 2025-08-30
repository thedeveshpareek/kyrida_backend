import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ msg: "Forbidden: insufficient role" });
    }
    next();
  };
};

// Accept either a valid API key (from header) OR a JWT with the required role
export const apiKeyOrRole = (role) => {
  return (req, res, next) => {
    const providedKey = req.headers["x-api-key"] || req.headers["api-key"] || req.headers["x-secret-key"];
    const expectedKey = process.env.API_SECRET_KEY;

    // If a matching API key is provided, allow access without JWT/role checks
    if (expectedKey && providedKey && providedKey === expectedKey) {
      req.authMethod = "api_key";
      return next();
    }

    // Fallback to JWT + role check
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token or API key provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      if (role && req.user.role !== role) {
        return res.status(403).json({ msg: "Forbidden: insufficient role" });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }
  };
};
