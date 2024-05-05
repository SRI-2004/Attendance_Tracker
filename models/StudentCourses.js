// models/studentCourses.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentCourses = sequelize.define('StudentCourses', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // You may add additional attributes if needed
});
(async () => {
  try {
      await StudentCourses.sync();
      console.log("StudentCourses model is synced with the database");
  } catch (error) {
      console.error("Error syncing the StudentCourses model:", error);
  }
})();

module.exports = StudentCourses;
