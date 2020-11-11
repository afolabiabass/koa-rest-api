'use strict';

const Router = require('koa-router');
const router = new Router();
const IssueAPI = require('./api/issues');

/** General Routes */
router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

/** Issue Routes */
router.get('/issues/:id', IssueAPI.get);
router.post('/issues', IssueAPI.post);

module.exports = router;
