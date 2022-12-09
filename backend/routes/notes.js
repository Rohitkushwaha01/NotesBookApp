const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

// ROUTE 1: get all the notes
router.get("/fetchnotes", async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.id });
        console.log(notes)
        res.json(notes);
        const data = await fetchuser();
        console.log(data)
        
    } catch (err) {
        console.log(err.message);
        res.status(500);
    }
});

// ROUTE 2: post or add notes
router.post(
  "/addnote",
  [
    body("title", "Enter title atleast more than 3 character").isLength({
      min: 3,
    }),
    body(
      "description",
      "Enter description atleast more than 5 character"
    ).isLength({ min: 5 }),
    body("tag", "Enter tag").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
    
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id
      });

      const savedNotes = await note.save();

      res.json(savedNotes);
    } catch (err) {
        console.log(err.message);
        res.status(500);
    }
  }
);

module.exports = router;
