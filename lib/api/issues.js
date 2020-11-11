'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');

const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

const Issues = {};

Issues.index = async (context) => {
  const page = context.params.page || 0;
  const limit = context.params.limit || 10;
  
  const issues = await Issue.findAll({ 
    offset: page * limit, 
    limit
  });
  respond.success(context, { issues });
};

Issues.show = async (context) => {
  const issue = await Issue.findById(context.params.id);
  respond.success(context, { issue });
};

Issues.store = async (context) => {
  // get post content
  const { title, description } = context.request.body;
  
  if (!title) return respond.badRequest(context, { message: 'Title required' });
  
  const issue = await Issue.create({ title, description });
  respond.success(context, { issue });
};

Issues.update = async (context) => {
  const { title, description } = context.request.body;
  
  if (!title) return respond.badRequest(context, { message: 'Title cannot be empty' });
  
  const issue = await Issue.update({ title, description }, {
    where: {
      id: context.params.id
    }
  });
  respond.success(context, { issue });
};

module.exports = Issues;
