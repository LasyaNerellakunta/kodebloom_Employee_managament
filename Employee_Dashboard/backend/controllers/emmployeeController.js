// backend/controllers/emmployeeController.js
import Emmployee from '../models/Emmployee.js';

// GET /api/emmployees
export const getEmmployees = async (req, res) => {
  try {
    // return _id, name, role, employmentType, status, salaryRange
    const emps = await Emmployee.find()
      .select('name role employmentType status salaryRange');
    res.json(emps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/emmployees
export const createEmmployee = async (req, res) => {
  try {
    const { name, role, employmentType, status, salaryRange } = req.body;
    const newEmp = new Emmployee({ name, role, employmentType, status, salaryRange });
    await newEmp.save();
    // return full record (including _id)
    res.status(201).json(newEmp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
