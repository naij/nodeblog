KISSY.add('components/textcount/index', function(S, Brick){
    var $ = S.all;

    function TextCount(options) {
        TextCount.superclass.constructor.apply(this, arguments);
    };

    TextCount.ATTRS = {
        /*
        input : {
            //输入框
            value:''
        },
        count:{
            //计数
            value: 0
        }
        */
    };

    TextCount.EVENTS = {

    };

    S.extend(TextCount, Brick,{
        initialize: function(){
            var self = this;
            var elStr = this.get('input');
            if(elStr){
                var input = $(this.get('input'));
                var el = this.get('el');
                el.html(this._countResult(input.val()));

                input.on('keyup', function(){
                    el.html(self._countResult(input.val()));
                });
            }
        },
        count: function(str){
            var _str = str.replace(/[\u4e00-\u9fa5]/g,'*');
            return _str.length;
        },
        _countResult: function(str){
            var len = this.count(str);
            var count = this.get('count');
            var pre = len;
            if(len > count){
                pre = '<em class="textcount-error">' + len + '</em>';
            }
            return pre + '/' + count;
        }
    });

    return TextCount;

},{requires:['brix/core/brick']});