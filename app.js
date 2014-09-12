var express = require('express');
var jade = require('jade');
var path = require('path');
var config = require('config');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var serveStatic = require('serve-static');
var routes = require('./routes');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: config.session_secret
}));
app.use(function (req, res, next) {
    res.locals.config = config;
    next();
});

routes(app);

app.listen(app.get('port'));