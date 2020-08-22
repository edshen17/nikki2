const express = require('express');

const router = express.Router();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const User = require('../models/User');
const mongoose = require('mongoose');
const axios = require('axios');

const {
  Post,
} = require('../models/Post');

const {
  Like,
} = require('../models/Like');

const authConfig = {
  domain: 'dev-o3ydis3u.auth0.com',
  audience: 'http://localhost:5000/',
};

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

// Define an endpoint that must be called with an access token
router.get('/external', jwtCheck, (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!',
  });
});

// GET user's JSON data
router.get('/:username/json', (req, res, next) => {
  User.find({
    username: req.params.username,
  }, 'imageURL bio followers following comments username')
    .exec((err, users) => {
      if (err) return next(err);
      return res.json({
        users,
      });
    });
});


// POST /users/posts
// Route for creating a post
router.post('/posts', (req, res) => {
  User.find({
    username: req.body.postedBy,
  })
    .exec((err, user) => {
      if (err || user.length === 0) return console.log(err || 'User does not exist! a');
      const postedBy = user[0]._id;
      const title = req.body.title;
      const content = req.body.content;
      const post = new Post({
        postedBy,
        title,
        content,
      });
      post.save((e, p) => {
        if (e) return res.status(500).json(err);
        return res.status(200).json(p);
        // user[0].posts.push(post._id);
        // user[0].save((err) => {

        // });
      });
    });
});

// POST /users/register
// Create a user
router.post('/register', (req) => {
  // create user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
  });
  newUser.save().catch((err) => {
    console.log(err);
  });
});

// GET /users/:username/posts
// Route for getting all the posts of a user in json format
router.get('/:username/posts', (req, res) => {
  User.find({
    username: req.params.username,
  }).exec((err, user) => {
    if (err || user.length === 0) return console.log(err || 'User does not exist! b');
    Post.find({
      postedBy: user[0]._id,
    }).sort({
      createdAt: -1,
    }).exec(async (err, posts) => {
      const promiseArray = [];

      if (err) console.log(err);
      posts.forEach((post) => {
        const promise = axios
          .get(
            `http://localhost:5000/server/users/posts/${post._id}/like/${req.params.username}/false`,
          )
          .then((resLike) => {
            let postCopy = { // make a shallow copy to edit
              _id: post._id,
              postedBy: post.postedBy,
              title: post.title,
              content: post.content,
              createdAt: post.createdAt,
              _v: post._v,
              likeCount: 0,
            };
            postCopy.likeCount = resLike.data.length;
            return postCopy;
          });
        promiseArray.push(promise);
      });
      return res.status(200).json(await Promise.all(promiseArray));
    });
  });
});

// GET /users/:username/posts/:id
// Route for getting a specific post
router.get('/posts/:id', (req, res) => {
  Post.find({
    _id: req.params.id,
  }).exec((err, post) => {
    if (err || post.length === 0) return console.log(err || 'Post with given id does not exist!');

    User.findOne({ _id: post[0].postedBy }, (e, user) => {
      if (e) {
        res.status(500).json(e);
      }
      Like.countDocuments({ postId: req.params.id }, (er, c) => {
        if (er) return console.log(er);
        const postJson = JSON.parse(JSON.stringify(post[0]));
        postJson.username = user.username;
        postJson.likeCount = c;
        return res.status(200).json(postJson);
      });
    });
  });
});


// POST /posts/:postId/like/:likedByUserId
// Route for liking/unliking a post
router.post('/posts/:pID/like/:username', (req, res, next) => {
  User.find({
    username: req.params.username,
  }).exec((err, user) => {
    if (err || user.length === 0) return console.log(err || 'User does not exist! c');
    Like.find({ postId: req.params.pID, likedBy: user[0]._id }).exec((er, likeArr) => {
      if (er) return console.log(err);
      if (likeArr.length === 0) { // user has not liked post yet (like post)
        const like = new Like({
          postId: req.params.pID,
          likedBy: user[0]._id,
        });
        like.save((e) => {
          if (e) return next(e);
          return res.status(200).send(true);
        });
      } else { // user has already liked post (unliked post)
        Like.findByIdAndDelete(likeArr[0]._id, (errDelete) => {
          if (errDelete) console.log(errDelete);
          return res.status(200).send(false);
        });
      }
    });
  });
});

// GET /posts/:postId/like/:likedByUserId/:searchParam
// Route for getting a post's like information. If searchParam = true, return true if user liked post
// else, return list of users that like the post
router.get('/posts/:pID/like/:username/:searchParam', (req, res, next) => {
  User.find({
    username: req.params.username,
  }).exec((err, user) => {
    if (err || user.length === 0) return console.log(err || `User does not exist! ${req.params.username}`);
    if (req.params.searchParam === 'true') {
      Like.find({ postId: req.params.pID, likedBy: user[0]._id }).exec((er, likeArr) => {
        if (er) return console.log(err);
        if (likeArr.length === 0) { // user has not liked post yet (like post)
          return res.status(200).send(false);
        }
        return res.status(200).send(true);
      });
    } else {
      Like.find({ postId: req.params.pID }).exec((er, likeArr) => {
        if (er) return console.log(err);
        return res.status(200).json(likeArr);
      });
    }
  });
});

// // POST /users/:username/
// // Route for editing a user's profile information
// router.post('/:username', (req, res, next) => {
//   User.find({
//     username: req.params.username,
//   })
//     .exec((err, user) => {
//       if (err) return next(err);
//       user.bio = req.body.bio;
//       user.save(() => {
//         if (err) return next(err);
//         res.status(200).send(user);
//       });
//     });
// });


// // DELETE /users/:username/posts/:id/
// // Route for deleting a specific post
// router.delete('/:username/posts/:id', (req, res, next) => {
//   req.post.remove(() => {
//     const id = req.params.id;
//     Comment.deleteMany({
//       parentID: id,
//     }, (err) => { // deletes all comments in the post as well
//       if (err) return next(err);
//       req.post.save(() => {
//         res.status(200).send();
//       });
//     });
//   });
// });

// // POST /users/:username/posts/comment
// // Route for creating a comment for a specific post
// router.post('/:username/posts/:id/comment', (req, res, next) => {
//   if (req.body.comments) { // if we already made the comment and are updating the comments array
//     Post.findById(req.params.id, (err, post) => {
//       if (err) return next(err);
//       post.comments = req.body.comments;
//       post.save(() => {
//         if (err) return next(err);
//         res.status(200).json(post);
//       });
//     });
//   } else { // creating a new comment
//     const parentID = req.params.id;
//     const postedBy = req.body.postedBy;
//     const content = req.body.content;
//     const comment = new Comment({
//       parentID,
//       postedBy,
//       content,
//     });

//     User.find({
//       username: req.params.username,
//     })
//       .exec((err, user) => {
//         if (err) return next(err);
//         user.comments.push(comment);
//         users.comment_count++;
//         user.save(() => {
//           if (err) return next(err);
//           comment.save((err) => {
//             if (err) return next(err);
//             res.status(200).json(comment);
//           });
//         });
//       });
//   }
// });


module.exports = router;
