const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Post = require('../models/Post').Post;
const PostSchema = mongoose.model('Post').schema;


const ViewSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'PostSchema' },
  viewedBy: { type: String, required: true },
});


const View = mongoose.model('View', ViewSchema);
module.exports.View = View;
