"use strict"
var { merge } = require('ramda');
var  env = process.env.NODE_ENV || 'development';

var  baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.EXPIRE_TIME
  },
  dbUrl: 'mongodb://localhost:27017/gallery'
};

// var envConfig = {};

// switch (env) {
//   case 'dev':
//   case 'development':
//     envConfig = require('./dev').config;
//     break;
//   case 'test':
//   case 'testing':
//     envConfig = require('./dev').config;
//     break;
//     default:
//       envConfig = require('./dev').config;
// }

// exports.config = merge(baseConfig, envConfig);
exports.config = baseConfig;