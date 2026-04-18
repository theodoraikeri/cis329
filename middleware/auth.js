const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  const token = tokenParts[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(verified._id).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    req.doctor = doctor;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is invalid or expired' });
  }
};