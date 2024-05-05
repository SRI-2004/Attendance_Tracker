
// Import necessary modules
const express = require('express');
const { Faculty, Course, Class, AttendanceRecord, Student } = require('../models/index'); // Import models
const { verifyToken, isAdmin } = require('../utils/middleware'); // Import middleware functions

// Create Express router
const router = express.Router();

// Route for marking attendance

// Mark Present
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
  
  // Create OD/ML
router.post('/od-ml', verifyToken, isAdmin, async (req, res) => {
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
  
      // Increment only odml
      attendanceRecord.odMl += 1;
  
      // Save the updated record
      await attendanceRecord.save();
  
      // Return success response with updated AttendanceRecord
      res.status(200).json({ message: 'OD/ML marked successfully', attendanceRecord });
    } catch (error) {
      console.error('Error creating OD/ML:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

router.get('/attendance-details', verifyToken, async (req, res) => {
    try {
      // Retrieve faculty ID from token
      const facultyId = req.user.facultyId;
  
      // Fetch courses for the given faculty ID
      const courses = await Course.findAll({
        where: { facultyId },
        include: {
          model: AttendanceRecord,
          attributes: [
            'classesAttended',
            'totalClasses',
            'odMl'
          ]
        }
      });
  
      // Calculate attendance percentage for each course
      const coursesWithAttendance = courses.map(course => {
        const attendanceRecords = course.AttendanceRecords;
        const totalClasses = attendanceRecords.reduce((acc, record) => acc + record.totalClasses, 0);
        const totalClassesAttended = attendanceRecords.reduce((acc, record) => acc + record.classesAttended, 0);
        const totalODML = attendanceRecords.reduce((acc, record) => acc + record.odMl, 0);
        const attendancePercentage = ((totalClassesAttended + totalODML) / totalClasses) * 100;
  
        return {
          courseName: course.name,
          attendancePercentage,
          totalClasses,
          totalClassesAttended,
          totalODML
        };
      });
  
      // Return success response with courses and their attendance details
      res.status(200).json({ coursesWithAttendance });
    } catch (error) {
      console.error('Error fetching attendance details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/classes', verifyToken, async (req, res) => {
    try {
      // Retrieve faculty ID from token
      const facultyId = req.user.facultyId;
  
      // Fetch all classes mapped to the given faculty ID
      const classes = await Class.findAll({
        where: { facultyId }
      });
  
      // Return success response with classes
      res.status(200).json({ classes });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.get('/courses', verifyToken, async (req, res) => {
    try {
      // Retrieve faculty ID from token
      const facultyId = req.user.facultyId;
  
      // Fetch all courses mapped to the given faculty ID
      const courses = await Course.findAll({
        where: { facultyId }
      });
  
      // Return success response with courses
      res.status(200).json({ courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/students', verifyToken, async (req, res) => {
    try {
      // Retrieve faculty ID from token
      const facultyId = req.user.facultyId;
  
      // Fetch all students mapped to the given faculty ID
      const students = await Student.findAll({
        where: { advisorId: facultyId } // Assuming advisorId is the foreign key linking students to faculty
      });
  
      // Return success response with students
      res.status(200).json({ students });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

router.get('/details', verifyToken, async (req, res) => {
    try {
      // Retrieve faculty ID from request parameters
      const facultyId = req.params.facultyId;
  
      // Fetch details of the faculty by faculty ID
      const faculty = await Faculty.findByPk(facultyId);
  
      // If faculty not found, return 404 error
      if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
      }
  
      // Return success response with faculty details
      res.status(200).json({ faculty });
    } catch (error) {
      console.error('Error fetching faculty details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
// Export router
module.exports = router;
