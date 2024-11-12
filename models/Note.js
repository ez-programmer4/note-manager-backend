const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["personal", "work", "study", "other"],
      default: "other",
    },
    tags: {
      type: [String],
      default: [],
    },
    collaborators: {
      type: [String],
      default: [],
    },
    favorite: { type: Boolean, default: false }, // Ensure this field is present
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", NoteSchema);
