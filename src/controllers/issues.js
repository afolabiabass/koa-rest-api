'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');

const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

const Issues = {};

Issues.index = async (context) => {
  const page = parseInt(context.query.page) || 0;
  const limit = parseInt(context.query.limit) || 10;

  const issues = await Issue.findAll({
    offset: (page > 0 ? page - 1 : 0) * limit,
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

  const issue = await Issue.create({
    title,
    description,
    created_by: context.state.user.email
  });
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
  issue.updated_by = context.state.user.email;

  await issue.save();

  const changes = {};
  if (previousTitle !== title) changes.title = title;
  if (previousDescription !== description) changes.description = description;

  await Revision.create({
    issue_id: issue.id,
    changes
  });

  respond.success(context, { issue, changes });
};

Issues.revisions = async (context) => {
  const issue = await Issue.findOne({
    where: { id: context.params.id },
    include: Revision
  });

  if (!issue) return respond.notFound(context, { message: 'Issue not found' });

  respond.success(context, { issue });
};

Issues.compare = async (context) => {
  const { id, revisionA, revisionB } = context.params;
  const issue = await Issue.findOne({
    where: { id: id },
    include: Revision
  });

  if (!issue) return respond.notFound(context, { message: 'Issue not found' });

  const revisionOne = issue.revisions.find(revision => revision.id === parseInt(revisionA));
  const revisionTwo = issue.revisions.find(revision => revision.id === parseInt(revisionB));

  let changes = {};

  if (parseInt(revisionA) < parseInt(revisionB)) {
    changes = Object.assign(changes, revisionOne.changes, revisionTwo.changes);
  } else {
    changes = Object.assign(changes, revisionTwo.changes, revisionOne.changes);
  }

  respond.success(context, { issue, changes });
};

module.exports = Issues;
