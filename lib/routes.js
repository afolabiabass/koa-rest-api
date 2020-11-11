'use strict';

const Router = require('koa-router');
const router = new Router();
const IssueAPI = require('./api/issues');

/** General Routes */
router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

/** Issue Routes */
router.get('/issues/:id/revisions', IssueAPI.revisions);
router.get('/issues/:id', IssueAPI.show);
router.put('/issues/:id', IssueAPI.update);
router.get('/issues', IssueAPI.index);
router.post('/issues', IssueAPI.store);

module.exports = router;
