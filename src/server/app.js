const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json;
const cors = require('cors');
const users = require('./users.js');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(jsonParser());

app.use('/server/users', users);
// DB
const db = require('../config/keys').MongoURI;

// Connect Flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

// Connect to Mongo DB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
