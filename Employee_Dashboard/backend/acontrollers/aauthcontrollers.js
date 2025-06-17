const Employee = require('../amodels/aUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signin logic
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Optional: Signup route (use only if needed for testing)
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Employee({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'Employee registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
