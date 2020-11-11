'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');

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
  await Revision.create({ 
    issue_id: issue.id,
    changes :  {
      title, 
      description 
    }
  });
  respond.success(context, { issue });
};

Issues.update = async (context) => {
  const { title, description } = context.request.body;
  
  if (!title) return respond.badRequest(context, { message: 'Title cannot be empty' });
  
  const issue = await Issue.findById(context.params.id);
  if (!issue) return respond.notFound(context, { message: 'Issue not found' });
  
  const previousTitle = issue.title;
  const previousDescription = issue.description;
  
  issue.title = title;
  issue.description = description;
  
  await issue.save();
  
  const changes = {};
  if (previousTitle !== title) changes.title = title;
  if (previousDescription !== description) changes.description = description;
  
  await Revision.create({ 
    issue_id: issue.id,
    changes
  });
  
  respond.success(context, { issue.toJSON(), changes });
};

Issues.revisions = async (context) => {
  const issue = await Issue.findOne({ 
    where: { id: context.params.id },
    include: Revision 
  });
  respond.success(context, { issue });
};

module.exports = Issues;
