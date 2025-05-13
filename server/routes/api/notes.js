const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory notes array
let notes = [];

// Create a new note
router.post('/', (req, res) => {
    const { title, note, status } = req.body;
    const newNote = {
        id: uuidv4(),
        title,
        note,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    res.status(201).json(newNote);
});

// Get all notes
router.get('/', (req, res) => {
    res.json(notes);
});

// Get a note by ID
router.get('/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
});

// Update a note
router.put('/:id', (req, res) => {
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Note not found' });

    const { title, note, status } = req.body;
    notes[index] = {
        ...notes[index],
        title,
        note,
        status,
        updatedAt: new Date().toISOString()
    };
    res.json(notes[index]);
});

// Delete a note
router.delete('/:id', (req, res) => {
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Note not found' });

    const deleted = notes.splice(index, 1);
    res.json({ message: 'Note deleted', note: deleted[0] });
});

module.exports = router;
