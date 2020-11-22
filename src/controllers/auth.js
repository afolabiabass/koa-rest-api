'use strict';

const respond = require('./responses');
const jwt = require('jsonwebtoken');
const KEY = process.env.APP_KEY || 'key';
const SECRET = process.env.APP_SECRET || 'secret';

const Auth = {};

Auth.login = async (context) => {
  const { email, password } = context.request.body;
  if (password === SECRET) {
    respond.success(context, {
      token: jwt.sign({ email }, KEY),
      message: "Login successful"
    });
  } else {
    respond.badRequest(context, { message: "Authentication failed" });
  }
};

module.exports = Auth;
