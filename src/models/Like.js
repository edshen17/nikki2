
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Post = require('../models/Post').Post;
const PostSchema = mongoose.model('Post').schema;


const LikeSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'PostSchema' },
  likedBy: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
});


const Like = mongoose.model('Like', LikeSchema);
module.exports.Like = Like;
