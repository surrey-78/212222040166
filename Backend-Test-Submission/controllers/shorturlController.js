const fs = require('fs');
const path = require('path');
const validator = require('validator');
const geoip = require('geoip-lite');
const generateCode = require('../utils/generateShortcode');

const filePath = path.join(__dirname, '../data/urls.json');

const loadData = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Error reading data file:', err.message);
    return {};
  }
};

const saveData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data file:', err.message);
  }
};

exports.createShortURL = (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url || !validator.isURL(url)) {
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    if (shortcode && !/^[a-zA-Z0-9]{1,15}$/.test(shortcode)) {
      return res.status(400).json({ error: 'Shortcode must be alphanumeric and ≤ 15 characters' });
    }

    const urls = loadData();
    let code = shortcode || generateCode();

    if (urls[code]) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + parseInt(validity) * 60000);

    urls[code] = {
      originalUrl: url,
      createdAt: createdAt.toISOString(),
      expiry: expiry.toISOString(),
      clicks: []
    };

    saveData(urls);

    res.status(201).json({
      shortlink: `http://localhost:8000/${code}`,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    console.error('Error in createShortURL:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStats = (req, res) => {
  try {
    const { code } = req.params;
    const urls = loadData();

    if (!urls[code]) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    const { originalUrl, createdAt, expiry, clicks } = urls[code];

    res.json({
      originalUrl,
      createdAt,
      expiry,
      totalClicks: clicks.length,
      clicks  
    });
  } catch (err) {
    console.error('Error in getStats:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.redirectToURL = (req, res) => {
  try {
    const { code } = req.params;
    const urls = loadData();

    if (!urls[code]) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    const entry = urls[code];
    const now = new Date();

    if (new Date(entry.expiry) < now) {
      return res.status(410).json({ error: 'Short URL expired' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || {};
    const location = geo.city || geo.country || 'Unknown';

    entry.clicks.push({
      timestamp: now.toISOString(),
      referrer: req.get('Referer') || 'Direct',
      location
    });

    saveData(urls);

    res.redirect(entry.originalUrl);
  } catch (err) {
    console.error('Error in redirectToURL:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
