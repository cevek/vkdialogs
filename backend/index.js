const koa = require('koa');
const app = koa();
const kc = require('koa-controller');
const env = process.env.NODE_ENV || 'development';
const serve = require('koa-static');
const config = require(`./config/config.${env}.js`);

app.config = config;
app.use(serve('../frontend/dist/'));
app.use(kc.router());
app.models = require('./app/models')(app);

app.listen(7500);
console.log('Listen http://localhost:7500');
