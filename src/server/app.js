const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json;
const cors = require('cors');
const users = require('./users.js');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(jsonParser());
app.use(cookieParser());

app.use('/server/users', users);
// DB
const db = require('../config/keys').MongoURI;

// Connect to Mongo DB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
