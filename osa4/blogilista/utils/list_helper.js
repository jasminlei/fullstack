const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce(
    (max, blog) => (blog.likes > max.likes ? blog : max),
    blogs[0]
  );

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, "author");

  const authorsArray = Object.entries(authorCounts).map(([author, blogs]) => ({
    author,
    blogs,
  }));

  return _.maxBy(authorsArray, "blogs");
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const authorLikes = blogs.reduce((likes, blog) => {
    if (likes[blog.author]) {
      likes[blog.author] += blog.likes;
    } else {
      likes[blog.author] = blog.likes;
    }
    return likes;
  }, {});

  const authorLikesArray = Object.keys(authorLikes).map((author) => ({
    author: author,
    likes: authorLikes[author],
  }));

  return _.maxBy(authorLikesArray, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
