var EventProxy = require('eventproxy').EventProxy;
var sanitize = require('validator');
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
 * 根据tag获取文章列表
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.getArticleByTag = function(req, res, next) {
    var tag = req.query.tag;

    getArticleByTag(tag, function(err, data) {
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
};

/**
 * 获取文章编辑内容并保存到数据库
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 */
exports.edit = function(req, res, next) {
    var id = sanitize.trim(req.body.id);
    var title = sanitize.trim(req.body.title);
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
    var tag = req.body.tag;
    var title = sanitize.trim(req.body.title);
    var markdownContent = req.body.content;
    var htmlContent = markdown.makeHtml(markdownContent);

    var article = new Article();
    article.type = type;
    article.tag = tag;
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

// 归档
exports.archive = function (req, res, next) {
    Article.aggregate({
        $group: {
            _id: {
                year: { $year: "$update" },
                month: { $month: "$update" }
            },
            list: {
                $push: {
                    "id": "$_id",
                    "title": "$title",
                    "type": "$type"
                }
            }
        }
    }, {
        $project: {
            _id: 0,
            time: "$_id",
            list: "$list"
        }
    }, function(err, doc) {
        res.json({
            data: doc,
            info: {
                ok: true,
                msg: null
            }
        })
    });
}

// 标签
exports.getTags = function(req, res, next) {
    Article.aggregate({
        $group: {
            _id: "$tag", 
            count: {
                $sum: 1
            }
        }
    }, {
        $project: {
            _id: 0,
            tag: "$_id",
            count: "$count"
        }
    }, function(err, doc) {
        res.json({
            data: doc,
            info: {
                ok: true,
                msg: null
            }
        })
    });
}

function getArticleById(id, callback) {
    Article.findOne({_id: id}, function(err, doc) {
        if (err) return callback(err);

        doc.pv += 1;
        doc.save();
        
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
    // 将查询结果按时间倒序，因为 MongoDB 的 _id 生成算法中已经包含了当前的时间，
    // 所以这样写不仅没问题，也是推荐的按时间排序的写法。
    Article.find({type: type}).sort({"_id": -1}).exec(function(err, doc) {
        if (err) return callback(err);
        callback(null, doc);
    });
}