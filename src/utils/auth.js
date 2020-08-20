var { config } = require('../config');
var { User } = require('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt')

function newToken(user) {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

function verifyToken(token) {
  return new Promise(function handlePromise(resolve, reject) {
    jwt.verify(token, config.secrets.jwt, function handleVerification(error, payload) {
      if (error) {
        console.error(error)
        return reject(error);
      }
      resolve(payload);
    })
  })
}

async function signup(req, res) {
  if(!req.body.email || !req.body.password) {
    console.error('need email and password')
    return res.status(400).send({ message: 'need email and password'});
  }

  try {
    var user = await User.create(req.body);
    var token = newToken(user);
    return res.status(201).send({ token });

  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}

async function signin(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ mesasge: 'need email and password' });
  }
  
  var invalid = { mesasge: 'Invalid email and password combination.' };

  try {
    var user = await User.findOne({ email: req.body.email })
      .select('email password')
      .exec();
    if (!user) {
      return res.status(401).json(invalid);
    }
    var match = await user.checkPassword(req.body.password);
    if (!match) {
      return res.status(401).json(invalid);
    }
    var token = newToken(user);
    res.status(202).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

async function protect(req, res, next) {
  var bearer = req.headers.authorization;
  if(!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(400).end();
  }

  var token = bearer.split(' ')[1].trim();
  var payload;
  try {
    payload = await verifyToken(token);

  } catch (error) {
    return res.status(401).end();
  }

  user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec();
  if(!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
}

module.exports = {
  signup,
  signin,
  protect
}