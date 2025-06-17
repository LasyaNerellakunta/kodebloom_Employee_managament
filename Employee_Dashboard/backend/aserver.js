const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./aconfig/adb');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/employees', require('./aroutes/aUserRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
