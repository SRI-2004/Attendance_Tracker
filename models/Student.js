// models/student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Faculty = require('./Faculty');
const Course = require('./Course');
const Class = require('./Class');
const StudentCourses = require('./StudentCourses');
const StudentClasses = require('./StudentClasses');
const ImageData = require('./Image_Data'); // Import ImageData model

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
});

// Wait for synchronization to finish before defining relationships
(async () => {
  try {
    await Student.sync();
    console.log('Student model synchronized with the database.');
    
    // Define Relationships
    Student.belongsToMany(Course, { through: StudentCourses }); // Many-to-Many with Course through junction table
    Student.belongsTo(Faculty, { foreignKey: 'advisorId' }); // Many-to-One with Faculty
    Student.belongsToMany(Class, { through: StudentClasses }); // Many-to-Many with Class through junction table
    Student.hasOne(ImageData); // One-to-One with ImageData
  } catch (error) {
    console.error('Error syncing the Student model:', error);
  }
})();

module.exports = Student;
