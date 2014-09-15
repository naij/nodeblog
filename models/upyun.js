var config = require('config');
var UPYun = require('../libs/upyun').UPYun;
var backname = config.upyun_buckname;
var username = process.env.UPYUN_USERNAME;
var password = process.env.UPYUN_PASSWORD;

// 初始化又拍云服务
var upyun = new UPYun(backname, username, password);

exports.upyun = upyun;