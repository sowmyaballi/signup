const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/signupDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// User schema
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    rollNo: { type: String, required: true },
    collegeName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Sign-up route
app.post('/signup', async (req, res) => {
  const { fullName, rollNo, collegeName, email, username, password} = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
        fullName,
        rollNo,
        collegeName,
        email,
        username,
        password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
