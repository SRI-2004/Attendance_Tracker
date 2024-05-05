// models/imagedata.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the import path as necessary
const Student = require('./Student');
const Class = require('./Class');
const Image_Data = sequelize.define('Image_Data', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
});
(async () => {
  try {
      await Image_Data.sync();
      Image_Data.belongsTo(Student, { foreignKey: 'studentId' });
      Image_Data.belongsTo(Class, { foreignKey: 'classId' });

      console.log("Image_Data model is synced with the database");
  } catch (error) {
      console.error("Error syncing the Image_Data model:", error);
  }
})();


module.exports = Image_Data;
