const express = require("express");
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  shareNote,
  toggleFavorite, // Import the toggleFavorite function
} = require("../controllers/noteController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.use(authenticate); // Protect all note routes

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/share", shareNote);
router.put("/:id/favorite", toggleFavorite); // Add route for toggling favorite status

module.exports = router;
