KISSY.add("app/views/pages/tags/tags", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;

            me.manage(MM.fetchAll([{
                name: "tag_list"
            }], function (errs, MesModel) {
                var data = MesModel.get('data');
                
                me.setViewPagelet({
                    list: data
                });
            }));
        }
    });
},{
    requires:['mxext/view', 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});