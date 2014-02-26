var fs = require('fs');
var models = require('../models');
var upyun = require('../models/upyun').upyun;
var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;
var util = require('../libs/util');
var Pic = models.Pic;

exports.getPictures = function (req, res, next) {
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;

    Pic.find({"uploadTime": {$gte:new Date(startTime),$lte:new Date(endTime)}}, function(err, doc) {
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
            var list = [];

            for (var i = 0; i < doc.length; i++) {
                var temp = doc[i].toJSON();
                temp['uploadTime'] = util.formatDate(temp.uploadTime);
                list.push(temp);
            }

            res.json({
                data: {
                    list: list,
                    pathPrefix: config.upyun_path
                },
                info: {
                    ok: true,
                    msg: null
                }
            });
        }
    });
}

exports.add = function (req, res, next) {
    // var r = req;

    var pic = req.files && req.files.pic;
    var fileName = pic.name;
    var tempPath = pic.path;
    var extension = fileName.substr(fileName.lastIndexOf('.'), fileName.length);
    var picName = util.md5((new Date()).getTime().toString()) + extension;

    var render = function () {
        res.json({
            data: '',
            info: {
                ok: true,
                msg: null
            }
        });
    };

    var proxy = new EventProxy();
    proxy.assign('file_upload', 'data_update', render);

    // 上传到又拍云
    upyun.writeFile('/c/' + picName, fs.readFileSync(tempPath), true, function (err, data) {
        if (!err) {
            fs.unlink(tempPath, function () {
                if (err) {
                    return next(err);
                }
                proxy.trigger('file_upload');
            });
        }
    });

    // 保存到数据库
    var pic = new Pic();
    pic.picPath = '/c/' + picName;
    pic.picSize = '';
    pic.save(function (err) {
        if (err) {
            return next(err);
        }
        proxy.trigger('data_update');
    });
}