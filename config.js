exports.config = {
    debug: true,
    name: 'Kiwi\'s Blog',
    description: 'Kiwi\'s Blog',
    version: '0.1',

    // 静态资源
    staticCDN: '',

    // 配置mongodb 线上环境和本地环境
    // db: 'mongodb://127.0.0.1/test',
    db: function () {
        var mongo = {
            'hostname': 'localhost',
            'port': 27017,
            'username': '',
            'password': '',
            'db': 'kiwiobject'
        }
        var generate_mongo_url = function(obj){
            obj.hostname = (obj.hostname || 'localhost');
            obj.port = (obj.port || 27017);
            obj.db = (obj.db || 'test');
            if (obj.username && obj.password) {
                return 'mongodb://' + obj.username + ':' + obj.password + '@' + obj.hostname + ':' + obj.port + '/' + obj.db;
            } else {
                return 'mongodb://' + obj.hostname + ':' + obj.port + '/' + obj.db;
            }
        }

        return generate_mongo_url(mongo);
    },
    session_secret: 'kiwi_blog',
  	cookie_name: 'kiwi_blog',

  	// admin 管理员权限
  	admins: { admin: true }
};