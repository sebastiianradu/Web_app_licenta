const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('./user.js'); // Assuming this is where your Sequelize User model is defined

const loginRouter = express.Router();

loginRouter.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If credentials are correct, you can proceed with redirecting or generating a session/token
    // For simplicity, we're just sending a success message
    return res.status(200).json({ message: "Login successful" });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = loginRouter;
