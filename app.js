const path = require('path');
const express = require('express');
const body_parser = require('body-parser');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoute');
const patientRecordRoutes = require('./routes/patientRecordRoute');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use(body_parser.json())

app.use(
  express.static(__dirname, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    },
  })
);

app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 3600000,
  message: 'Too many request from this IP, Please try again in an hour!!',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10Kb' }));

app.use(mongoSanitize());

app.use(xss());

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