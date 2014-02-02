var site = require('../controllers/site');
var article = require('../controllers/article');
var sign = require('../controllers/sign');

module.exports = function (app) {
    
    app.get('/', site.index);

    // 文章列表
    app.get('/article/getArticles', article.getArticles);

    // 文章详情
    app.get('/article/getArticleById', article.getArticleById);

    // 文章编辑
    app.post('/article/articleEdit', article.edit);

    // 文章添加
    app.post('/article/articleAdd', article.add);

    // 文章删除
    app.post('/article/articleDel', article.del);

    // 标签
    app.get('/tag/:tag',article.tag);

    // 账户信息
    app.get('/sign/loginMsg', sign.loginMsg);

    // 登录
    app.post('/sign/login', sign.login);

    // 登出
    app.get('/sign/logout', sign.logout);
}