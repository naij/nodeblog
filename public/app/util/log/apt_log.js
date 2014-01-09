/*
2012.10.30
    编写 atp_log.js
2012.10.31
    埋点
    TODO 计划如何白盒、黑盒
2012.11.1
    确认计划创建埋点细节：
        白盒、黑盒的埋点 PRD 不完整
2012.11.5
    review 需求，为点击统计增加 p_type

*/
KISSY.add('adv_log', function(S, Base, Node) {
    var img, imgForAplus;
    return {
        send: function(obj, debug) {
            if(!obj) return;

            var match = window.location.hash.match(/adzoneid=(\d+)/i);
            if(match) obj.adzoneid = match[1];

            // 钻展用户行为跟踪埋点迁移到 aplus 新日志：log.mmstat.com
            var urlForAplus = 'http://log.mmstat.com/tblm.55.1?' + S.param(obj) + '&_=' + new Date().getTime();

            // test
            if(debug) window.console && console.log('[LOG]', obj.adUrl ? '[PV]' : '[CLICK]', '[APLUS]', JSON.stringify(obj), urlForAplus);

            if(!imgForAplus) imgForAplus = new Image();
            imgForAplus.onerror = function(e) {
                imgForAplus = null;
                imgForAplus = new Image();
            }
            imgForAplus.src = urlForAplus;
        }
    };
}, {
    requires: []
});

KISSY.add('hash_pv', function(S, Base, Node) {
    var flatMap = [ //
    // hash                                  p_type      c_type                              comment
    '!/promotion/index/                      promotion   index                               账户总览', //
    '!/promotion/campaign/                   promotion   campaign                            计划总览', //
    '!/promotion/taokeaudit_history/         taokeaudit  history                             淘客审核记录', //
    '!/report/cpa/                           report      cpa                                 特殊奖励结算'
    ];
    // {p_type: 'home', c_type: 'home', adzoneid: ''},
    var re = {},
        parts;
    for(var i = 0; i < flatMap.length; i++) {
        parts = flatMap[i].split(/\s+/);
        re[parts[0]] = {
            ptype: parts[1],
            ctype: parts[2]
        }
        // test
        // re[parts[0]].comment = parts[3];
    }
    return re;
}, {
    requires: []
});

KISSY.ready(function(KISSY) {
    var debug = window.location.href.indexOf('?debug') > 0;
    // 统计点击
    KISSY.use('adv_log, hash_pv', function(S, Log, hashPV) {
        S.one('body').delegate('click', '[atp]', function(e) {
            var atp = S.one(e.target).attr('atp') || S.one(e.currentTarget).attr('atp') || S.one(this).attr('atp'),
                fn = new Function('return ' + atp);
            atp = fn();

            // 解析 p_type：不能通过 hash 解析，因为事件冒泡到 body 时，hash 已经改变。
            if(typeof atp.ptype === 'undefined') atp.ptype = function() {
                // 其他解析代码
                return 'undefined';
            }

            // 支持参数为函数
            var hash = window.location.hash.replace(/^#/, '') || '!/promotion/index/';
            var parts = /^((?:.*)\/)(.*)$/.exec(hash),
                // 1 hash, 2 param
                param = S.unparam(parts[2]);
            for(var n in atp) {
                // function(hash, param){ return param.adzoneId && 'w' || 'b' }
                if(typeof atp[n] === 'function') atp[n] = atp[n].call(atp, parts[1], param);
            }

            // test
            if(debug) atp.comment = e.target.innerText || e.target.parentNode.innerText;

            Log.send(atp, debug);
        });

        // 统计日历快捷链接
		/*
        .delegate('click', '.med-cal-bd-right a', function(e) {
            var html = e.target && e.target.innerHTML,
                atp = {
                    p_type: 'report',
                    c_type: {
                        '今天': 'report_today',
                        '昨天': 'report_yesterday',
                        '过去7天': 'report_last7',
                        '过去15天': 'report_last14'
                    }[html]
                };

            // test
            if(debug) atp.comment = html;

            Log.send(atp, debug);
        });*/
    });

    // 统计 PV
    KISSY.use('adv_log, hash_pv', function(S, Log, hashPV) {
        function dispatch() {
            var hash = window.location.hash.replace(/^#/, '') || '!/promotion/index/';
            var parts = /^((?:.*)\/)(.*)$/.exec(hash),
                // 1 hash, 2 param
                param = S.unparam(parts[2]),
                path = param['board.archivestatus'] && '!/board/list/archive/' || parts[1],
                config = hashPV[path] || {
                    ptype: parts[1],
                    ctype: parts[2]
                },
                atp = {};
            // 提取 p_type c_type comment
            for(var i in config) {
                atp[i] = config[i];
            }
            atp.adUrl = location.href;
            Log.send(atp, debug);
        }
        // 为了避免与 Magix 的 hash 事件冲突，直接监听 popstate/hashchange 事件
        if(window.history && window.history.pushState) {
            S.Event.on(window, 'popstate', dispatch);
        } else {
            S.Event.on(window, "hashchange", dispatch);
            dispatch();
        }
        // dispatch(); // Magix 会触发第一次调用。
    });
});