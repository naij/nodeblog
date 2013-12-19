
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var routes = require('./routes');
var config = require('./config').config;
var pidfile = path.join(__dirname, 'app.pid');
fs.writeFileSync(pidfile, process.pid);
var app = module.exports = express.createServer();

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.register('.html', ejs);
    //app.set('view options', {layout: false});
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.session_secret
    }));

    // custom middleware
    app.use(require('./controllers/sign').authUser);

    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.helpers({
    config: config
});

app.dynamicHelpers({
    error: function(req,res){
        var err = req.flash('error');
        if(err.length){
            return err;
        }
        else{
            return null;
        }
    }
});

// Routes
routes(app);

app.listen(3000);

// 退出进程
process.on('SIGTERM', function() {
    if (fs.existsSync(pidfile)) {
        fs.unlinkSync(pidfile);
    }
    process.exit(0);
});