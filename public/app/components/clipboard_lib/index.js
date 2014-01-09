/*
Copyright 2011, KISSY UI Library v1.20dev
MIT Licensed
build time: ${build.time}
*/
/**
 * @module   Flash 全局静态类
 * @author   kingfo<oicuicu@gmail.com>
 */
KISSY.add('components/clipboard_lib/base', function(S) {

    return {
        /**
         * flash 实例 map { '#id': elem, ... }
         * @static
         */
        swfs: { },
        length: 0,
        version:"1.3"
    };

});
/**
 * @module   Flash UA 探测
 * @author   kingfo<oicuicu@gmail.com>
 */
KISSY.add('components/clipboard_lib/ua', function(S, UA) {

    var fpv, fpvF, firstRun = true;

    /**
     * 获取 Flash 版本号
     * 返回数据 [M, S, R] 若未安装，则返回 undefined
     */
    function getFlashVersion() {
        var ver, SF = 'ShockwaveFlash';

        // for NPAPI see: http://en.wikipedia.org/wiki/NPAPI
        if (navigator.plugins && navigator.mimeTypes.length) {
            ver = (navigator.plugins['Shockwave Flash'] || 0).description;
        }
        // for ActiveX see: http://en.wikipedia.org/wiki/ActiveX
        else if (window.ActiveXObject) {
            try {
                ver = new ActiveXObject(SF + '.' + SF)['GetVariable']('$version');
            } catch(ex) {
                //S.log('getFlashVersion failed via ActiveXObject');
                // nothing to do, just return undefined
            }
        }

        // 插件没安装或有问题时，ver 为 undefined
        if (!ver) return undefined;

        // 插件安装正常时，ver 为 "Shockwave Flash 10.1 r53" or "WIN 10,1,53,64"
        return arrify(ver);
    }

    /**
     * arrify("10.1.r53") => ["10", "1", "53"]
     */
    function arrify(ver) {
        return ver.match(/(\d)+/g).splice(0, 3);
    }

    /**
     * 格式：主版本号Major.次版本号Minor(小数点后3位，占3位)修正版本号Revision(小数点后第4至第8位，占5位)
     * ver 参数不符合预期时，返回 0
     * numerify("10.1 r53") => 10.00100053
     * numerify(["10", "1", "53"]) => 10.00100053
     * numerify(12.2) => 12.2
     */
    function numerify(ver) {
        var arr = S['isString'](ver) ? arrify(ver) : ver, ret = ver;
        if (S.isArray(arr)) {
            ret = parseFloat(arr[0] + '.' + pad(arr[1], 3) + pad(arr[2], 5));
        }
        return ret || 0;
    }

    /**
     * pad(12, 5) => "00012"
     * ref: http://lifesinger.org/blog/2009/08/the-harm-of-tricky-code/
     */
    function pad(num, n) {
        var len = (num + '').length;
        while (len++ < n) {
            num = '0' + num;
        }
        return num;
    }

    /**
     * 返回数据 [M, S, R] 若未安装，则返回 undefined
     * fpv 全称是 flash player version
     */
    UA.fpv = function(force) {
        // 考虑 new ActiveX 和 try catch 的 性能损耗，延迟初始化到第一次调用时
        if (force || firstRun) {
            firstRun = false;
            fpv = getFlashVersion();
            fpvF = numerify(fpv);
        }
        return fpv;
    };

    /**
     * Checks fpv is greater than or equal the specific version.
     * 普通的 flash 版本检测推荐使用该方法
     * @param ver eg. "10.1.53"
     * <code>
     *    if(S.UA.fpvGEQ('9.9.2')) { ... }
     * </code>
     */
    UA.fpvGEQ = function(ver, force) {
        if (firstRun) UA.fpv(force);
        return !!fpvF && (fpvF >= numerify(ver));
    };

}, { requires:["ua"] });

/**
 * NOTES:
 *
 -  ActiveXObject JS 小记
 -    newObj = new ActiveXObject(ProgID:String[, location:String])
 -    newObj      必需    用于部署 ActiveXObject  的变量
 -    ProgID      必选    形式为 "serverName.typeName" 的字符串
 -    serverName  必需    提供该对象的应用程序的名称
 -    typeName    必需    创建对象的类型或者类
 -    location    可选    创建该对象的网络服务器的名称

 -  Google Chrome 比较特别：
 -    即使对方未安装 flashplay 插件 也含最新的 Flashplayer
 -    ref: http://googlechromereleases.blogspot.com/2010/03/dev-channel-update_30.html
 *
 */
