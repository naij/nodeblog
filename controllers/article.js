var EventProxy = require('eventproxy').EventProxy;
var sanitize = require('validator').sanitize;
var markdown = require('markdown-js');
var models = require('../models');
var util = require('../libs/util');
var Article = models.Article;


// 根据type类型获取文章列表
// type类型有：kiwiobject|discovery|life
exports.getArticles = function (req, res, next) {
    var type = req.query.type;

    getFullArticle(type, function (err, data) {
        if (err) {
            res.json({
                data: null,
                info: {
                    ok: false,
                    msg: '查询出错'
                }
            });

            return false;
        }

        var list = [];

        for (var i = 0; i < data.length; i++) {
            var temp = data[i].toJSON();
            temp['publishDate'] = util.formatDate(temp.update);
            list.push(temp);
        }

        res.json({
            data: list,
            info: {
                ok: true,
                msg: null
            }
        });
    });
}

/**
 * 根据id获取文章详情
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.getArticleById = function(req, res, next) {
    var articleId = req.query.id;

    if (articleId.length !== 24) {
        console.log('此话题不存在或已被删除。');
        return;
    }

    getArticleById(articleId, function(err, data) {
        if (err) {
            res.json({
                data: null,
                info: {
                    ok: false,
                    msg: '查询出错'
                }
            });

            return false;
        }

        //格式化时间
        var tempData = data.toJSON();
        var tempDate = util.formatDate(tempData.update);
        tempData.publishDate = tempDate;

        res.json({
            data: tempData,
            info: {
                ok: true,
                msg: null
            }
        });
    });
};

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
                res.json({
                    data: '',
                    info: {
                        ok: false,
                        msg: '保存出错，请重试！'
                    }
                });
            } else {
                res.json({
                    data: '',
                    info: {
                        ok: true,
                        msg: null
                    }
                });
            }
        });
    });
}

/**
 * 获取新建文章内容并保存到数据库
 * @param {[type]}   req  [description]
 * @param {[type]}   res  [description]
 * @param {Function} next [description]
 */
exports.add = function(req, res, next) {
    if (!req.session.hasLogin) {
        res.json({
            data: '',
            info: {
                ok: false,
                msg: '未登录'
            }
        });

        return;
    }

    var type = req.body.type;
    var title = sanitize(req.body.title).trim();
    var markdownContent = req.body.content;
    var htmlContent = markdown.makeHtml(markdownContent);

    var article = new Article();
    article.type = type;
    article.title = title;
    article.content = htmlContent;
    article.markdown = markdownContent.replace(/&/g, "&amp;");
    article.save(function (err) {
        if (err) {
            return next(err);
        }
        res.json({
            data: '',
            info: {
                ok: true,
                msg: null
            }
        });
    });
}

/**
 * 根据id删除相应的文章
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.del = function(req, res, next) {
    var articleId = req.body.id;

    if (!req.session.hasLogin) {
        res.json({
            data: '',
            info: {
                ok: false,
                msg: '未登录'
            }
        });

        return;
    }

    if (articleId.length !== 24) {
        res.json({
            data: '',
            info: {
                ok: false,
                msg: '此文章不存在或已被删除。'
            }
        });
        return;
    }

    getArticleById(articleId, function(err, doc) {
        if (err) {
            next(err);
        }

        doc.remove(function(err) {
            res.json({
                data: '',
                info: {
                    ok: true,
                    msg: null
                }
            });
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

function getFullArticle(type, callback) {
    Article.find({type: type}, null, {sort:[['update','desc']]}, function(err, doc) {
        if (err) return callback(err);
        callback(null, doc);
    });
}