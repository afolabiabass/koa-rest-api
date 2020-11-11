'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');

const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

const Issues = {};

Issues.get = async (context) => {
  const issue = await Issue.findById(context.params.id);
  respond.success(context, { issue });
};

Issues.post = async (context) => {
  // get post content
  const { title, description } = context.request.body;
  
  if (!title) return respond.badRequest(context, { message: 'Title required' });
  
  const issue = await Issue.create({ title, description });
  respond.success(context, { issue });
};

module.exports = Issues;
