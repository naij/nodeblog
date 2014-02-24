exports.config = {
    debug: true,
    name: 'Kiwi\'s Blog',
    description: 'Kiwi\'s Blog',
    version: '0.1',

    // 静态资源
    staticCDN: '',

    // db: 'mongodb://kiwi:kiwiobject@127.0.0.1:27017/kiwiobject',
    db: 'mongodb://127.0.0.1:27017/kiwiobject',
    session_secret: 'kiwi_blog',
  	cookie_name: 'kiwi_blog',

    // 又拍云账户
    upyun_buckname : 'kiwiobjects',
    upyun_username : 'wolongxzg',
    upyun_password : 'wang354438',
    upyun_path : 'http://kiwiobjects.b0.upaiyun.com'
};