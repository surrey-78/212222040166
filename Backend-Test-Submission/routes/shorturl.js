const express = require('express');
const router = express.Router();
const controller = require('../controllers/shorturlController');

router.post('/shorturls', controller.createShortUrl);
router.get('/shorturls/:shortcode', controller.getShortUrlStats);
router.get('/:shortcode', controller.redirectToOriginal);

module.exports = router;
