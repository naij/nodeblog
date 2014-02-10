var site = require('../controllers/site');
var article = require('../controllers/article');
var manage = require('../controllers/manage');

module.exports = function (app) {

    app.get('/', site.index);

    // 文章列表
    app.get('/article/getArticles', article.getArticles);

    // 文章详情
    app.get('/article/getArticleById', article.getArticleById);

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

    // 账户信息
    app.get('/manage/loginMsg', manage.loginMsg);

    // 登录
    app.post('/login', manage.login);

    // 登出
    app.get('/logout', manage.logout);

    // 404
    app.use(function (req, res) {
        res.render("404");
    });
}