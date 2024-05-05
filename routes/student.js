
const express = require('express');
const { Student, Course } = require('../models/index'); // Import Student model
const { verifyToken } = require('../utils/middleware'); // Import middleware functions

// Create Express router
const router = express.Router();

// Route for getting details of a student by student ID from token
router.get('/details', verifyToken, async (req, res) => {
  try {
    // Retrieve student ID from token
    const studentId = req.user.id;

    // Fetch details of the student by student ID
    const student = await Student.findByPk(studentId);

    // If student not found, return 404 error
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return success response with student details
    res.status(200).json({ student });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/classes', verifyToken, async (req, res) => {
    try {
      // Retrieve student ID from token
      const studentId = req.user.id;
  
      // Fetch all classes mapped to the given student
      const student = await Student.findByPk(studentId, {
        include: Class // Include Class model to fetch associated classes
      });
  
      // If student not found, return 404 error
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Extract classes from the student object
      const classes = student.Classes;
  
      // Return success response with classes
      res.status(200).json({ classes });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/courses', verifyToken, async (req, res) => {
    try {
      // Retrieve student ID from token
      const studentId = req.user.id;
  
      // Fetch all courses mapped to the given student
      const student = await Student.findByPk(studentId, {
        include: Course // Include Course model to fetch associated courses
      });
  
      // If student not found, return 404 error
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Extract courses from the student object
      const courses = student.Courses;
  
      // Return success response with courses
      res.status(200).json({ courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/attendance', verifyToken, async (req, res) => {
    try {
      // Retrieve student ID from token
      const studentId = req.user.id;
  
      // Fetch attendance records of the student
      const attendanceRecords = await AttendanceRecord.findAll({
        where: { studentId }, // Filter by student ID
        attributes: ['classesAttended', 'totalClasses', 'odMl'] // Select relevant attributes
      });
  
      // If no attendance records found, return empty array
      if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(200).json({ message: 'No attendance records found' });
      }
  
      // Calculate attendance percentage for each record
      const attendanceWithPercentage = attendanceRecords.map(record => {
        const { classesAttended, totalClasses, odMl } = record;
        const attendancePercentage = ((classesAttended + odMl) / totalClasses) * 100;
        return { ...record.toJSON(), attendancePercentage };
      });
  
      // Return success response with attendance records and percentage
      res.status(200).json({ attendanceRecords: attendanceWithPercentage });
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Export router
module.exports = router;
