const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if the authorization header is present and formatted correctly
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract the token from the header

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message); // Log the error
        return res.status(401).json({ message: "Invalid token" });
      }

      // Fetch the user from the database using the ID from the decoded token
      const user = await User.findById(decoded.user.id); // Ensure this matches your token structure
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found, unauthorized" });
      }

      // Attach the user object to the request for further use in the application
      req.user = user;
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    return res.status(401).json({
      message: "Authorization header is missing or malformed",
    });
  }
};
