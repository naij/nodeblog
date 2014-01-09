/*
 * kissy校验组件扩展
 * author : 陆议
 * date : 2013-03-29
 */
KISSY.add("components/validation/index", function(S, Brick, KSValid) {
    var $ = S.all;
    var symbol = {
        error: 0,
        hint: 2,
        ignore: 3,
        ok: 1
    };

    function custom() {
        return {
            init: function() {
                var self = this,
                    tg = $(self.target),
                    panel;

                //伪属性配置的id
                if (tg.attr("data-messagebox")) {
                    panel = $(tg.attr("data-messagebox"));
                }
                //配置的id
                else if (self.messagebox) {
                    panel = $(self.messagebox);
                }
                //从模版创建
                else {
                    panel = S.Node(self.template).appendTo(tg.parent());
                }

                if (panel) {
                    self.panel = panel;
                    self.estate = panel.one(".estate");
                    self.label = panel.one(".label");
                    if (!self.estate || !self.label) return;
                    panel.hide();
                } else {
                    return;
                }
            },

            showMessage: function(result, msg) {
                var self = this,
                    tg = $(self.el),
                    panel = self.panel,
                    estate = self.estate,
                    label = self.label,
                    time = S.isNumber(self.anim) ? self.anim : 0.25;

                if (self.invalidClass) {
                    if (result == symbol.ignore && result == symbol.ok) {
                        tg.removeClass(self.invalidClass);
                    } else {
                        tg.addClass(self.invalidClass);
                    }
                }

                var display = panel.css("display") == "none" ? false : true;

                var isInputText = (self.el.tagName === 'INPUT' && self.el.type === 'text' || self.el.tagName === 'TEXTAREA' || self.el.type === 'password'); //增加是不是input:text判断

                if (result === symbol.ignore || result === symbol.ok) {
                    display && panel.slideUp(time);
                    isInputText && S.one(self.el).removeClass('input-text-error').addClass('input-text');
                } else {
                    estate.removeClass("ok tip error");
                    if (result == symbol.error) {
                        estate.addClass("error");
                        label.html(msg);
                        display || panel.slideDown(time);
                        isInputText && S.one(self.el).removeClass('input-text').addClass('input-text-error');
                    } else if (result === symbol.hint) {
                        estate.addClass("tip");
                        label.html(msg);
                        display || panel.slideDown(time);
                        isInputText && S.one(self.el).removeClass('input-text-error').addClass('input-text');
                    }
                }
            },

            style: {
                under: {
                    template: '<div class="ux-valid"><p class="estate"><span class="label"></span></p></div>',
                    event: 'blur'
                }
            }
        }
    }

    // 扩展提示类
    KSValid.Warn.extend("custom",custom);

    function Validation(){
        Validation.superclass.constructor.apply(this, arguments);
    };

    S.extend(Validation, Brick, {
        initialize : function(){
            var self = this;
            var el = self.get('el')[0];

            // kissy校验组件
            self.valid = new KSValid(el,{
                event: 'blur',
                style : 'under',
                warn: 'custom'
            });
        },

        destructor:function(){
            var self = this;
            if(self.valid){
                self.valid = null;
            }
        }
    });

    return Validation;
}, {
    requires: ['brix/core/brick', 'gallery/validation/1.0/index']
});