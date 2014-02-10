var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var routes = require('./routes');
var manage = require('./controllers/manage');
var config = require('./config').config;
var app = express();
var pidfile = path.join(__dirname, 'app.pid');

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

    fs.writeFileSync(pidfile, process.pid);
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

// 退出进程
process.on('SIGTERM', function () {
    if (fs.existsSync(pidfile)) {
        fs.unlinkSync(pidfile);
    }
    process.exit(0);
});