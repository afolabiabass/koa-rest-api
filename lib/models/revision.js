'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');
const Issue = require('../models/issue');

const Revision = sequelize.define('revision', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  issue_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Issue,
      key: 'id'
    }
  },
  changes: {
    type: Sequelize.JSON,
    get() {
      const changes = this.getDataValue('changes');
      return changes ? JSON.parse(changes) : {};
    }
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: false,
  tableName: 'issue_revisions'
});

module.exports = Revision;
