'use strict';

const Koa = require('koa');
const app = new Koa();
const router = require('./lib/routes');
const PORT = process.env.PORT || 3000;

app.use(require('koa-bodyparser')());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
console.log('Listening on http://localhost:%s/', PORT);
