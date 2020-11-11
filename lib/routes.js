'use strict';

const Router = require('koa-router');
const router = new Router();
const IssueAPI = require('./api/issues');
const Auth = require('./api/auth');
const jwt = require('./middlewares/jwt');

/** General Routes */
router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

/** Authentication Routes */
router.post('/login', Auth.login);

/** Issue Routes */
router.get('/issues/:id/revisions', IssueAPI.revisions);
router.get('/issues/:id', IssueAPI.show);
router.put('/issues/:id', jwt, IssueAPI.update);
router.get('/issues', IssueAPI.index);
router.post('/issues', jwt, IssueAPI.store);

module.exports = router;
