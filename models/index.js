var mongoose = require('mongoose');
var config = require('config');
var mongodb = config.mongodb;

mongoose.connect(mongodb, function (err) {
    if (err) {
        console.error('connect to %s error: ', mongodb, err.message);
        process.exit(1);
    }
    else{
        console.log('connect to "%s" success', mongodb);
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

