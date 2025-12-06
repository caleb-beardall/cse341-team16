const express = require('express');
const bodyParser = require('body-parser');

const eventsRoutes = require('./routes/events');
const rsvpsRoutes = require('./routes/rsvps')
const organizationsRoutes = require('./routes/organizations');

const app = express();
app.use(bodyParser.json());

app.use('/events', eventsRoutes);
app.use('/rsvps', rsvpsRoutes)
app.use('/organizations', organizationsRoutes);

module.exports = app;