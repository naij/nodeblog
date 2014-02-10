KISSY.add("components/duoshuo/index", function(S, Brick) {
    var $ = S.all;

    var Duoshuo = Brick.extend({
        bindUI: function () {
            var el = this.get('el');
            var aid = this.get('aid');
            var url = 'http://' + location.host;
            var cnt= document.createElement('div');
            cnt.setAttribute('data-thread-key', aid);
            cnt.setAttribute('data-url', url);
            DUOSHUO.EmbedThread(cnt);
            el.append(cnt);
        }
    });

    return Duoshuo;
}, {
    requires: ["brix/core/brick"]
});