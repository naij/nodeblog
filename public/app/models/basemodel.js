KISSY.add("app/models/basemodel", function (S, MxModel, IO, Util) {
    var SyncCounter = 0;
    /**
     * 流控对象
     * @type {Object}
     * 设计思路：
     * 整体项目中的数据请求出口统一在app/common/models/model中的sync方法，所以在该方法内对返回的数据进行检查是否需要流控介入
     *     假设某个时间段时有6个ajax请求
     *     前3个几乎同时发起，而此时需要登录
     *     则3个中最先返回的请求介入流控，另外2个
     *         1.如果流控未结束，数据返回，则追加到流控等待列表中
     *         2.如果流控已结束，数据返回
     *             1.如果在有效时间内，则直接再发一次请求
     *             2.如果不在有效时间内，则流控再次介入
     *     后续3个请求：
     *         1.如果流控未结束则追加到等待列表中
     *         2.如果流控结束则正常请求
     */
    var ProcessController = {
        /**
         * 状态码映射
         * @type {Object}
         */
        CodeMap: {
            601: { //需要重新登录
                method: 'processLogin',
                validTime: 2 * 60 * 1000
            },
            2: { //验证码
                method: 'processVCode',
                validTime: 1 * 60 * 1000
            }
        },
        /**
         * 流控是否介入
         * @return {Boolean}
         */
        isIntervene: function () {
            return this.$ii;
        },
        /**
         * 处理登录
         * @param  {Integer} validTime       有效时间
         * @param  {Boolean} ignoreValidTime 是否忽略有效时间
         */
        processLogin: function (validTime, ignoreValidTime) {
            /*
                弹出登录浮层？
                当登录成功后processCode处理下一个
             */
            var self = this;
            var lastTime = self.$lastLTime;
            if (!ignoreValidTime && (!lastTime || S.now() - lastTime < validTime)) {
                self.processCode();
            } else {
                //...
                self.$lastLTime = S.now();
                self.processCode();
            }
        },
        /**
         * 处理验证码
         * @param  {Integer} validTime       有效时间
         * @param  {Boolean} ignoreValidTime 是否忽略有效时间
         */
        processVCode: function (validTime, ignoreValidTime) {
            /*
                弹出层处理验证码？
                当验证码验证成功后调用processCode处理下一个
             */
            var self = this;
            var lastTime = self.$lastVCTime;
            if (!ignoreValidTime && (!lastTime || S.now() - lastTime < validTime)) {
                self.processCode();
            } else {
                //...
                self.$lastVCTime = S.now();
                self.processCode();
            }
        },
        getJSONPToken: function (callback) {

        },
        /**
         * 处理流控code
         */
        processCode: function () {
            var self = this;
            var code = self.$code;
            if (code) {
                var c = code.list.shift();
                if (c) {
                    delete code.hash[c.code];
                    var m = self.CodeMap[c.code];
                    if (m) {
                        self[m.method](m.validTime, c.iVT);
                    } else {
                        throw new Error('unrecognize error code:' + c);
                    }
                } else {
                    self.runWaitModels();
                }
            } else {
                self.runWaitModels();
            }
        },
        /**
         * 流控开始
         * @param  {Integer} code 流控码
         * @param {Boolean} ignoreValidTime 是否忽略有效时间
         */
        start: function (code, ignoreValidTime) {
            var self = this;
            if (!self.$code) {
                self.$code = {
                    list: [],
                    hash: {}
                };
                if (!Magix.has(self.$code.hash, code)) {
                    self.$code.list.push({
                        code: code,
                        iVT: ignoreValidTime
                    });
                    self.$code.hash[code] = true;
                }
            }
            if (!self.$ii) {
                self.$ii = true;
                self.processCode();
            }
        },
        /**
         * 添加等待的model对象
         * @param {Model} model   model对象
         * @param {Objet} options model发送请求时的选项对象
         */
        addWaitModel: function (model, options) {
            var self = this;
            if (!self.$wmList) {
                self.$wmList = [];
            }
            self.$wmList.push({
                model: model,
                options: options
            });
        },
        /**
         * 运行等待中的model对象
         */
        runWaitModels: function () {
            var self = this;
            var list = self.$wmList;
            if (self.$ii) {
                delete self.$ii;
                if (list) {
                    for (var i = 0, one; i < list.length; i++) {
                        one = list[i];
                        one.model.sync(one.options);
                    }
                }
                self.$wmList = [];
            }
        }
    };


    return MxModel.extend({
        parse: function (resp) {
            return resp;
        },
        sync: function (callback) {
            var model = this;

            //如果流控已经介入，则需要同步的model交给流控去处理
            SyncCounter++;
            if (SyncCounter == 1) {
                //Bar.show('正在处理...');
            }
            
            if (ProcessController.isIntervene()) {
                ProcessController.addWaitModel(model, options);
                return;
            }
            
            var data;
            var url = model.get('url');
            var options = model.get('options') || {};
            var type = options.type || 'GET';
            var jsonp = options.jsonp;
            var async = options.async;
            var dataType = options.dataType || 'json';
            var noVerify = options.noVerify;

            if (type.toUpperCase() === 'GET') {
                model.setUrlParams('t', S.now());
                data = model.getUrlParams();
            } else {
                data = model.getPostParams();
            }

            var params = {
                url: url,
                type: type,
                data: data,
                dataType: dataType,
                async: async === false ? false : true,
                success: function (resp, msg, xhr) {
                    if (dataType == 'json') {
                        // 后台页面会有这个判断
                        if(resp.data.hasOwnProperty('hasLogin') && resp.data.hasLogin === false) {
                            window.location.href = '/#!/manage/login';
                            return;
                        }

                        // 在modelmanager里面配置
                        // 用来直接返回结果
                        if(noVerify){
                            callback(null, resp);
                            return;
                        }

                        if (!resp.info.ok) {
                            Util.showGlobalTip(resp.info.message);
                            callback(e.message || 'request error');
                        } else {
                            callback(null, {data: resp.data});
                        }
                    } else {
                        try {
                            callback(null, {data: resp.data});
                        } catch (e) { 
                            //方法执行出错
                            Util.showGlobalTip(e.message);
                            callback( e.message || 'request error');
                        }
                    }
                },
                error: function (x, msg, xhr) {
                    //没权限跳回登录页
                    callback( msg || 'request error');
                },
                complete: function () {
                    SyncCounter--;
                    if (SyncCounter === 0) {
                        //Bar.hide()
                    }
                }
            };

            if (jsonp) {
                params.jsonp = (jsonp === true ? '_c' : jsonp);
            }

            return KISSY.io(params);
        }
    });
}, {
    requires: ["mxext/model", "ajax", "app/util/util"]
});