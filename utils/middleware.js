
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {

  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; 
    next(); 
  });
};


const isAdmin = (req, res, next) => {

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next(); 
};

module.exports = { verifyToken, isAdmin };
