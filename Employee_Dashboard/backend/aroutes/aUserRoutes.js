const express = require('express');
const router = express.Router();
const { signin, signup } = require('../acontrollers/aauthcontrollers');

// Routes
router.post('/signin', signin);
router.post('/signup', signup); // optional route

module.exports = router;
