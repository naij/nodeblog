var site = require('../controllers/site');
var article = require('../controllers/article');
var tag = require('../controllers/tag');
var pic = require('../controllers/pic');
var manage = require('../controllers/manage');

module.exports = function (app) {

    // 首页
    app.get('/', site.index);
    app.get('/debug', site.debug);


    // 文章列表
    app.get('/article/getArticles', article.getArticles);

    // 文章详情
    app.get('/article/getArticleById', article.getArticleById);

    // 归档
    app.get('/article/archive', article.archive);

    // 标签
    app.get('/article/getTags', article.getTags);

    // 根据标签获取文章列表
    app.get('/article/getArticleByTag', article.getArticleByTag);

    // 后台路由过滤
    app.all('/manage/*', manage.userAuth);

    // 文章列表
    app.get('/manage/getArticles', article.getArticles);

    // 文章详情
    app.get('/manage/getArticleById', article.getArticleById);

    // 文章编辑
    app.post('/manage/articleEdit', article.edit);

    // 文章添加
    app.post('/manage/articleAdd', article.add);

    // 文章删除
    app.post('/manage/articleDel', article.del);

    // 标签列表
    app.get('/manage/getTags', tag.getTags);

    // 图片列表
    app.get('/manage/getPictures', pic.getPictures);

    // 图片添加
    app.post('/manage/pictureAdd', pic.add);

    // 账户信息
    app.get('/loginMsg', manage.loginMsg);

    // 登录
    app.post('/login', manage.login);

    // 登出
    app.get('/logout', manage.logout);

    // 404
    app.use(function (req, res) {
        res.render("404");
    });
}