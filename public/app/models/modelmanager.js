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
        // 根据标签获取文章列表
        {
            name: 'article_list_by_tag',
            url: '/article/getArticleByTag'
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
        // 图片列表
        {
            name: 'picture_list',
            url: '/manage/getPictures'
        },
        // 图片添加
        {
            name: 'picture_add',
            url: '/manage/pictureAdd',
            options: {
                type: 'post'
            }
        },
        // 标签列表
        {
            name: 'manage_tag_list',
            url: '/manage/getTags'
        },
        // 归档
        {
            name: 'archive',
            url: '/article/archive'
        },
        // 标签
        {
            name: 'tag_list',
            url: '/article/getTags'
        },
        // 获取登录信息
        {
            name: 'login_msg',
            url: '/loginMsg'
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