/**
 * @module   将 swf 嵌入到页面中
 * @author   kingfo<oicuicu@gmail.com>, 射雕<lifesinger@gmail.com>
 */
KISSY.add('components/clipboard_lib/embed', function(S,UA,DOM,JSON,Flash) {

    var
        SWF_SUCCESS = 1,
        FP_LOW = 0,
        FP_UNINSTALL = -1,
        //TARGET_NOT_FOUND = -2,  // 指定 ID 的对象未找到
        SWF_SRC_UNDEFINED = -3, // swf 的地址未指定

        RE_FLASH_TAGS = /^(?:object|embed)/i,
        CID = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
        TYPE = 'application/x-shockwave-flash',
        FLASHVARS = 'flashvars', EMPTY = '', SPACE =' ',
        PREFIX = 'ks-flash-', ID_PRE = '#', EQUAL = '=', DQUOTA ='"',
        //SQUOTA  = "'",
        LT ='<', GT='>',
        CONTAINER_PRE = 'ks-flash-container-',
        OBJECT_TAG = 'object',
        EMBED_TAG = 'embed',
        OP = Object.prototype,
        encode = encodeURIComponent,


        // flash player 的参数范围
        PARAMS = {
            ////////////////////////// 高频率使用的参数
            //flashvars: EMPTY,     // swf 传入的第三方数据。支持复杂的 Object / XML 数据 / JSON 字符串
            wmode: EMPTY,
            allowscriptaccess: EMPTY,
            allownetworking: EMPTY,
            allowfullscreen: EMPTY,
            ///////////////////////// 显示 控制 删除 
            play: 'false',
            loop: EMPTY,
            menu: EMPTY,
            quality: EMPTY,
            scale: EMPTY,
            salign: EMPTY,
            bgcolor: EMPTY,
            devicefont: EMPTY,
            ///////////////////////// 其他控制参数
            base: EMPTY,
            swliveconnect: EMPTY,
            seamlesstabbing: EMPTY
        },



        defaultConifg = {
            //src: '',       // swf 路径
            params: { },     // Flash Player 的配置参数
            attrs: {         // swf 对应 DOM 元素的属性
                width: 215,  // 最小控制面板宽度,小于此数字将无法支持在线快速安装
                height: 138  // 最小控制面板高度,小于此数字将无法支持在线快速安装
            },
            //xi: '',      // 快速安装地址。全称 express install  // ? 默认路径
            version: 9       // 要求的 Flash Player 最低版本
        };


    S.mix(Flash, {

        fpv: UA.fpv,

        fpvGEQ: UA.fpvGEQ,


        /**
         * 添加 SWF 对象
         * @param target {String|HTMLElement}  #id or element
         */
        add: function(target, config, callback) {
            var xi, id , isDynamic, nodeName;
            // 标准化配置信息
            config = Flash._normalize(config);

            // 合并配置信息
            config = S.merge(defaultConifg, config);
            config.attrs = S.merge(defaultConifg.attrs, config.attrs);

            id = target.replace(ID_PRE, '');

            // 1. target 元素未找到 则自行创建一个容器
            if (!(target = DOM.get(target))) {
                target = DOM.create('<div id='+ id +'>');
                document.body.appendChild(target);
            }

            nodeName = target.nodeName.toLowerCase();

            // 动态标记   供后续扩展使用
            // 在 callback(config) 的  config.dynamic 应用
            isDynamic = !RE_FLASH_TAGS.test(nodeName);

            // 保存 容器id, 没有则自动生成 
            if (!target.id) target.id = S.guid(CONTAINER_PRE);
                id = target.id;

            // 保存 Flash id , 没有则自动生成
            if (!config.id) config.id = S.guid(PREFIX);
                config.attrs.id = config.id;

            // 2. flash 插件没有安装
            if (!UA.fpv()) {
                Flash._callback(callback, FP_UNINSTALL, id, target,isDynamic);
                return;
            }

            // 3. 已安装，但当前客户端版本低于指定版本时
            if (!UA.fpvGEQ(config.version)) {
                Flash._callback(callback, FP_LOW, id, target,isDynamic);

                // 有 xi 时，将 src 替换为快速安装
                if (!((xi = config.xi) && S['isString'](xi))) return;
                config.src = xi;
            }



            // 对已有 HTML 结构的 SWF 进行注册使用
            if(!isDynamic){
                // bugfix: 静态双 object 获取问题。双 Object 外层有 id 但内部才有效。  longzang 2010/8/9
                if (nodeName == OBJECT_TAG) {
                    // bugfix: 静态双 object 在 chrome 7以下存在问题，如使用 chrome 内胆的 sogou。2010/12/23
                    if (UA['gecko'] || UA['opera'] || UA['chrome'] > 7) {
                        target = DOM.query('object', target)[0] || target;
                    }
                }

                config.attrs.id = id;

                Flash._register(target, config, callback,isDynamic);
                return;
            }



            // src 未指定
            if (!config.src) {
                Flash._callback(callback, SWF_SRC_UNDEFINED, id, target,isDynamic);
                return;
            }

            // 替换 target 为 SWF 嵌入对象
            Flash._embed(target, config, callback);

        },

        /**
         * 获得已注册到 S.Flash 的 SWF
         * 注意，请不要混淆 DOM.get() 和 Flash.get()
         * 只有成功执行过 S.Flash.add() 的 SWF 才可以被获取
         * @return {HTMLElement}  返回 SWF 的 HTML 元素(object/embed). 未注册时，返回 undefined
         */
        get: function(id) {
            return Flash.swfs[id];
        },

        /**
         * 移除已注册到 S.Flash 的 SWF 和 DOM 中对应的 HTML 元素
         */
        remove: function(id) {
            var swf = Flash.get(id);
            if (swf) {
                DOM.remove(swf);
                delete Flash.swfs[swf.id];
                Flash.length -= 1;
            }
        },

        /**
         * 检测是否存在已注册的 swf
         * 只有成功执行过 S.Flash.add() 的 SWF 才可以被获取到
         * @return {Boolean}
         */
        contains: function(target) {
            var swfs = Flash.swfs,
                id, ret = false;

            if (S['isString'](target)) {
                ret = (target in swfs);
            } else {
                for (id in swfs)
                    if (swfs[id] === target) {
                        ret = true;
                        break;
                    }
            }
            return ret;
        },

        _register: function(swf, config, callback,isDynamic) {
            var id = config.attrs.id;

            Flash._addSWF(id, swf);
            Flash._callback(callback, SWF_SUCCESS, id, swf,isDynamic);
        },

        _embed: function (target, config, callback) {

            target.innerHTML = Flash._stringSWF(config);

            // bugfix: 重新获取对象,否则还是老对象. 如 入口为 div 如果不重新获取则仍然是 div  longzang | 2010/8/9
            target = DOM.get(ID_PRE + config.id);

            Flash._register(target, config, callback,true);
        },

        _callback: function(callback, type, id, swf,isDynamic) {
            if (type && S.isFunction(callback)) {
                callback({
                    status: type,
                    id: id,
                    swf: swf,
                    dynamic:!!isDynamic
                });
            }
        },

        _addSWF: function(id, swf) {
            if (id && swf) {
                Flash.swfs[id] = swf;
                Flash.length += 1;
            }
        },
        _stringSWF:function (config){
            var res,
            attr = EMPTY,
            par = EMPTY,
            src = config.src,
            attrs = config.attrs,
            params = config.params,
            //id,
            k,
            //v,
            tag;

            if(UA['ie']){
                // 创建 object

                tag = OBJECT_TAG;

                // 普通属性
                for (k in attrs){
                    if(attrs[k] != OP[k]){ // 过滤原型属性
                        if(k != "classid" && k != "data") attr += stringAttr(k,attrs[k]);
                    }
                }

                // 特殊属性
                attr += stringAttr('classid',CID);

                // 普通参数
                for (k in params){
                    if(k in PARAMS) par += stringParam(k,params[k]);
                }

                par += stringParam('movie',src);

                // 特殊参数
                if(params[FLASHVARS]) par += stringParam(FLASHVARS,Flash.toFlashVars(params[FLASHVARS]));

                res = LT + tag + attr + GT + par + LT + '/' + tag + GT;
            }else{
                // 创建 embed
                tag = EMBED_TAG;

                // 源
                attr += stringAttr('src',src);

                // 普通属性
                for (k in attrs){
                    if(attrs[k] != OP[k]){
                        if(k != "classid" && k != "data") attr += stringAttr(k,attrs[k]);
                    }
                }

                // 特殊属性
                attr += stringAttr('type',TYPE);

                // 参数属性
                for (k in params){
                    if(k in PARAMS) par += stringAttr(k,params[k]);
                }

                // 特殊参数
                if(params[FLASHVARS]) par += stringAttr(FLASHVARS,Flash.toFlashVars(params[FLASHVARS]));

                res = LT + tag + attr + par  + '/'  + GT;
            }
            return res
        },

        /**
         * 将对象的 key 全部转为小写
         * 一般用于配置选项 key 的标准化
         */
        _normalize: function(obj) {
            var key, val, prop, ret = obj || { };

            if (S.isPlainObject(obj)) {
                ret = {};

                for (prop in obj) {
                    key = prop.toLowerCase();
                    val = obj[prop];

                    // 忽略自定义传参内容标准化
                    if (key !== FLASHVARS) val = Flash._normalize(val);

                    ret[key] = val;
                }
            }
            return ret;
        },

        /**
         * 将普通对象转换为 flashvars
         * eg: {a: 1, b: { x: 2, z: 's=1&c=2' }} => a=1&b={"x":2,"z":"s%3D1%26c%3D2"}
         */
        toFlashVars: function(obj) {
            if (!S.isPlainObject(obj)) return EMPTY; // 仅支持 PlainOject
            var prop, data, arr = [],ret;

            for (prop in obj) {
                data = obj[prop];

                // 字符串，用双引号括起来     [bug]不需要 longzang
                if (S['isString'](data)) {
                   //data = '"' + encode(data) + '"';
                    data = encode(data);   //bugfix: 有些值事实上不需要双引号   longzang 2010/8/4
                }
                // 其它值，用 stringify 转换后，再转义掉字符串值
                else {
                    data = (JSON.stringify(data));
                    if (!data) continue; // 忽略掉 undefined, fn 等值

                    data = data.replace(/:"([^"]+)/g, function(m, val) {
                        return ':"' + encode(val);
                    });
                }

                arr.push(prop + '=' + data);
            }
            ret = arr.join('&');
            return ret.replace(/"/g,"'"); //bugfix: 将 " 替换为 ',以免取值产生问题。  但注意自转换为JSON时，需要进行还原处理。
        }
    });

    function stringAttr(key,value){
        return SPACE + key + EQUAL + DQUOTA + value + DQUOTA;
    }

    function stringParam(key,value){
        return '<param name="' + key + '" value="' + value + '" />';
    }

    return Flash;

}, { requires:["ua", "dom", "json", "./base", "./ua"] });

