const Note = require("../models/Note");
const nodemailer = require("nodemailer");
// Create a new note
exports.createNote = async (req, res) => {
  const { title, content, category, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  const note = new Note({
    title,
    content,
    userId: req.user.id,
    category,
    tags: tags || [],
  });

  try {
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Error creating note." });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes." });
  }
};
// Get a specific note by ID
exports.getNote = async (req, res) => {
  const { id } = req.params;
  console.log("Received request for note ID:", id); // Log the incoming request
  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }
    res.status(200).json(note);
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Update an existing note
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;

  // Optional: Validate incoming data (consider using a library for this)
  if (!title || !content || !category) {
    return res
      .status(400)
      .json({ message: "Title, content, and category are required." });
  }

  try {
    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, category, tags },
      { new: true, runValidators: true } // Use runValidators to enforce schema validations
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error("Error updating note:", err); // Log the error details
    res.status(500).json({ message: "Error updating note." });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }
    res.status(200).json({ message: "Note deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note." });
  }
};

// Share a note
exports.shareNote = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if the email is already in collaborators
    if (!note.collaborators.includes(email)) {
      note.collaborators.push(email);
      await note.save();
    }

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Note Shared: ${note.title}`,
      text: `You have been shared a note titled: ${note.title}\n\nContent:\n${note.content}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Note shared successfully and email sent." });
  } catch (err) {
    console.error("Error sharing note:", err); // Log the error details
    res
      .status(500)
      .json({ message: "Error sharing note.", error: err.message }); // Include error message for debugging
  }
};
// Toggle favorite status of a note
// In your noteController.js

// Toggle favorite status of a note
exports.toggleFavorite = async (req, res) => {
  const { id } = req.params;
  console.log(`Toggling favorite for note ID id an di : ${id}`); // Debug log

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    note.favorite = !note.favorite;
    await note.save();

    res.status(200).json(note);
  } catch (err) {
    console.error("Error toggling favorite status:", err);
    res.status(500).json({ message: "Error toggling favorite status." });
  }
};
