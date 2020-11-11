'use strict';

const respond = require('./responses');
const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

module.exports = (context) => {
  respond.success(context, {
    discovery: baseUrl
  });
};
