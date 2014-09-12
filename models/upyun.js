var config = require('config');
var UPYun = require('../libs/upyun').UPYun;
var backname = config.upyun_buckname;
var username = config.upyun_username || 'wolongxzg';
var password = config.upyun_password || 'wang354438';

// 初始化又拍云服务
var upyun = new UPYun(backname, username, password);

exports.upyun = upyun;