import express from 'express';
import jwt from 'jsonwebtoken';
import {
  createPost,
  findAllPosts,
  findBySlug,
  removePost,
  updatePost,
} from '../models/blog';
import { login } from '../models/user';

import config from '../config';

const { security: { secretKey, expiresIn } } = config;

const router = express.Router();

const validateToken = (req, res, next) => {
  if (req.headers['access-token']) {
    req.accessToken = req.headers['access-token'].split(' ')[1];

    return next();
  }
  res.status(403).send({
    error: 'You must send an access-token header...',
  });
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  login(username, password, (data) => {
    if (Object.keys(data).length === 0) {
      res.status(403).send({ error: 'Invalid login' });
    }

    jwt.sign({ data }, secretKey, { expiresIn }, (error,
      accessToken) => {
      res.json({
        accessToken,
      });
    });
  });
});

router.get('/', (req, res) => {
  res.send(`
    <p>API Endpoints:</p>
    <ul>
      <li><a href="/api/posts">/api/posts</a></li>
      <li><a href="/api/post/1">/api/post/:id</a></li>
    </ul>
`);
});

router.get('/posts', validateToken, (req, res) => {
  jwt.verify(req.accessToken, secretKey, (error, userData) => {
    if (error) {
      console.log(error);
      res.status(403).send({ error: 'Invalid token' });
    } else {
      findAllPosts((posts) => {
        res.json({
          response: posts,
          user: userData,
        });
      });
    }
  });
});


router.get('/post/:slug', (req, res) => {
  const { params: { slug } } = req;

  findBySlug(slug, (singlePost) => {
    console.log('single', singlePost);
    if (!singlePost || singlePost.length === 0) {
      res.send({
        error: true,
        message: 'Post not found',
      });
    } else {
      res.json({
        response: [singlePost],
      });
    }
  });
});

router.post('/post', (req, res) => {
  const { title, content } = req.body;

  createPost(title, content, (data, error = false) => {
    if (error) {
      res.json({
        error: true,
        message: data,
      });
    } else {
      res.json({
        response: {
          saved: true,
          post: data,
        },
      });
    }
  });
});

router.delete('/post/:slug', (req, res) => {
  const { params: { slug } } = req;

  removePost(slug, (removed, error) => {
    if (error) {
      res.json({
        error: true,
        message: 'There was an error trying to remove this post...',
      });
    } else {
      res.json({
        response: {
          removed: true,
        },
      });
    }
  });
});

router.put('/post/:slug', (req, res) => {
  const { params: { slug }, body: { title, content } } = req;

  updatePost(slug, title, content, (affected, error) => {
    if (error) {
      res.json({
        error: true,
        message: 'There was an error trying to update the post',
      });
    } else {
      res.json({
        response: {
          updated: true,
          affected,
        },
      });
    }
  });
});

export default router;
