const express = require('express');
const body_parser = require('body-parser');
const db = require('./db');
const patientRoutes = require('./routes/patientRoute');

const app = express();

app.use(body_parser.json())

app.use('/api', patientRoutes);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        status: "error",
        message: 'Invalid JSON data in the request',
      });
    }
    next(err);
  });
  

module.exports = app;