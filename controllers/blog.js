import slugFn from 'slug';
import Post from '../models/blog';

export function createPost(title, content, callback) {
  const newPost = new Post({
    title,
    content,
  });

  newPost.addAuthor('Carlos Santana');

  newPost.save((error) => {
    if (error) {
      console.log(error);
      callback(error, true);
    }

    console.log('Post saved correctly!');
    callback(newPost);
  });
}

export function updatePost(slug, title, content, callback) {
  const updatedPost = {
    title,
    content,
    slug: slugFn(title, { lower: true }),
  };

  Post.update({ slug }, updatedPost, (error, affected) => {
    if (error) {
      console.log(error);
      callback(error, true);
    }

    console.log('Post updated correctly!');
    callback(affected);
  });
}

export function removePost(slug, callback) {
  Post.remove({ slug }, (error) => {
    if (error) {
      console.log(error);
      callback(error, true);
    }

    console.log('Post removed correctly!');
    callback(true);
  });
}

export function findAllPosts(callback) {
  Post.find({}, (error, posts) => {
    if (error) {
      console.log(error);
      return false;
    }

    console.log(posts);
    callback(posts);
  });
}

export function findBySlug(slug, callback) {
  Post.find({ slug }, (error, post) => {
    if (error) {
      console.log(error);
      return false;
    }

    console.log(post);
    callback(post);
  });
}
