// backend/controllers/taaskController.js
import Taask from '../models/Taask.js';

// GET /api/taasks
export const getTaasks = async (req, res) => {
  try {
    const taasks = await Taask.find()
      .populate('assignedTo', 'name role');
    res.json(taasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/taasks
export const createTaask = async (req, res) => {
  try {
    const { title, assignedTo, deadline, status, priority } = req.body;
    const newTask = new Taask({ title, assignedTo, deadline, status, priority });
    await newTask.save();
    const populated = await newTask.populate('assignedTo', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/taasks/:id
export const updateTaask = async (req, res) => {
  try {
    const updated = await Taask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo', 'name role');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/taasks/:id
export const deleteTaask = async (req, res) => {
  try {
    await Taask.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
