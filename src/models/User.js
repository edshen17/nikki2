
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Post = require('../models/Post').Post;

const PostSchema = mongoose.model('Post').schema;
const Comment = require('../models/Post').Comment;

const CommentSchema = mongoose.model('Comment').schema;

const UserSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    default: '',
    required: false,
  },
  bio: {
    type: String,
    default: 'has not written a self-introduction yet',
    required: false,
  },
  followers: {
    type: [this],
    default: [],
  },
  follower_count: {
    type: Number,
    default: 0,
  },
  following: {
    type: [this],
    default: [],
  },
  following_count: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [{ type: Schema.Types.ObjectId, ref: 'CommentSchema' }],
    default: [],
  },
  posts: {
    type: [{ type: Schema.Types.ObjectId, ref: 'PostSchema' }],
    default: [],
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
