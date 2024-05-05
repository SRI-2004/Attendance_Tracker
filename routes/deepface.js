// deepface.js

// Import necessary modules
const express = require('express');
const { ImageData, Student, Class } = require('../models/index'); // Import ImageData, Student, and Class models
const { verifyToken, isAdmin } = require('../utils/middleware'); // Import middleware functions

// Create Express router
const router = express.Router();

// Route for creating an Image_Data record
router.post('/image-data', verifyToken, isAdmin, async (req, res) => {
  try {
    // Extract necessary data from request body
    const { imagePath, timestamp, studentId, classId } = req.body;

    // Validate required fields
    if (!imagePath || !timestamp || !studentId || !classId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create Image_Data record
    const imageData = await ImageData.create({
      imagePath,
      timestamp,
      studentId,
      classId
    });

    // Return success response with created Image_Data record
    res.status(201).json({ imageData });
  } catch (error) {
    console.error('Error creating Image_Data record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/mark-attendance', verifyToken, isAdmin, async (req, res) => {
    try {
      // Extract necessary data from request body
      const { studentId, classId, odMl } = req.body;
  
      // Validate required fields
      if (!studentId || !classId || odMl === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Find existing AttendanceRecord for the given studentId and classId
      let attendanceRecord = await AttendanceRecord.findOne({
        where: { studentId, classId }
      });
  
      if (!attendanceRecord) {
        // If no record found, create a new one with classesAttended and totalClasses set to 1
        attendanceRecord = await AttendanceRecord.create({
          studentId,
          classId,
          classesAttended: 1,
          totalClasses: 1,
          odMl,
          facultyId: req.user.id // Assign facultyId from token
        });
      } else {
        // If record found, increment classesAttended and totalClasses by 1
        attendanceRecord.classesAttended += 1;
        attendanceRecord.totalClasses += 1;
        await attendanceRecord.save(); // Save the updated record
      }
  
      // Return success response with updated or created AttendanceRecord
      res.status(201).json({ attendanceRecord });
    } catch (error) {
      console.error('Error marking attendance:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post('/mark-present', verifyToken, isAdmin, async (req, res) => {
    try {
      // Extract attendance details from request body
      const { studentId, classId } = req.body;
  
      // Find the attendance record for the given student and class
      let attendanceRecord = await AttendanceRecord.findOne({
        where: { studentId, classId }
      });
  
      if (!attendanceRecord) {
        // If no record found, return error
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      // Increment both classes attended and total classes
      attendanceRecord.classesAttended += 1;
      attendanceRecord.totalClasses += 1;
  
      // Save the updated record
      await attendanceRecord.save();
  
      // Return success response with updated AttendanceRecord
      res.status(200).json({ message: 'Attendance marked present successfully', attendanceRecord });
    } catch (error) {
      console.error('Error marking present:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Mark Absent
router.post('/mark-absent', verifyToken, isAdmin, async (req, res) => {
    try {
      // Extract attendance details from request body
      const { studentId, classId } = req.body;
  
      // Find the attendance record for the given student and class
      let attendanceRecord = await AttendanceRecord.findOne({
        where: { studentId, classId }
      });
  
      if (!attendanceRecord) {
        // If no record found, return error
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      // Increment only total classes
      attendanceRecord.totalClasses += 1;
  
      // Save the updated record
      await attendanceRecord.save();
  
      // Return success response with updated AttendanceRecord
      res.status(200).json({ message: 'Attendance marked absent successfully', attendanceRecord });
    } catch (error) {
      console.error('Error marking absent:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Export router
module.exports = router;
