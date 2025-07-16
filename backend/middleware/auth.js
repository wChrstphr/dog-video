const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;