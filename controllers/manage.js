var sanitize = require('validator').sanitize;
var crypto = require('crypto');
var config = require('../config').config;
var models = require('../models');
var User = models.User;

// login message
exports.loginMsg = function (req, res) {
    if (req.session.hasLogin) {
        res.json({
            data: {
                hasLogin: true
            },
            info: {
                ok: true,
                msg: null
            }
        });
    } else {
        res.json({
            data: {
                hasLogin: false
            },
            info: {
                ok: true,
                msg: null
            }
        });
    }
}

// login.
exports.login = function (req, res, next) {
    var loginname = sanitize(req.body.name).trim().toLowerCase();
    var pass = sanitize(req.body.pass).trim();

    if (!loginname || !pass) {
        res.json({
            data: {
                error: '用户名或者密码错误'
            },
            info: {
                ok: true,
                msg: null
            }
        });

        return false;
    }

    User.findOne({'loginname': loginname}, function (err, user) {
        if (err) return next(err);

        if (!user) {
            res.json({
                data: {
                    error: '用户不存在。'
                },
                info: {
                    ok: true,
                    msg: null
                }
            });
        } else if (pass !== user.pass) {
            res.json({
                data: {
                    error: '密码错误。'
                },
                info: {
                    ok: true,
                    msg: null
                }
            });
        } else {
            genSession(user, res);

            res.json({
                data: '',
                info: {
                    ok: true,
                    msg: null
                }
            });
        }
    });
};

// sign out
exports.logout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.cookie_name, {
        path: '/'
    });
    res.json({
        data: '',
        info: {
            ok: true,
            msg: null
        }
    });
};

exports.userAuth = function (req, res, next) {
    if (req.session.hasLogin) {
        return next();
    } else {
        var cookie = req.cookies[config.cookie_name];
        if (!cookie) {
            res.json({
                data: {
                    hasLogin: false
                },
                info: {
                    ok: true,
                    msg: null
                }
            });

            return; 
        }

        var auth_token = decrypt(cookie, config.session_secret);
        var auth = auth_token.split('\t');
        var user_id = auth[0];

        User.findOne({_id: user_id}, function (err, user) {
            if (err) {
                res.json({
                    data: {
                        hasLogin: false
                    },
                    info: {
                        ok: true,
                        msg: null
                    }
                });

                return; 
            }

            if (user) {
                req.session.hasLogin = true;
                return next();
            } else {
                res.json({
                    data: {
                        hasLogin: false
                    },
                    info: {
                        ok: true,
                        msg: null
                    }
                });

                return;
            }
        });
    }
};

function genSession(user, res) {
    var auth_token = encrypt(user._id + '\t' + user.name + '\t' + user.pass, config.session_secret);
    res.cookie(config.cookie_name, auth_token, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30
    }); //cookie 有效期30天
}

function encrypt(str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

function decrypt(str,secret) {
   var decipher = crypto.createDecipher('aes192', secret);
   var dec = decipher.update(str,'hex','utf8');
   dec += decipher.final('utf8');
   return dec;
}

function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}