const express = require('express');
const router = express.Router();
const {
  createShortURL,
  getStats,
  redirectToURL  
} = require('../controllers/shortUrlController');

router.post('/shorturls', createShortURL);

router.get('/shorturls/:code', getStats);

router.get('/:code', redirectToURL);  

module.exports = router;