KISSY.add("components/clipboard_lib/flash", function(S, F) {
    return F;
}, {requires:["./embed"]});

KISSY.add('components/clipboard_lib/ajbridge', function(S, Flash) {

    var ID_PRE = '#',
        VERSION = '1.0.14',
        PREFIX = 'ks-ajb-',
        LAYOUT = 100,
        EVENT_HANDLER = 'KISSY.AJBridge.eventHandler'; // Flash 事件抛出接受通道

    /**
     * @constructor
     * @param {String} id       注册应用容器 id
     * @param {Object} config   基本配置同 S.Flash 的 config
     * @param {Boolean} manual  手动进行 init
     */
    function AJBridge(id, config, manual) {
        id = id.replace(ID_PRE, ''); // 健壮性考虑。出于 KISSY 习惯采用 id 选择器
        config = Flash._normalize(config||{}); // 标准化参数关键字

        var self = this,
            target = ID_PRE + id, // 之所以要求使用 id，是因为当使用 ajbridge 时，程序员自己应该能确切知道自己在做什么
            callback = function(data) {
                if (data.status < 1) {
                    self.fire('failed', { data: data });
                    return;
                }
        
                S.mix(self, data);

                // 执行激活 静态模式的 flash
                // 如果这 AJBridge 先于 DOMReady 前执行 则失效
                // 建议配合 S.ready();
                if (!data.dynamic || !config.src) {
                    self.activate();
                }
            };
    
        // 自动产生 id  
        config.id = config.id || S.guid(PREFIX);

        // 注册应用实例
        AJBridge.instances[config.id] = self;

        //  动态方式
        if (config.src) {
            // 强制打开 JS 访问授权，AJBridge 的最基本要求
            config.params.allowscriptaccess = 'always';
            config.params.flashvars = S.merge(config.params.flashvars, {
                // 配置 JS 入口
                jsEntry: EVENT_HANDLER,
                // 虽然 Flash 通过 ExternalInterface 获得 obejctId
                // 但是依然存在兼容性问题, 因此需要直接告诉
                swfID: config.id
            });
        }

        // 支持静态方式，但是要求以上三个步骤已静态写入
        // 可以参考 test.html
    
        // 由于完全基于事件机制，因此需要通过监听之后进行初始化 Flash
    
        if(manual){
            self.__args = [target, config, callback];
        }
        else{
            S.later(Flash.add,LAYOUT,false,Flash,[target, config, callback]);
        }
    }

    /**
     * 静态方法
     */

    AJBridge.version = VERSION;

    AJBridge.instances = { };

    /**
     * 处理来自 AJBridge 已定义的事件
     * @param {String} id            swf传出的自身ID
     * @param {Object} event        swf传出的事件
     */
    AJBridge.eventHandler = function(id, event) {
        var instance = AJBridge.instances[id];
        if (instance) {
            instance.__eventHandler(id, event);
        }
    };

    /**
     * 批量注册 SWF 公开的方法
     * @param {Class} C
     * @param {String|Array} methods
     */
    AJBridge.augment = function (C, methods) {
        if (S.isString(methods)) {
            methods = [methods];
        }
        if (!S.isArray(methods)) return;
  
  

        S.each(methods, function(methodName) {
            C.prototype[methodName] = function() {
                try {
                    return this.callSWF(methodName, S.makeArray(arguments));
                } catch(e) { // 当 swf 异常时，进一步捕获信息
                    this.fire('error', { message: e });
                }
            }
        });
    }

    S.augment(AJBridge, S.EventTarget, {

        init: function() {
            if(!this.__args)return;
            Flash.add.apply(Flash, this.__args);
            this.__args = null;
            delete this.__args; // 防止重复添加
        },

        __eventHandler: function(id, event) {
            var self = this,
                type = event.type;
      
            event.id = id;   // 弥补后期 id 使用
           
            switch(type){
                case "log":
                    S.log(event.message);
                    break;
                default:
                    self.fire(type, event);
            }
        },

        /**
         * Calls a specific function exposed by the SWF's ExternalInterface.
         * @param func {String} the name of the function to call
         * @param args {Array} the set of arguments to pass to the function.
         */
        callSWF: function (func, args) {
            var self = this;
            args = args || [];
            try {
                if (self.swf[func]) {
                    return self.swf[func].apply(self.swf, args);
                }
            }
            // some version flash function is odd in ie: property or method not supported by object
            catch(e) {
                var params = '';
                if (args.length !== 0) {
                    params = "'" + args.join("','") + "'";
                }
                //avoid eval for compressiong
                return (new Function('self', 'return self.swf.' + func + '(' + params + ');'))(self);
            }
        }
    });

    // 为静态方法动态注册
    // 注意，只有在 S.ready() 后进行 AJBridge 注册才有效。
    AJBridge.augment(AJBridge, ['activate', 'getReady', 'getCoreVersion']);

    KISSY.AJBridge = AJBridge;

    return AJBridge;
    
},{
    requires:["./flash"]
});

