/*
 * 全选组件
 * author : 陆议
 */
KISSY.add("components/checkall/index", function(S, Brick) {
    var $ = S.all;

    var Checkall = Brick.extend({
        bindUI : function(){
            var el = this.get('el');
            var triggers = el.all('.check-trigger');
            var items = el.all('.check-item');
            var itemLen = items.length;
            var initCheck = this.get('initCheck');
            var self = this;

            if(initCheck){
                items.each(function(node,index){
                    if (!node.attr('checked') && !node.attr('disabled')) {
                        return false;
                    }
                    if (index === itemLen - 1) {
                        self._setValue(triggers, true);
                    }
                });
            }
            else{
                triggers.attr('checked',false);
                items.attr('checked',false);
            }
        },
        _setValue : function(items, val){
            if (items.length > 1) {
                items.each(function(node){
                    node.attr('checked',val);
                });
            }
            else {
                items.attr('checked', val);
            }
        }
    },{
        ATTRS : {
            initCheck : {
                value : false
            }
        },
        EVENTS : {
            '.check-item': {
                click: function(e) {
                    var self = this;
                    var el = self.get('el');
                    var target = e.currentTarget;
                    var triggers = el.all('.check-trigger');
                    var items = el.all('.check-item');
                    var itemLen = items.length;
                    var nodevalue = {};

                    if (!target.checked) {
                        self._setValue(triggers, false);
                    }
                    else {
                        items.each(function(node,index){
                            if (!node.attr('checked') && !node.attr('disabled')) {
                                return false;
                            }
                            if (index === itemLen - 1) {
                                self._setValue(triggers, true);
                            }
                        });
                    }

                    nodevalue['node'] = $(target);
                    nodevalue['value'] = $(target).val();
                    self.fire(Checkall.FIRES.singleCheck,{data:nodevalue});
                }
            },
            '.check-trigger': {
                click: function(e){
                    var self = this;
                    var el = self.get('el');
                    var trigger = e.currentTarget;
                    var items = el.all('.check-item');
                    var isCheckAll = trigger.checked;
                    var data = [];

                    items.each(function(node) {
                        if (!node.attr('disabled')) {
                            self._setValue(node, isCheckAll);

                            //if(node.attr('checked')){
                                var nodevalue = {};
                                nodevalue['node'] = node;
                                nodevalue['value'] = node.val();
                                data.push(nodevalue);
                            //}
                        }
                    });

                    self.fire(Checkall.FIRES.checkAll,{data:data});
                }
            }
        }
    });
    
    Checkall.FIRES = {
        /**
         * @event checkAll
         * 全选
         */
        checkAll:'checkAll',
        /**
         * @event singleCheck
         * 单选
         */
        singleCheck:'singleCheck'
    }
    
    Checkall.METHODS = {
        getData : function(){
            var self = this;
            var el = self.get('el');
            var items = el.all('.check-item');
            var data = [];

            items.each(function(node) {
                if (!node.attr('disabled')) {
                    if(node.attr('checked')){
                        data.push(node.val());
                    }
                }
            });

            return data;
        }
    }

    S.augment(Checkall, Checkall.METHODS);

    return Checkall;
}, {
    requires: ["brix/core/brick"]
});