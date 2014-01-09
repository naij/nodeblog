var articleCtrl = require('./article');
var util = require('../libs/util');

exports.index = function(req, res, next) {
    //var proxy = EventProxy.create('tags', 'topics', 'hot_topics', 'stars', 'tops', 'no_reply_topics', 'pages', function(){console.log('ok')});

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