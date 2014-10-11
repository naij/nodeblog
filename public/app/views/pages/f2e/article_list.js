KISSY.add("app/views/pages/f2e/article_list", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;

            me.manage(MM.fetchAll([{
                name: "article_list",
                urlParams: {
                	type: 'f2e'
                }
            }], function (errs, MesModel) {
                var data = MesModel.get('data');

                for (var i = 0; i < data.length; i++) {
                    data[i].content = data[i].content.replace(/<[^>]+>/g, '');
                    data[i].content = data[i].content.substring(0, 300) + ' ... ...'
                }

                me.setViewPagelet({
                    list: data
                });
            }));
        }
    });
},{
    requires:['mxext/view', 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});