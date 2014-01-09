KISSY.add("app/util/format/format", function(S, Vframe, VOM) {
    var Format = {};

    S.mix(Format, {
        /**
         * 按千分位格式化数字，加','，例：'270000.50 => 270,000.50'
         * @param  {number|string|function} n 要格式的值
         * @param  {string} j 分隔符，默认为','
         * @return {array}   返回一个数组，[整数, 小数]
         */
        formatNumber : function(n, j) {
            j = j || ',';
            var type = typeof n;
            if (type !== 'number' && type !== 'string' && type !== 'function') return ['--'];
            if (type === 'function') n = n();
            if (type === 'string' && /[^\d\.\-]/.test(n)) return ['--'];
            if (isNaN(n)) return ['--'];

            var s = n.toString(10);

            //是否负值
            var isNegative = (s.indexOf('-') > -1);
            if (isNegative) s = s.slice(1); //负值则取-后面的值

            var a = s.split('.');
            var l = a[0].split('').reverse().join('');
            var t = l.match(/\-?\d{3}/g) || [];
            var len = l.length;
            var e = l.slice(len - (len % 3));
            var result = [];

            if (e) t.push(e);

            for (var i = 0; i < t.length; i++) {
                t[i] = t[i].split('').reverse().join('');
            }

            //如果是负值加上 '-'
            result.push(isNegative ? '-' + t.reverse().join(j) : t.reverse().join(j));
            if (a[1]) {
                a[1] = a[1].slice(0, 2);
                if (a[1].length === 1) a[1] = a[1] + '0';
                result.push(a[1]);
            }

            return result.join('.');
        }
    });

    return Format;

}, {
    requires: ['magix/vframe', 'magix/vom']
});