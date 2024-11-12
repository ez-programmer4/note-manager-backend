const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String }, // Add this field for storing refresh token
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);