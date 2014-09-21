var config = require('config');
var upyun = require('upyun');
var backname = config.upyunBuckname;
var username = process.env.UPYUN_USERNAME;
var password = process.env.UPYUN_PASSWORD;

// 初始化又拍云服务
var upyunClient = new upyun(backname, username, password);

exports.upyun = upyunClient;