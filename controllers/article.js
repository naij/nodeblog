var EventProxy = require('eventproxy').EventProxy;
var sanitize = require('validator').sanitize;
var markdown = require('markdown-js');
var models = require('../models');
var util = require('../libs/util');
var Article = models.Article;

/**
 * 根据id获取文章详情
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.index = function(req, res, next) {
    var articleId = req.params.aid;

    if (articleId.length !== 24) {
        console.log('此话题不存在或已被删除。');
        return;
    }

    var render = function(article, recentArticle) {
        res.render('article/article', {
            article: article,
            recentArticle: recentArticle
        });
    }

    var proxy = EventProxy.create('article', 'recentArticle', render);

    getArticleById(articleId, function(err, data) {
        if (err) {
            next(err);
        }

        //格式化时间
        var tempDate = util.formatDate(data.update);
        data.publishDate = tempDate;

        proxy.emit('article', data);
    });

    getFullArticle(function(err, data) {
        if (err) {
            next(err);
        }

        var tempDate = '';

        for(var i = 0; i < data.length; i++) {
            tempDate = util.formatDate(data[i].update);
            data[i].publishDate = tempDate;
        }

        var recentArticle = data.slice(0, 5);

        proxy.emit('recentArticle', recentArticle);
    });
};


/**
 * 显示文章编辑页面
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.showEdit = function(req, res, next) {
    var articleId = req.params.aid;

    if (!req.session.user) {
        return res.redirect('home');
    }

    if (articleId.length !== 24) {
        console.log('此话题不存在或已被删除。');
        return;
    }

    getArticleById(articleId, function(err, doc) {
        if (err) {
            next(err);
        }

        res.render('article/edit', {
            article : doc
        });
    });
}

/**
 * 获取文章编辑内容并保存到数据库
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.edit = function(req, res, next) {
    var id = sanitize(req.body.id).trim();
    var title = sanitize(req.body.title).trim();
    var markdownContent = req.body.content;
    var htmlContent = markdown.makeHtml(markdownContent);

    getArticleById(id, function(err, doc) {
        if (err) {
            next(err);
        }

        doc.title = title;
        doc.content = htmlContent;
        doc.markdown = markdownContent.replace(/&/g, "&amp;");
        doc.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('home');
        });
    });
}

/**
 * 显示新建文章页面
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.showAdd = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('home');
    }

    res.render('article/add');
}

/**
 * 获取新建文章内容并保存到数据库
 * @param {[type]}   req  [description]
 * @param {[type]}   res  [description]
 * @param {Function} next [description]
 */
exports.add = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('home');
    }

    var tag = req.body.tag;
    var title = sanitize(req.body.title).trim();
    var markdownContent = req.body.content;
    var htmlContent = markdown.makeHtml(markdownContent);

    var article = new Article();
    article.tag = tag;
    article.title = title;
    article.content = htmlContent;
    article.markdown = markdownContent.replace(/&/g, "&amp;");
    article.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.redirect('home');
    });
}

/**
 * 根据id删除相应的文章
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.del = function(req, res, next) {
    var articleId = req.params.aid;

    if (!req.session.user) {
        return res.redirect('home');
    }

    if (articleId.length !== 24) {
        console.log('此话题不存在或已被删除。');
        return;
    }

    getArticleById(articleId, function(err, doc) {
        if (err) {
            next(err);
        }

        doc.remove(function(err) {
            return res.redirect('home');
        })
    });
}

/**
 * 根据标签筛选文章
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.tag = function(req, res, next) {
    var tag = req.params.tag;

    var render = function(article, recentArticle) {
        res.render('index', {
            article: article,
            recentArticle: recentArticle
        });
    }

    var proxy = EventProxy.create('article', 'recentArticle', render);

    getArticleByTag(tag,function(err, data) {
        if (err) {
            next(err);
        }

        for(var i = 0; i < data.length; i++) {
            tempDate = util.formatDate(data[i].update);
            data[i].publishDate = tempDate;
        }

        proxy.emit('article',data);
    });

    getFullArticle(function(err, data) {
        if (err) {
            next(err);
        }

        var tempDate = '';

        for(var i = 0; i < data.length; i++) {
            tempDate = util.formatDate(data[i].update);
            data[i].publishDate = tempDate;
        }

        var recentArticle = data.slice(0, 5);

        proxy.emit('recentArticle',recentArticle);
    });
}

function getArticleById(id, callback) {
    Article.findOne({_id: id}, function(err, doc) {
        if (err) return callback(err);
        callback(null, doc);
    });
}

function getArticleByTag(tag, callback) {
    Article.find({tag: tag}, function(err, doc) {
        if (err) return callback(err);
        callback(null, doc);
    });
}

function getFullArticle(callback) {
    Article.find({}, null, {sort:[['update','desc']]}, function(err, doc) {
        if (err) return callback(err);
        callback(null, doc);
    });
}

exports.getArticleById = getArticleById;
exports.getFullArticle = getFullArticle;