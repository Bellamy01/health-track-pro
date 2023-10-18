const express = require('express');
const body_parser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const patientRecordRoutes = require('./routes/patientRecordRoute');

const app = express();

app.use(body_parser.json())

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/records', patientRecordRoutes);

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