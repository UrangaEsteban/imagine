"use strict"
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var { config } = require('./config')
var { connect } = require('./utils/db');
var { signup, signin, protect } = require('./utils/auth');
var { userRouter } = require('./routers/api/user');
var { imageRouter } = require('./routers/api/image');
var cors = require('cors');

var app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/register', signup);
app.post('/login', signin);

app.use('/api/', protect);


app.get('/', function handleIndex(req, res) {
  res.send('Winter is coming!');
})

app.use('/api/user', userRouter);

app.use('/api/image', imageRouter);

exports.start = async function start(){
  try {
    await connect();
    app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
  } catch (e) {
    console.log(e);
  }
}