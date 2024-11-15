const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if the authorization header is present and formatted correctly
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract the token from the header

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message); // Log the error
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await User.findById(decoded.user.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found, unauthorized" });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      message: "Authorization header is missing or malformed",
    });
  }
};
