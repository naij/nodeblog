KISSY.add("app/util/util", function (S, Format, Dialog, Tooltip, GlobalTip, Calendar) {
    var exports = {};

    S.mix(exports, Format);
    S.mix(exports, Dialog);
    S.mix(exports, Tooltip);
    S.mix(exports, GlobalTip);
    S.mix(exports, Calendar);

    return exports;

}, {
    requires: [
    	'./format/format',
    	'./dialog/dialog',
    	'./tooltip/tooltip',
    	'./globaltip/globaltip',
        './calendar/calendar'
    ]
});