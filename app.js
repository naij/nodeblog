var express = require('express');
var ejs = require('ejs');
var path = require('path');
var routes = require('./routes');
var config = require('./config').config;
var app = express();

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.engine('html', ejs.renderFile);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.session_secret
    }));
    app.use(function (req, res, next) {
        res.locals.config = config;
        next();
    });
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler({ 
        dumpExceptions: true, 
        showStack: true 
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

routes(app);

app.listen(3000);

console.log(process.env.NODE_ENV);