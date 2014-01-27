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
        }
    ]);
    return Manager;
}, {
    requires: ["mxext/mmanager", "app/models/basemodel"]
});