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
// Route for getting the posts of a user in json format 
router.get('/:username/posts', (req, res) => {
  User.find({
    username: req.params.username,
  }).exec((err, user) => {
    if (err || user.length === 0) return console.log(err || 'User does not exist! b');
    let dbQuery = {};
    !req.query.pid ? dbQuery = { postedBy: user[0]._id } : dbQuery = { postedBy: user[0]._id, _id: req.query.pid };
    req.query.page = parseInt(req.query.page);
    req.query.limit = parseInt(req.query.limit);
    Post.paginate(dbQuery, { page: req.query.page, limit: req.query.limit, sort: { createdAt: -1 } }, async (err, posts) => {
      const promiseArray = [];
      const clientName = req.query.clientName || '';
      if (err) console.log(err);
      posts.docs.forEach((post) => {
        const promise = axios
          .get(
            `http://localhost:5000/server/users/posts/${post._id}/like/${clientName}`,
          )
          .then((resLike) => {
            let postCopy = { // make a shallow copy to edit
              _id: post._id,
              postedBy: post.postedBy,
              title: post.title,
              content: post.content,
              createdAt: post.createdAt,
              editedOn: post.editedOn,
              _v: post._v,
            };
            postCopy.likeCount = resLike.data.likeArr.length;
            postCopy.isLikedByClient = resLike.data.isLikedByClient;
            return postCopy;
          }).catch((err) => console.log('failed to send!'));
        promiseArray.push(promise);
      });
      return res.status(200).json(await Promise.all(promiseArray));
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
// Route for getting a post's like information.
router.get('/posts/:pID/like/:username?', (req, res) => {
  if (!req.params.username) { // user not logged in
    Like.find({ postId: req.params.pID }).exec((err, likeArr) => {
      if (err) return res.status(404).json(err);
      const likeObj = {
        likeArr,
        isLikedByClient: false,
      };

      return res.status(200).json(likeObj);
    });
  } else {
    User.find({
      username: req.params.username,
    }).exec((err, user) => {
      if (err || user.length === 0) return res.status(404).json(err || `User does not exist! ${req.params.username}`);
      Like.find({ postId: req.params.pID }).exec((er, likeArr) => {
        if (er) return res.status(404).json(er);
        const isLikedByClient = likeArr.some((like => { return like.likedBy.equals(user[0]._id) }));
        const likeObj = {
          likeArr,
          isLikedByClient,
        };
        return res.status(200).json(likeObj);
      });
    });
  }
});

// POST /users/:username/
// Route for editing a user's profile information
router.put('/:username/updateProfile', (req, res, next) => {
  User.findOneAndUpdate({ username: req.params.username }, req.body)
    .exec((err, user) => {
      if (err) return next(err);
      return res.status(200).json(user);
    });
});

// Route for editing a user's post
router.put('/:username/updatePost/:pID', (req, res, next) => {
  Post.findOneAndUpdate({ _id: req.params.pID }, req.body)
    .exec((err, post) => {
      if (err) return next(err);
      return res.status(200).json(post);
    });
});


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
