const express = require('express');
const bodyParser = require('body-parser');

const eventsRoutes = require('./routes/events');

const app = express();
app.use(bodyParser.json());

app.use('/events', eventsRoutes);

module.exports = app;