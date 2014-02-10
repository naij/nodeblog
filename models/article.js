var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    type: {type: String},
    tag: {type: String},
    title: { type: String },
    content: { type: String },
    markdown: {type: String},
    update: { type: Date, default: Date.now },
    pv: {type: Number, default: 0}
});

mongoose.model('Article', ArticleSchema, 'article');