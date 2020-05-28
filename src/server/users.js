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
router.get('/:username/json', (req, res, next) => {
  User.find({
    username: req.params.username,
  }, 'imageURL bio followers follower_count following following_count comments comment_count posts post_count username')
    .exec((err, users) => {
      if (err) return next(err);
      if (users.length === 0) {
        const error = new Error('User does not exist');
        error.status = 404;
        return next(error);
      }
      return res.json({
        users,
      });
    });
});

// Making a user in the db
router.post('/register', (req, res) => {
  const {
    username,
    email,
    password,
    password2,
  } = req.body;
  const errors = [];

  // Check if user did not fill out all inputs
  if (!username || !email || !password || !password2) {
    errors.push({
      msg: 'Please fill out all fields',
    });
  }

  // Check passwords
  if (password !== password2) {
    errors.push({
      msg: 'Passwords do not match!',
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters long',
    });
  }

  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    // Validation
    User.findOne({
      email,
    })
      .then((user) => {
        if (user) {
          // user exists
          errors.push({
            msg: 'A user with that email already exists',
          });
          return res.status(400).json(errors);
        }
        const newUser = new User({
          username,
          email,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err2, hash) => {
            if (err || err2) {
              return res.status(400);
            }
            newUser.password = hash;
            return newUser.save().then(() => res.status(201).json(newUser.username))
              .catch((catchedErr) => {
                res.status(400).json(catchedErr);
              });
          });
        });
      });
  }
});

// POST /users/:username/
// Route for editing a user's profile information
router.post('/:username', (req, res, next) => {
  User.find({
    username: req.params.username,
  })
    .exec((err, user) => {
      if (err) return next(err);
      user.bio = req.body.bio;
      user.save(() => {
        if (err) return next(err);
        res.status(200).send(user);
      });
    });
});

// GET /users/:username/posts
// Route for getting all the posts of a user in json
router.get('/:username/posts', (req, res, next) => {
  Post.find({
    postedBy: req.params.username,
  })
    .sort({
      createdAt: -1,
    })
    .exec((err, posts) => {
      if (err) return next(err);
      return res.status(200).json(posts);
    });
});


// GET /users/:username/posts/:id
// Route for getting a specific post
router.get('/:username/posts/:id', (req, res) => {
  res.send(req.post);
});

// POST /users/:username/posts
// Route for creating a post
router.post('/:username/posts', (req, res, next) => {
  const postedBy = req.params.username;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    postedBy,
    title,
    content,
  });

  post.save((err) => {
    if (err) return next(err);
    res.status(201).redirect(`/users/${postedBy}`);
  });
});

// POST /users/:username/posts
// Route for liking/unliking a post
router.post('/:username/posts/:id/like', (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    post.likedBy = req.body.likedBy;
    post.save(() => {
      if (err) return next(err);
      res.status(200).send(post);
    });
  });
});

// DELETE /users/:username/posts/:id/
// Route for deleting a specific post
router.delete('/:username/posts/:id', (req, res, next) => {
  req.post.remove(() => {
    const id = req.params.id;
    Comment.deleteMany({
      parentID: id,
    }, (err) => { // deletes all comments in the post as well
      if (err) return next(err);
      req.post.save(() => {
        res.status(200).send();
      });
    });
  });
});

// POST /users/:username/posts/comment
// Route for creating a comment for a specific post
router.post('/:username/posts/:id/comment', (req, res, next) => {
  if (req.body.comments) { // if we already made the comment and are updating the comments array
    Post.findById(req.params.id, (err, post) => {
      if (err) return next(err);
      post.comments = req.body.comments;
      post.save(() => {
        if (err) return next(err);
        res.status(200).json(post);
      });
    });
  } else { // creating a new comment
    const parentID = req.params.id;
    const postedBy = req.body.postedBy;
    const content = req.body.content;
    const comment = new Comment({
      parentID,
      postedBy,
      content,
    });

    User.find({
      username: req.params.username,
    })
      .exec((err, user) => {
        if (err) return next(err);
        user.comments.push(comment);
        users.comment_count++;
        user.save(() => {
          if (err) return next(err);
          comment.save((err) => {
            if (err) return next(err);
            res.status(200).json(comment);
          });
        });
      });
  }
});


module.exports = router;
