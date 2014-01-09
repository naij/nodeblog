KISSY.add("app/util/util", function (S, Format, Dialog, Tooltip, GlobalTip) {
    var exports = {};

    S.mix(exports, Format);
    S.mix(exports, Dialog);
    S.mix(exports, Tooltip);
    S.mix(exports, GlobalTip);

    return exports;

}, {
    requires: [
    	'./format/format',
    	'./dialog/dialog',
    	'./tooltip/tooltip',
    	'./globaltip/globaltip'
    ]
});