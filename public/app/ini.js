/**
 * @fileOverview 配置文件
 * @author 行列
 * @version 1.0
 */
KISSY.add("app/ini", function (S) {
    var T = {
        routes: {
            'app/views/default': [
                '/pages/f2e/article_list',
                '/pages/f2e/article_detail',
                '/pages/discovery/article_list',
                '/pages/discovery/article_detail',
                '/pages/life/article_list',
                '/pages/life/article_detail',
                '/pages/about/about',
                '/pages/tags/tags',
                '/pages/archive/archive',
                '/manage/login',
                '/manage/index',
                '/manage/article/list',
                '/manage/article/add',
                '/manage/article/edit',
                '/manage/picture/list'
            ]
        }
    };
    return {
        //默认加载的view
        defaultView: 'app/views/default',
        //默认的pathname
        defaultPathname: '/pages/f2e/article_list',
        //404时显示的view，如果未启用，则404时显示defaultView
        notFoundView: 'app/views/404',
        routes: function (pathname) {
            if (!S.isEmptyObject(T.routes)) {
                var s;
                S.each(T.routes, function (item, k) {
                    if (S.inArray(pathname, item)) {
                        s = k;
                    }
                });
                if (s) return s;
                return this.notFoundView;
            }
            return this.defaultView;
        }
    }
}, {
    requires: ["node"]
});