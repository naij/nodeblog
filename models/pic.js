var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PicSchema = new Schema({
    picPath: {type: String},
    picSize: {type: String},
    uploadTime: { type: Date, default: Date.now }
});

mongoose.model('Pic', PicSchema, 'pic');