const express = require('express');
const jwt = require('jsonwebtoken');
const { Faculty, Course, Class, Student, AttendanceRecord} = require('../models/index'); // Import Faculty, Course, and Class models
const { verifyToken, } = require('../utils/middleware'); // Import verifyToken middleware
const { isAdmin } = require('../utils/middleware');
// Create Express router
const router = express.Router();

// Route for creating a new class
router.post('/create_class', verifyToken, isAdmin, async (req, res) => {
  try {
    // Extract class details from request body
    const { courseId, date, startTime, endTime, location } = req.body;

    // Create new class record
    const newClass = await Class.create({
      courseId,
      date,
      startTime,
      endTime,
      location
    });

    // Return success response
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/create_course', verifyToken, isAdmin, async (req, res) => {
    try {
      // Extract course details from request body
      const { name, facultyId } = req.body;
  
      // Create new course record
      const newCourse = await Course.create({
        name,
        facultyId
      });
  
      // Return success response
      res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post('/enroll-student', verifyToken, isAdmin, async (req, res) => {
    try {
      // Extract attendance details from request body
      const { courseId, studentId, classId, classes_attended, total_classes, od_ml, facultyId } = req.body;
  
      // Check if facultyId exists
      // const faculty = await Faculty.findByPk(facultyId);
      // if (!faculty) {
      //   return res.status(404).json({ message: 'Faculty not found' });
      // }
  
      // Check if courseId exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Check if classId exists
      const classInstance = await Class.findByPk(classId);
      if (!classInstance) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Check if studentId exists
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Create new attendance record
      const newAttendanceRecord = await AttendanceRecord.create({
        facultyId,
        courseId,
        studentId,
        classId,
        classes_attended,
        total_classes,
        od_ml
      });
  
      // Return success response
      res.status(201).json({ message: 'Attendance marked successfully', attendanceRecord: newAttendanceRecord });
    } catch (error) {
      console.error('Error marking attendance:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get all courses
router.get('/courses', verifyToken, isAdmin, async (req, res) => {
    try {
      const courses = await Course.findAll();
      res.status(200).json({ courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all classes
router.get('/classes', verifyToken, isAdmin, async (req, res) => {
    try {
      const classes = await Class.findAll();
      res.status(200).json({ classes });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all faculty
router.get('/faculty', verifyToken, isAdmin, async (req, res) => {
    try {
      const faculty = await Faculty.findAll();
      console.log(faculty);
      res.status(200).json({ faculty });
    } catch (error) {
      console.error('Error fetching faculty:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all students
router.get('/students', verifyToken, isAdmin, async (req, res) => {
    try {
      const students = await Student.findAll();
      res.status(200).json({ students });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


// Export router
module.exports = router;