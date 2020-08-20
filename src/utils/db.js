var mongoose = require('mongoose');
var { config } = require('../config')

function connect (url = config.dbUrl, opts = {}) {
  return mongoose.connect(
    url,
    {
      ...opts,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
}

module.exports = { connect: connect };