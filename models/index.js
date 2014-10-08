var mongoose = require('mongoose');
var username = process.env.MONGO_USERNAME;
var password = process.env.MONGO_PASSWORD;
var mongodb = 'mongodb://' + username + ':' + password + '@' + '127.0.0.1:27017/kiwiobject';

mongoose.connect(mongodb, function (err) {
    if (err) {
        console.error('connect to mongodb error: ', err.message);
        process.exit(1);
    } else {
        console.log('connect to mongodb success');
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

