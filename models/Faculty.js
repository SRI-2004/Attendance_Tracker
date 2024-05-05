// models/faculty.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the import path as necessary
const Course = require('./Course');
const Student = require('./Student');
const Faculty = sequelize.define('Faculty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
});

(async () => {
    try {
      await Faculty.sync();
      console.log('Faculty model synchronized with the database.');
      Faculty.hasMany(Course, { foreignKey: 'facultyId' });
      Faculty.hasMany(AttendanceRecord, { foreignKey: 'facultyId' });
      Faculty.hasMany(Student, { foreignKey: 'facultyId' });
    } catch (error) {
      console.error('Error syncing the Faculty model:', error);
    }
  })();

// Define Relationships


module.exports = Faculty;
