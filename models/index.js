var mongoose = require('mongoose');
var config = require('config');
var db = config.db;

mongoose.connect(db, function (err) {
    if (err) {
        console.error('connect to %s error: ', db, err.message);
        process.exit(1);
    }
    else{
        console.log('connect to "%s" success', db);
    }
});

// models
require('./article');
require('./tag');
require('./pic');
require('./user');

exports.Article = mongoose.model('Article');
exports.Tag = mongoose.model('Tag');
exports.Pic = mongoose.model('Pic');
exports.User = mongoose.model('User');

