// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Faculty, Student } = require('../models/index'); // Import Faculty model

// Create Express router
const router = express.Router();

// Signup route for faculty
router.post('/signup_faculty', async (req, res) => {
  try {
    // Extract faculty details from request body
    const { name, department, phone, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create faculty record in the database
    const newFaculty = await Faculty.create({
      name,
      department,
      phone,
      email,
      password: hashedPassword, // Save hashed password
      isAdmin: true // Assign admin privileges
    });

    // Generate JWT token
    const token = jwt.sign({ facultyId: newFaculty.id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return token in response
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error in faculty signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/signup_student', async (req, res) => {
    try {
      // Extract student details from request body
      const { name, email, password, department, section, dateOfBirth, gender } = req.body;
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create student record in the database
      const newStudent = await Student.create({
        name,
        email,
        password: hashedPassword, // Save hashed password
        department,
        section,
        dateOfBirth,
        gender
      });
  
  
      // Return token in response
      res.status(201).json({ token });
    } catch (error) {
      console.error('Error in student signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.post('/login', async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;
  
      // Check if faculty exists with the provided email
      let user = await Faculty.findOne({ where: { email } });
  
      // If faculty doesn't exist, check if student exists with the provided email
      if (!user) {
        user = await Student.findOne({ where: { email } });
      }
  
      // If no user found, return error
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Check if password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin || false }, process.env.JWT_SECRET,{ expiresIn : "1h"});
  
      // Return token in response
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Export router
module.exports = router;
