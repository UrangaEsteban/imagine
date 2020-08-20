var { User } = require('../models/user');

// TODO proper user controllers
async function  getUser(req, res) {
  return res.status(200).json({ data: req.user })
}

module.exports = {
  getUser,
}