
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const User = require('../models/User');


const PostSchema = new Schema({
  postedBy: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  editedOn: { type: Date, default: Date.now },
});

PostSchema.plugin(mongoosePaginate);

const CommentSchema = new Schema({
  parentID: { type: Schema.Types.ObjectId, ref: 'PostSchema' },
  content: {
    type: String,
    required: true,
  },
  createdOn: { type: Date, default: Date.now },
  editedOn: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);
const Post = mongoose.model('Post', PostSchema);

module.exports.Comment = Comment;
module.exports.Post = Post;
