KISSY.add("app/models/modelmanager", function (S, BaseManager, BaseModel) {
    var Manager = BaseManager.create(BaseModel);
    Manager.registerModels([
        // 获取文章列表
        {
            name: 'article_list',
            url: '/article/getArticles'
        },
        // 获取文章列表
        {
            name: 'article_detail',
            url: '/article/getArticleById'
        },

        // 获取文章列表
        {
            name: 'manage_article_list',
            url: '/manage/getArticles'
        },
        // 获取文章列表
        {
            name: 'manage_article_detail',
            url: '/manage/getArticleById'
        },

        // 文章添加
        {
            name: 'article_add',
            url: '/manage/articleAdd',
            options: {
                type: 'post'
            }
        },
        // 文章编辑
        {
            name: 'article_edit',
            url: '/manage/articleEdit',
            options: {
                type: 'post'
            }
        },
        // 文章删除
        {
            name: 'article_del',
            url: '/manage/articleDel',
            options: {
                type: 'post'
            }
        },

        // 获取登录信息
        {
            name: 'login_msg',
            url: '/manage/loginMsg'
        },
        // 登录
        {
            name: 'login',
            url: '/login',
            options: {
                type: 'post'
            }
        },
        // 登出
        {
            name: 'logout',
            url: '/logout'
        }

    ]);
    return Manager;
}, {
    requires: ["mxext/mmanager", "app/models/basemodel"]
});