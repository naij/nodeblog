KISSY.add("app/views/pages/kiwiobject/article_list", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;

            me.manage(MM.fetchAll([{
                name: "kiwiobject_article_list",
                urlParams: {
                	type: 'kiwiobject'
                }
            }], function (errs, MesModel) {
                var data = MesModel.get('data');

                me.setViewPagelet({
                    list: data
                }, function () {
                    me.components();
                });
            }));
        },
        components: function () {
            $('pre').addClass('prettyprint linenums');
            prettyPrint();
        }
    });
},{
    requires:['mxext/view', 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});