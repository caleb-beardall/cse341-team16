const express = require('express');
const bodyParser = require('body-parser');

const eventsRoutes = require('./routes/events');
const rsvpsRoutes = require('./routes/rsvps')

const app = express();
app.use(bodyParser.json());

app.use('/events', eventsRoutes);
app.use('/rsvps', rsvpsRoutes)

module.exports = app;