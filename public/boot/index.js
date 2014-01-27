(function (S) {
    function returnJSON (s) {
        return (new Function('return ' + s))();
    }
    
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1];
    var bootConfig = returnJSON(script.getAttribute('boot-config'));

    // KISSY包配置和Magix启动
    KISSY.use('magix/magix', function (S, Magix) {
        S.config({
            packages: [
                {
                    name:'app',
                    path: bootConfig.tbcdn,
                    debug: bootConfig.debug
                }
            ]
        });

        Magix.start({
            appRoot: bootConfig.tbcdn,
            iniFile:'app/ini',
            extensions: ["app/extview"]
        });
    });

    window.UserInfo = {};
    
    // 登录判断
    (function (S) {
        S.io({
            url: '/sign/loginMsg',
            type: 'get',
            async: false,
            dataType: 'json',
            success: function (resp) {
                S.mix(window.UserInfo, resp.data);
            }
        });
    })(KISSY);
}(KISSY));