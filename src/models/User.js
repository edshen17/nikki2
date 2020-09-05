
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Post = require('../models/Post').Post;

const PostSchema = mongoose.model('Post').schema;
const Comment = require('../models/Post').Comment;

const CommentSchema = mongoose.model('Comment').schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    default: 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
    required: false,
  },
  bio: {
    type: String,
    default: 'has not written a self-introduction yet',
    required: false,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
