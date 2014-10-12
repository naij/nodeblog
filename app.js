var path = require('path');
var dotenv = require('dotenv');
dotenv._getKeysAndValuesFromEnvFilePath(path.join(process.env.HOME, '.env'));
dotenv._setEnvs();

var express = require('express');
var fs = require('fs');
var jade = require('jade');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var multer  = require('multer');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var serveStatic = require('serve-static');
var config = require('config');
var routes = require('./routes');
var app = express();
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/access.log'), {flags: 'a'});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(logger('combined', {stream: accessLogStream}));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/'}));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    store: new RedisStore({
        redisHost: config.redisHost,
        redisPort: config.redisPort
    }),
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}));
app.use(function (req, res, next) {
    res.locals.config = config;
    next();
});

routes(app);

app.listen(app.get('port'));