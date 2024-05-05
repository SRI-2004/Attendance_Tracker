// models/class.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the import path as necessary
const AttendanceRecord = require('./AttendanceRecord.js');
const Course = require('./Course');
const Image_Data = require('./Image_Data');

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

// Sync with the database

(async () => {
    try {
        await Class.sync();
        Class.belongsTo(Course, { foreignKey: 'courseId' });
        Class.hasMany(AttendanceRecord, { foreignKey: 'classId' });
        Class.hasMany(Image_Data, { foreignKey: 'classId' });
  
        console.log("Class model is synced with the database");
    } catch (error) {
        console.error("Error syncing the Class model:", error);
    }
  })();
// Define Relationships


module.exports = Class;
