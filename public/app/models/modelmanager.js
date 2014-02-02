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

        // 文章添加
        {
            name: 'article_add',
            url: '/article/articleAdd',
            options: {
                type: 'post'
            }
        },
        // 文章编辑
        {
            name: 'article_edit',
            url: '/article/articleEdit',
            options: {
                type: 'post'
            }
        },
        // 文章删除
        {
            name: 'article_del',
            url: '/article/articleDel',
            options: {
                type: 'post'
            }
        },

        // 获取登录信息
        {
            name: 'login_msg',
            url: '/sign/loginMsg'
        },
        // 登录
        {
            name: 'login',
            url: '/sign/login',
            options: {
                type: 'post'
            }
        },
        // 登出
        {
            name: 'logout',
            url: '/sign/logout'
        }

    ]);
    return Manager;
}, {
    requires: ["mxext/mmanager", "app/models/basemodel"]
});