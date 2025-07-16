const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
const logFile = path.join(logDir, 'request.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;

  try {
    fs.appendFileSync(logFile, log);
  } catch (err) {
    console.error('Logging error:', err.message);
  }

  next();
};

module.exports = logger;
