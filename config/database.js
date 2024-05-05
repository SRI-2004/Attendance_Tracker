const { Sequelize } = require('sequelize');

// config/database.js
const sequelize = new Sequelize('attendance_cv', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;;
