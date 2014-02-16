KISSY.add("app/views/manage/index", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            
            me.setViewPagelet();
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});