KISSY.add('components/clipboard_lib/index', function(S, AJBridge) {

    /**
     * @constructor
     * @param {String} id                                    需要注册的SWF应用ID
     * @param {Object} config                                配置项
     * @param {String} config.data                           配置数据.仅在 copy | cut 两种模式下有效
     * @param {Boolean} config.format                        数据格式. 当且仅当是富粘贴板时有效，即初始化后获得 richClipboard 事件时有效。
     * @param {Boolean} config.btn                           启用按钮模式，默认 false
     * @param {Boolean} config.hand                          显示手型，默认 false
     */
    function Clipboard(id, config) {
        config = config || { };
        var flashvars = { };

        S.each(['data', 'format', 'btn', 'hand'], function(key) {
            if(key in config) flashvars[key] = config[key];
        });

        config.params = config.params || { };
        config.params.flashvars = S.merge(config.params.flashvars, flashvars);

        Clipboard.superclass.constructor.call(this, id, config);
    }

    S.extend(Clipboard, AJBridge);

    AJBridge.augment(Clipboard,
        [
            /**
             * 获取数据
             * @param   type:String             指定获取的类型，如果未指定或者不包含 则返回 null 或 String 类型。
             * @param   transferMode:String     指定在访问应用程序定义的数据格式时是返回一个引用还是返回序列化副本。
             * @return
             */
            'getData',
            /**
             * 删除指定格式的数据表示形式。
             * @param   format:String           如果没有值则从此 Clipboard 对象中删除所有数据表示形式。       
             */   
            'clearData',
            /**
             * 设置数据。注意，这个并不直接写入粘贴板。需要捕获用户输入后执行 execute();
             * @param   data                    任何数据。当然需要粘贴板支持。
             * @param   format:String           粘贴数据的格式。当然，目前仅支持 纯文本 text 和  HTML。
             * @param   serializable:Boolean    为可以序列化（和反序列化）的对象指定 true。
             */
            'setData'
        ]
    );

    Clipboard.version = '1.0.0';

    return Clipboard;

},{requires:["./ajbridge"]});