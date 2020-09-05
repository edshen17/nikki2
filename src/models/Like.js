
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  parentId: { type: Schema.Types.ObjectId },
  likedBy: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
});


const Like = mongoose.model('Like', LikeSchema);
module.exports.Like = Like;
