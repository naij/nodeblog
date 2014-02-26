KISSY.add("app/views/manage/picture/list", function (S, View, MM, VOM, Router, Node, Util, Calendar) {
    var $ = Node.all;

    return View.extend({
        init: function (e) {
            var me = this;

            me.on('destroy', function() {
                var calendar = me.getManaged('calendar');
                calendar.destructor();
            });
        },
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            var loc = me.location;
            var params = S.clone(loc.params);
            var startTime = params.startTime;
            var endTime = params.endTime;

            if(startTime && endTime) {
                startTime = Util.dateParse(startTime);
                endTime = Util.dateParse(endTime);
            } else {
                startTime = Util.dateRecent(-6);
                endTime = Util.dateRecent(0);
            }

            me.manage('startTime', startTime);
            me.manage('endTime', endTime);

            me.manage(MM.fetchAll([{
                name: "picture_list",
                urlParams: {
                    startTime: startTime,
                    endTime: endTime
                }
            }], function (errs, MesModel) {
                var data = MesModel.get('data');

                me.setViewPagelet({
                    list: data.list,
                    startTime: Util.dateFormat(startTime),
                    endTime: Util.dateFormat(endTime),
                    pathPrefix: data.pathPrefix
                }, function () {
                    me.components();
                });
            }));
        },
        components: function () {
            var me = this;
            var pagelet = me.getManaged('pagelet');
            var startTime = me.getManaged('startTime');
            var endTime = me.getManaged('endTime');

            // 日历
            var calendar = new Calendar({
                maxDate: new Date(),
                trigger: '#J_calendar',
                align: {
                    points: ['br','tr'],
                    offset: [0,0]
                },
                pages: 2,
                rangeSelect: true,
                popup: true,
                triggerType: ['click'],
                range: {
                    start: startTime,
                    end: endTime
                },
                autoRender: false
            });

            calendar.on('rangeSelect', function (e) {
                calendar.hide();
                var startTime = Calendar.Date.format(e.start,'yyyy-mm-dd');
                var endTime = Calendar.Date.format(e.end,'yyyy-mm-dd');

                me.navigate('startTime=' + startTime + '&endTime=' + endTime);
            });

            me.manage('calendar', calendar);
        },
        'add<click>': function (e) {
            e.halt();
            var me = this;
            var top = $('#' + e.currentId).parent('.toolbar').offset().top;
            var dialogConfig = Util.getDefaultDialogConfig({
                width: 620,
                top: top
            });
            var viewName = 'app/views/manage/picture/add';
            var viewOptions = {
                callback: function () {
                    me.render();
                }
            };
            Util.showDialog(dialogConfig, viewName, viewOptions);
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util', 'brix/gallery/calendar/index']
});