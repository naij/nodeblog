var articleCtrl = require('./article');
var util = require('../libs/util');

exports.index = function(req, res, next) {
    res.render('index');

    // articleCtrl.getFullArticle(function(err, data) {
    //     if (err) {
    //         next(err);
    //     }

    //     for(var i = 0; i < data.length; i++) {
    //         data[i].publishDate = util.formatDate(data[i].update);
    //     }

    //     res.render('index', {
    //         article: data
    //     });
    // });
};