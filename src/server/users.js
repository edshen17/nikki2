const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const User = require('../models/User');
const {
  Post,
} = require('../models/Post');
const {
  Comment,
} = require('../models/Post');
const {
  ObjectId,
} = require('mongoose').Types;

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
router.get('/:email/json', (req, res, next) => {
  User.find({
    email: req.params.email,
  }, 'imageURL bio followers follower_count following following_count comments comment_count posts post_count username email')
    .exec((err, users) => {
      if (err) return next(err);
      return res.json({
        users,
      });
    });
});


// POST /users/:email/posts
// Route for creating a post
router.post('/:email/posts', (req, res) => {
  // find user from postedBy then create post inside...
  User.find({
    email: req.body.postedBy,
  })
    .exec((err, user) => {
      if (err) return console.log(err);
      const postedBy = user[0]._id;
      const title = req.body.title;
      const content = req.body.content;
      const post = new Post({
        postedBy,
        title,
        content,
      });
      post.save((err, post) => {
        user[0].posts.push(post._id);
        user[0].save((err) => {
          if (err) return res.status(500).json(err);
          res.status(200).json(post);
        });
      });
    });
});

// POST /users/register
// Create a user
router.post('/register', (req) => {
  // create user
  const newUser = new User({
    email: req.body.email,
  });
  newUser.save().catch((err) => {
    console.log(err);
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

// // GET /users/:username/posts
// // Route for getting all the posts of a user in json
// // router.get('/:username/posts', (req, res, next) => {
// //   Post.find({
// //     postedBy: req.params.username,
// //   })
// //     .sort({
// //       createdAt: -1,
// //     })
// //     .exec((err, posts) => {
// //       if (err) return next(err);
// //       return res.status(200).json(posts);
// //     });
// // });


// // GET /users/:username/posts/:id
// // Route for getting a specific post
// router.get('/:username/posts/:id', (req, res) => {
//   res.send(req.post);
// });


// // POST /users/:username/posts
// // Route for liking/unliking a post
// router.post('/:username/posts/:id/like', (req, res, next) => {
//   Post.findById(req.params.id, (err, post) => {
//     if (err) return next(err);
//     post.likedBy = req.body.likedBy;
//     post.save(() => {
//       if (err) return next(err);
//       res.status(200).send(post);
//     });
//   });
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
