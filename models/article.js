var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    type: {type: String},
    tag: {type: String},
    title: { type: String },
    content: { type: String },
    markdown: {type: String},
    update: { type: Date, default: Date.now }
});

mongoose.model('Article', ArticleSchema, 'article');