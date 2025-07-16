const express = require('express');
const logger = require('./middleware/logger');
const shortUrlRoutes = require('./routes/shorturl');

const app = express();
app.use(express.json());
app.use(logger);

const cors = require('cors');
app.use(cors());

app.use('/', shortUrlRoutes);

const PORT = 8000;
app.listen(PORT, () => console.log(`URL Shortener running at http://localhost:${PORT}`));
