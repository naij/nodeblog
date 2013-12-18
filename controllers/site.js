var articleCtrl = require('./article');
var util = require('../libs/util');

exports.index = function(req, res, next) {
    //var proxy = EventProxy.create('tags', 'topics', 'hot_topics', 'stars', 'tops', 'no_reply_topics', 'pages', function(){console.log('ok')});

    articleCtrl.getFullArticle(function(err, data) {
        if (err) {
            next(err);
        }

        for(var i = 0; i < data.length; i++) {
            data[i].publishDate = util.formatDate(data[i].update);
        }

        var recentArticle = data.slice(0, 5);

        res.render('index', {
            article: data,
            recentArticle: recentArticle
        });
    });
};