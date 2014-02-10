KISSY.add("app/views/pages/discovery/article_detail", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            var loc = me.location;
            var params = loc.params;
            var id = params.id;

            me.manage(MM.fetchAll([{
                name: "article_detail",
                urlParams: {
                	id: id
                }
            }], function (errs, MesModel) {
                var data = MesModel.get('data');

                me.setViewPagelet({
                    list: data,
                    aid: id
                });
            }));
        }
    });
},{
    requires:['mxext/view', 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});