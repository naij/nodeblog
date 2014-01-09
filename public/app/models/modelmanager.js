KISSY.add("app/models/modelmanager", function (S, BaseManager, BaseModel) {
    var Manager = BaseManager.create(BaseModel);
    Manager.registerModels([
        // 内容管理-内容列表
        {
            name: 'kiwiobject_article_list',
            url: '/article/getAtricles',
            urlParams:{
                action:'get'
            }
        }
    ]);
    return Manager;
}, {
    requires: ["mxext/mmanager", "app/models/basemodel"]
});