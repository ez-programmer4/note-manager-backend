// utils/auth.js

const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Set your desired expiration time
  });
  return token;
};

module.exports = { generateToken };
