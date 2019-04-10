var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }
});

var Article = mongoose.model("Articles", ArticleSchema);

module.exports = Article;