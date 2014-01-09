KISSY.add("app/util/globaltip/globaltip", function(S, Vframe, VOM) {
    var GlobalTip = {};
    var $ = S.Node.all;

    S.mix(GlobalTip, {
        /**
         * 全局横幅提示
         * @param  {string} msg 传入的提示信息string，可为html结构
         * @param  {boolean} closable 是否可关闭，默认可关闭，当传入false，无关闭按钮，
         */
        showGlobalTip: function(msg, closable, delay, fn) {
            //延时600ms 防止切换页面tips冲突
            delay = S.type(delay) === 'number' ? delay : 600;

            var tip = $('<div class="ux-tip uxGlobalTip hide"> ' + msg + (closable === false ? '' : '  <i class="iconfont closeUxGlobalTip" >&#223;</i>') + '  </div>');

            function showTip() {
                if(GlobalTip.globalTip) {
                    GlobalTip.globalTip.remove();
                    clearTimeout(GlobalTip.globalTip.data('timeout'));
                }

                tip.data('timeout', setTimeout(function() {
                    tip.slideUp(0.25, function() {
                        tip.remove();
                    });
                }, 5 * 1000));
                GlobalTip.globalTip = tip;

                $('body').prepend(tip);
                tip.slideDown(0.25);

                $('.closeUxGlobalTip').on('click', function() {
                    var _this = $(this).parent();
                    _this.slideUp(0.25, function() {
                        _this.remove();
                    });

                    //关闭时执行回调
                    fn && fn();
                });
            }

            if(delay !== 0) {
                setTimeout(showTip, delay);
            } else {
                showTip();
            }
        },
        /**
         * 全局横幅提示隐藏
         */
        hideGlobalTip: function(){
            $('.uxGlobalTip').slideUp(0.25, function() {
                $('.uxGlobalTip').remove();
            });
        }
    });

    return GlobalTip;

}, {
    requires: ['magix/vframe', 'magix/vom']
});