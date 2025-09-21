const { verifyToken } = require('../configs/jwt.config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token is required' 
    });
  }

  try {
    const decoded = verifyToken(token);
    
    req.user = { ...decoded, id: decoded.id || decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

const requireOwner = requireRole(['Owner']);
const requireEmployee = requireRole(['employee']);
const requireAnyUser = requireRole(['Owner', 'employee']);

module.exports = {
  authenticateToken,
  requireRole,
  requireOwner,
  requireEmployee,
  requireAnyUser
};