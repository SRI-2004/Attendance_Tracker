// models/studentClasses.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentClasses = sequelize.define('StudentClasses', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // You may add additional attributes if needed
});
(async () => {
  try {
      await StudentClasses.sync();
      console.log("StudentClasses model is synced with the database");
  } catch (error) {
      console.error("Error syncing the StudentClasses model:", error);
  }
})();

module.exports = StudentClasses;
