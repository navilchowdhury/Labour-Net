const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  
  // Extract token from "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;
    
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};