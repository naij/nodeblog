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
                '/pages/f2e/article_detail': '/pages/f2e/article_list',
                '/pages/discovery/article_detail': '/pages/discovery/article_list',
                '/pages/life/article_detail': '/pages/life/article_list'
            }

            me.setViewPagelet({
                
            }, function () {
                navSelected();
            }, function () {
                navSelected();
            });

            function navSelected () {
                var siteNav = $('.site-nav li');
                siteNav.each(function (node) {
                    var nodeHref = node.one('a').attr('href');
                    nodeHref = nodeHref.substring(2);
                    siteNav.removeClass('selected');

                    if (!path || nodeHref == path || nodeHref == pathMap[path]) {
                        node.addClass('selected');

                        return false;
                    }
                });
            }
        }
    });
}, {
    requires: ["mxext/view",'node', "app/models/modelmanager"]
});