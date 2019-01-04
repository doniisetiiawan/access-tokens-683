import Sequelize from 'sequelize';
import slug from 'slug';

import config from '../config';

const db = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  operatorsAliases: false,
});

const queryType = {
  type: Sequelize.QueryTypes.SELECT,
};

const Post = db.define('posts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'The title is empty',
      },
    },
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'The slug is empty',
      },
    },
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'The content is empty',
      },
    },
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Who is the author?',
      },
    },
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

export function createPost(title, content, callback) {
  db
    .sync()
    .then(() => {
      Post.create({
        title,
        slug: title ? slug(title, { lower: true }) : '',
        content,
        author: 'Carlos Santana',
      }).then((insertedPost) => {
        console.log(insertedPost);
        callback(insertedPost.dataValues);
      }).catch((error) => {
        console.log(error);
        callback(false, error);
      });
    });
}

export function updatePost(slg, title, content, callback) {
  Post.update(
    {
      title,
      slug: slug(title, { lower: true }),
      content,
    },
    {
      where: { slug: slg },
    },
  ).then((rowsUpdated) => {
    console.log('UPDATED', rowsUpdated);
    callback(rowsUpdated);
  }).catch((error) => {
    console.log(error);
    callback(false, error);
  });
}

export function removePost(slug, callback) {
  Post.destroy({
    where: {
      slug,
    },
  }).then((rowDeleted) => {
    console.log('DELETED', rowDeleted);
    callback(rowDeleted);
  }).catch((error) => {
    console.log(error);
    callback(false, error);
  });
}

export function findAllPosts(callback) {
  db.query('SELECT * FROM posts', queryType).then((data) => {
    callback(data);
  });
}

export function findBySlug(slug, callback) {
  db.query(`SELECT * FROM posts WHERE slug = '${slug}'`, queryType).then((data) => {
    callback(data);
  });
}
