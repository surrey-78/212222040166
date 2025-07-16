const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const shortUrlRoutes = require('./routes/shorturl');

const app = express();
const PORT = 8000;

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(logger);

app.use('/', shortUrlRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`URL Shortener running at http://localhost:${PORT}`);
});
