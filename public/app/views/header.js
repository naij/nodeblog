KISSY.add("app/views/header", function (S, View, Node, MM) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            var loc = me.location;
            var path = loc.pathname;
            var pathMap = {
                '/pages/kiwiobject/article_detail': '/pages/kiwiobject/article_list',
                '/pages/discovery/article_detail': '/pages/discovery/article_list',
                '/pages/life/article_detail': '/pages/life/article_list'
            }

            function navSelected () {
                var siteNav = $('.site-nav li');
                siteNav.each(function (node) {
                    var nodeHref = node.one('a').attr('href');
                    nodeHref = nodeHref.substring(2);
                    if (!path || nodeHref == path || nodeHref == pathMap[path]) {
                        siteNav.removeClass('selected');
                        node.addClass('selected');
                    }
                });
            }

            me.setViewPagelet({
            }, function () {
                navSelected();
            }, function () {
                navSelected();
            });
        }
    });
}, {
    requires: ["mxext/view",'node', "app/models/modelmanager"]
});