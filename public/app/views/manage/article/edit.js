KISSY.add("app/views/manage/article/edit", function (S, View, MM, VOM, Router, Node, Util) {
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
                name: "manage_article_detail",
                urlParams: {
                    id: id
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
            var editor = new Editor();
            editor.render();

            this.manage('editor', editor);
        },
        'submit<click>': function (e) {
            e.halt();
            var me = this;
            var editor = me.getManaged('editor');
            editor.codemirror.save();
            var formData = S.unparam( S.IO.serialize('#editForm'));

            me.manage(MM.fetchAll([{
                name: "article_edit",
                postParams: formData
            }], function (errs, MesModel) {
                me.navigate('/manage/article/list');
            }));
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});