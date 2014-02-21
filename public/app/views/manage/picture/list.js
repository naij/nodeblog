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
            me.setViewPagelet({

            }, function () {
                me.components();
            });
            // me.manage(MM.fetchAll([{
            //     name: "manage_picture_list"
            // }], function (errs, MesModel) {
            //     var data = MesModel.get('data');

            //     me.setViewPagelet({
            //         list: data,
            //         typeList: typeList
            //     }, function () {
            //         me.components();
            //     });
            // }));
        },
        components: function () {
            var me = this;
            var pagelet = me.getManaged('pagelet');

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
                    start: new Date('2014-02-01'),
                    end: new Date('2014-02-18')
                },
                autoRender: false
            });

            calendar.on('rangeSelect', function (e) {
                calendar.hide();
                var startTime = Calendar.Date.format(e.start,'yyyy-mm-dd');
                var endTime = Calendar.Date.format(e.end,'yyyy-mm-dd');
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