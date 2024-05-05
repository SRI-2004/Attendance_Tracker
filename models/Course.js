// models/course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the import path as necessary
const Faculty = require('./Faculty');
const Class = require('./Class');
const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

(async () => {
    try {
        await Course.sync();
        Course.hasMany(Class, { foreignKey: 'courseId' });
        Course.belongsTo(Faculty, { foreignKey: 'facultyId' });
  
        console.log("Course model is synced with the database");
    } catch (error) {
        console.error("Error syncing the Course model:", error);
    }
  })();
// Define Relationships


module.exports = Course;
