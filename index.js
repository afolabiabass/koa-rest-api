'use strict';

const Koa = require('koa');
const app = new Koa();
const router = require('./src/routes');
const PORT = process.env.PORT || 3000;
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(function(ctx, next){
  return next().catch((error) => {
    if (401 === error.status) {
      ctx.status = 401;
      ctx.body = 'Unauthorized';
    } else {
      throw error;
    }
  });
});

module.exports = app.listen(PORT);
console.log('Listening on http://localhost:%s/', PORT);
