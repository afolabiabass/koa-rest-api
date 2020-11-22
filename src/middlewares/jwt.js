'use strict';

const KEY = process.env.APP_KEY || 'key';
const jwt = require('koa-jwt');

module.exports = jwt({ 
  secret: KEY 
});