exports.config = {
    debug: true,
    name: 'KIWI BLOG',
    description: 'KIWI BLOG',
    version: '0.1',

    // 静态资源
    staticCDN: '',

    // db: 'mongodb://kiwi:kiwiobject@127.0.0.1:27017/kiwiobject',
    db: 'mongodb://127.0.0.1:27017/kiwiobject',
    session_secret: 'kiwi_blog',
  	cookie_name: 'kiwi_blog',

    // 又拍云账户
    upyun_buckname : 'kiwipics',
    upyun_username : 'wolongxzg',
    upyun_password : 'wang354438',
    upyun_path : 'http://kiwipics.b0.upaiyun.com'
};