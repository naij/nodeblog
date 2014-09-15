var articleCtrl = require('./article');
var util = require('../libs/util');

exports.index = function(req, res, next) {
    res.render('index');
};

exports.debug = function(req, res, next) {
    res.render('debug');
};