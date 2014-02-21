var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    tagName: {type: String}
});

mongoose.model('Tag', TagSchema, 'tag');