KISSY.add("app/extview", function(S, MV, Base) {

    var ViewModel = function(config) {
        ViewModel.superclass.constructor.call(this, config);
        this.addAttrs(config);
    };

    S.extend(ViewModel, Base, {
        /**
         * @lends ViewModel#
         */
        /**
         * 注册datakey
         * @param  {Array} dataKey datakey数组
         */
        registerDataKey: function(dataKey) {
            var o = {};
            for(var i = 0; i < dataKey.length; i++) {
                o[dataKey[i]] = {};
            }
            this.addAttrs(o);
        },
        /**
         * 注册模板帮助方法
         * @param {Object} obj 包含方法的对象
         **/
        registerRenderers: function(obj) {
            var me = this;
            var baseSet = me.constructor.superclass.set;
            for(var group in obj) {
                var groups = obj[group];
                for(var n in groups) {
                    baseSet.call(me, group + '_' + n, (function(f) {
                        return function() {
                            return f.call(this, me._view);
                        }
                    }(groups[n])), {
                        slient: true
                    })
                }
            }
        },
        /**
         * 你懂的
         * @return {Object}
         */
        toJSON: function() {
            return this.getAttrVals();
        }
    });

    var Pagelet;
    var WIN = window;
    S.mix(MV.prototype, {
        /**
         * 设置view的pagelet，与brix深度整合
         * @param {Object} data  数据对象
         * @param {Function} ready pagelet就绪后的回调
         * @example
         * //template
         *
         * <div bx-tmpl="x" bx-datakey="x">
         *     {{x}}
         * </div>
         *
         * <div bx-tmpl="xy" bx-datakey="x,y">
         *     {{y}}--{{x}}
         * </div>
         *
         * <div bx-name="xx" bx-config="{}">
         *
         * </div>
         * // view code
         *
         *
         * render:function(){
         *     //...
         *     this.setViewPagelet({
         *         param1:'x',
         *         param2:'y'
         *     },function(pagelet){
         *         var brix=pagelet.getBrick('xx');
         *         //brix....
         *     },{
         *         xx:{
         *             data:{},
         *             attrName:'haha'
         *         }
         *     })
         * }
         */
        setViewPagelet: function(data, ready, reready, config) {
            var me = this;
            var sign = me.sign;
            var getPagelet = function(fn) {
                    if(Pagelet) {
                        fn(Pagelet);
                    } else {
                        S.use('brix/core/pagelet', function(S, P) {
                            fn(Pagelet = P);
                        });
                    }
                };
            var pagelet = me.getManaged('pagelet');
            if(pagelet) {
                pagelet.ready(function() {
                    pagelet.setChunkData(data);
                    if(reready){
                        reready.call(me, pagelet);
                    }
                });
            } else {
                getPagelet(function(Pglt) {
                    if(sign == me.sign) {
                        S.one('#' + me.id).html('');
                        // 当前view即将开始进行html的更新
                        me.beginUpdate();
                        // 通过pagelet渲染页面
                        pagelet = new Pglt({
                            container: '#' + me.id,
                            tmpl: me.wrapMxEvent(me.template),
                            data: me.wrapMustachData(data),
                            destroyAction: 'empty',
                            config: config || {}
                        });
                        // 当前view结束html的更新
                        me.endUpdate();

                        me.manage('pagelet', pagelet);
                        if(ready) {
                            pagelet.on('beforeRefreshTmpl', function(e) {
                                me.owner.unmountZoneVframes(e.node[0]);
                            });
                            pagelet.on('afterRefreshTmpl', function(e) {
                                me.owner.mountZoneVframes(e.node[0],null,true);
                            });
                            pagelet.ready(function() {
                                if(sign == me.sign) {
                                    ready.call(me, pagelet);
                                }
                            });
                        }
                    }
                });
            }
        },
        wrapMustachData: function(data) {
            var self = this,
                rr = this.renderer,
                mcName, wrapperName;
            if(rr) {
                for(mcName in rr) {
                    for(wrapperName in rr[mcName]) {
                        (function() {
                            var mn = mcName,
                                wn = wrapperName;
                            var fn = rr[mn][wn];
                            data[mn + "_" + wn] = function() {
                                return fn.call(this, self, mn);
                            };
                        })();
                    }
                }
            }
            return data;
        },
        mxViewCtor: function() {
            var me = this;
            me.vm = new ViewModel();
            me.vm._view = me;
        }
    });
}, {
    requires: ["mxext/view", "base"]
});