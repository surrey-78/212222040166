const store = require('../models/store');
const generateShortcode = require('../utils/generateShortcode');

exports.createShortUrl = (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid URL format. Must start with http:// or https://' });
  }

  let code = shortcode || generateShortcode();

  if (shortcode && store[shortcode]) {
    return res.status(409).json({ error: 'Custom shortcode already in use.' });
  }

  while (store[code]) {
    code = generateShortcode();
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + parseInt(validity) * 24 * 60 * 60 * 1000);

  store[code] = {
    originalUrl: url,
    expiry,
    createdAt: now,
    clicks: []
  };

  return res.status(201).json({
    shortlink: `http://localhost:8000/${code}`,
    expiry: expiry.toISOString()
  });
};

exports.redirectToOriginal = (req, res) => {
  const { shortcode } = req.params;
  const data = store[shortcode];

  if (!data) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  const now = new Date();
  if (now > new Date(data.expiry)) {
    return res.status(410).json({ error: 'Link has expired.' });
  }

  const referrer = req.get('Referrer') || 'Direct';
  const location = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  data.clicks.push({
    timestamp: now.toISOString(),
    referrer,
    location
  });

  return res.redirect(data.originalUrl);
};

exports.getShortUrlStats = (req, res) => {
  const { shortcode } = req.params;
  const data = store[shortcode];

  if (!data) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  return res.json({
    shortcode,
    originalUrl: data.originalUrl,
    createdAt: data.createdAt.toISOString(),
    expiry: data.expiry.toISOString(),
    totalClicks: data.clicks.length,
    clicks: data.clicks
  });
};
