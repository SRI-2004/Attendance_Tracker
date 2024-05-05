const express = require('express');
const bodyParser = require('body-parser');
const db = require('./utils/db'); // Import the db.js file

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const facultyRouter = require('./routes/faculty');
const studentRouter = require('./routes/student');
const deepfaceRouter = require('./routes/deepface');

// Create Express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/faculty', facultyRouter);
app.use('/student', studentRouter);
app.use('/deepface', deepfaceRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
