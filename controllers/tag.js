var models = require('../models');
var Tag = models.Tag;


exports.getTags = function (req, res, next) {
    Tag.find(function(err, doc) {
        if (err) {
            res.json({
                data: null,
                info: {
                    ok: false,
                    msg: '查询出错'
                }
            });

            return false;
        } else {
            res.json({
                data: doc,
                info: {
                    ok: true,
                    msg: null
                }
            });
        }
    });
}