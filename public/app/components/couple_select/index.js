/*
 * 多选框
 * author : 陆议
 */ 

KISSY.add('components/couple_select/index',function(S, Brick, Node){
    var $ = Node.all;

    var Coupleselect = Brick.extend({
        bindUI : function(){
            var el = this.get('el');
            this.source = el.one('.source');
            this.target = el.one('.target');
        }
    },{
        ATTRS : {
            sourceVal : {
                value : []
            }
        },
        EVENTS : {
            '.add': {
                click: function(e) {
                    e.preventDefault();
                    var self = this;
                    var el = self.get('el');
                    var source = self.source;
                    var target = self.target;
                    var sourceVal = self.get('sourceVal');
                    var liTmpl = '<li val="{val}"><a href="#" class="blue-link del">删除</a><span class="title">{text}</span></li>';
                    var addNode = $(e.currentTarget);
                    var val = addNode.parent().attr('val');
                    var text = addNode.parent().attr('text');

                    if(S.inArray(val, sourceVal)){return;}

                    sourceVal.push(val);
                    addNode.parent().addClass('selected');
                        
                    var liList = S.Node(S.substitute(liTmpl, {val: val, text: text}));
                    target.one('ul').append(liList);
                    
                    self.fire(Coupleselect.FIRES.add, {data: sourceVal});
                }
            },
            '.del': {
                click: function(e){
                    e.preventDefault();
                    var self = this;
                    var source = self.source;
                    var sourceVal = self.get('sourceVal');
                    var delNode = $(e.currentTarget);
                    var val = delNode.parent().attr('val');
                    
                    if(S.inArray(val, sourceVal)){
                        var index = S.indexOf(val, sourceVal);
                        sourceVal.splice(index, 1);

                        delNode.parent().remove();

                        source.all('li').each(function(node,i){
                            if(node.attr('val') == val){
                                node.removeClass('selected');
                            }
                        });

                        self.fire(Coupleselect.FIRES.del, {data: sourceVal});
                    }
                }
            }
        }
    });

    Coupleselect.FIRES = {
        /**
         * @event add
         * 添加
         */
        add:'add',
        /**
         * @event del
         * 删除
         */
        del:'del'
    }

    return Coupleselect;

},{requires:["brix/core/brick", 'node']});
