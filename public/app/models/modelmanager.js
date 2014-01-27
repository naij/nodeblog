KISSY.add("app/models/modelmanager", function (S, BaseManager, BaseModel) {
    var Manager = BaseManager.create(BaseModel);
    Manager.registerModels([
        // 获取文章列表
        {
            name: 'article_list',
            url: '/article/getArticles',
            urlParams:{
                action:'get'
            }
        },
        // 获取文章列表
        {
            name: 'article_detail',
            url: '/article/getArticleById',
            urlParams:{
                action:'get'
            }
        },
        // 获取登录信息
        {
            name: 'login_msg',
            url: '/sign/loginMsg',
            urlParams:{
                action:'get'
            }
        },
        {
            name: 'login',
            url: '/sign/login',
            urlParams:{
                action:'post'
            }
        }
    ]);
    return Manager;
}, {
    requires: ["mxext/mmanager", "app/models/basemodel"]
});