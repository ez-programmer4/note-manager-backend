const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/useRoutes"); // Corrected to userRoutes
const noteRoutes = require("./routes/noteRoutes");
const dotenv = require("dotenv");

dotenv.config();
connectDB();

const app = express();

// Update the allowedOrigins to include the correct protocol and port
const allowedOrigins = ["https://note-manager1.onrender.com"]; // Corrected to use http and the correct port

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials if needed (like cookies)
  })
);

app.use(express.json()); // Middleware to parse JSON requests

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
