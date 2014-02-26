KISSY.add("app/util/calendar/calendar", function(S, Vframe, VOM, DatePicker) {
    var Calendar = {};

    S.mix(Calendar, {
        dateParse: function (date, str) {
            return DatePicker.Date.parse(date, str || '-');
        },
        dateFormat: function (date, str) {
            return DatePicker.Date.format(date, str || 'yyyy-mm-dd');
        }, 
        dateRecent: function (n, base) {
            var dt = 1000 * 60 * 60 * 24; //一天的毫秒数
            var d = base || new Date();
            var ct = d.getTime();
            return new Date(ct + dt * n);
        }
    });

    return Calendar;

}, {
    requires: ['magix/vframe', 'magix/vom', 'brix/gallery/datepicker/index']
});