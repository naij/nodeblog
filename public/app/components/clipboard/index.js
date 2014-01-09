/*
 * flash代码复制
 * author : 陆议
 * date : 2013-08-05
 */

KISSY.add('components/clipboard/index',function(S, Brick, KSClipboard, Tip){
    var $ = S.all;

    function Clipboard() {
        Clipboard.superclass.constructor.apply(this, arguments);
    }

    S.extend(Clipboard, Brick, {
        initialize : function(){
            var self = this;
            var getCodeBox = S.Node('<div class="getcode-box"></div>');
            var clipboardTip = S.Node('<div class="clipboard-tip"></div>');
            var swfContainer = S.Node('<div class="swf-container"></div>');
            var el = self.get('el');

            getCodeBox.insertBefore(el);
            getCodeBox.append(clipboardTip);
            getCodeBox.append(swfContainer);
            getCodeBox.append(el);

            self.swfID = self._stamp(swfContainer);

            self.getCodeBox = getCodeBox;
            self.clipboardTip = clipboardTip;
            self.swfContainer = swfContainer;

            self.bind();
        },

        bind : function(){
            var self = this;
            var getCodeBox = self.getCodeBox;
            var clipboardTip = self.clipboardTip;
            var swfContainer = self.swfContainer;
            var swfID = self.swfID;
            var el = self.get('el');

            var codeAreaWidth = el.outerWidth();
            var codeAreaHeight = el.outerHeight();

            var clipboard  = new KSClipboard(swfID, {
                src:'http://a.tbcdn.cn/apps/med/kissy/1.2/ajbridge/clipboard/clipboard.swf',
                params:{
                    bgcolor:"#FFCCCC",
                    wmode:"transparent",
                    scale:"showall"
                },
                attrs: {
                    width:codeAreaWidth,
                    height:codeAreaHeight
                },
                hand:true,
                btn:true
            });

            clipboard.on("mouseDown",function(ev){
                var oValue = el.val();

                if(!oValue){
                    var clipboardtip = new Tip(clipboardTip,{msg:'您要复制的内容为空',border:true,background:true,icon:true,status:'attention',close:false});
                    return;
                }

                clipboard.setData(oValue);

                if(clipboard.getData() !== oValue){
                    window.prompt('您的浏览器不支持自动复制',oValue);
                }else{
                    el.attr('data-content',clipboard.getData());
                }

                el.select();
            });

            clipboard.on("mouseUp",function(ev){
                if(el.attr('data-content')){
                    var clipboardtip = new Tip(clipboardTip,{msg:'代码复制成功',border:false,background:false,icon:true,status:'ok',close:false});

                    self.fire('copy');
                }
            });

            // 窗口改变时同步flash的宽度
            $(window).on('resize',function(e){
                self._syncWidth();
            });
        },

        // 清除复制提示
        clearTip : function(){
            var clipboardTip = this.clipboardTip;
            clipboardTip.html('');
        },

        // 清除复制框内容
        clearCnt : function(){
            var el = this.get('el');
            el.val('');
        },

        _stamp: function(el) {
            if (el.attr('id') === undefined || el.attr('id') === '') {
                el.attr('id', 'swf_' + S.now());
            }
            return el.attr('id');
        },

        _syncWidth : function(){
            var swfContainer = this.swfContainer;
            var el = this.get('el');

            var codeAreaWidth = el.outerWidth();
            var codeAreaHeight = el.outerHeight();

            swfContainer.one('embed') && swfContainer.one('embed').css({'width':codeAreaWidth,'height':codeAreaHeight});
            swfContainer.one('object') && swfContainer.one('object').css({'width':codeAreaWidth,'height':codeAreaHeight});
        }
    });

    return Clipboard;

},{requires:["brix/core/brick", "components/clipboard_lib/index", "components/tip/1.0/index", "components/clipboard/index.css"]});
