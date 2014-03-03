KISSY.add("app/views/pages/tags/tags", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            var loc = me.location;
            var params = loc.params;
            var tag = params.tag;

            if (tag) {
                me.manage(MM.fetchAll([{
                    name: "article_list_by_tag",
                    urlParams: {
                        tag: tag
                    }
                }], function (errs, MesModel) {
                    var data = MesModel.get('data');
                    
                    for (var i = 0; i < data.length; i++) {
                        data[i].content = data[i].content.replace(/<[^>]+>/g, '');
                        data[i].content = data[i].content.substring(0, 300) + ' ... ...';
                    }

                    me.setViewPagelet({
                        tag: tag,
                        list: data
                    });
                }));
            } else {
                me.manage(MM.fetchAll([{
                    name: "tag_list"
                }], function (errs, MesModel) {
                    var data = MesModel.get('data');
                    
                    me.setViewPagelet({
                        tag: '',
                        list: data
                    });
                }));
            }
        }
    });
},{
    requires:['mxext/view', 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});