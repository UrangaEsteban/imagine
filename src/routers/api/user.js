var express = require('express');
var router = express.Router();
var { getUser } = require('../../controllers/user');

router.get('/', getUser);

module.exports = {
  router
}