KISSY.add("app/views/pages/archive/archive", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;

            me.manage(MM.fetchAll([{
                name: "article_list"
            }], function (errs, MesModel) {
                var data = MesModel.get('data');
                S.log(data);

                me.setViewPagelet({
                    list: data
                });
            }));
        }
    });
},{
    requires:['mxext/view', 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});