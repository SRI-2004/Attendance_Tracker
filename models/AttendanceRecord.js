// models/attendanceRecord.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Faculty = require('./Faculty');
const Course = require('./Course');
const Student = require('./Student');
const Class = require('./Class');


const AttendanceRecord = sequelize.define('AttendanceRecord', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    classes_attended: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },
    total_classes: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },
    od_ml: { 
        type: DataTypes.INTEGER, 
        allowNull: true
    }
});

(async () => {
    try {
        await AttendanceRecord.sync();
        AttendanceRecord.belongsTo(Faculty, { foreignKey: 'facultyId' });
        AttendanceRecord.belongsTo(Course, { foreignKey: 'courseId' });
        AttendanceRecord.belongsTo(Student, { foreignKey: 'studentId' });
        AttendanceRecord.belongsTo(Class, { foreignKey: 'classId' });
        
  
        console.log("Attendance_Record model is synced with the database");
    } catch (error) {
        console.error("Error syncing the Attendance_Record model:", error);
    }
  })();

module.exports = AttendanceRecord;
