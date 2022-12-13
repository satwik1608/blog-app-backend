const Blog = require("./models/blog");
const Author = require("./models/author");
const Comment = require("./models/comment");
const auth = require("./auth");
module.exports = {
  createBlog,
  listBlog,
  editBlog,
  deleteBlog,
  getBlog,
  createAuthor,
  getAuthor,
  createComment,
  followAuthor,
  unfollowAuthor,
};
async function createBlog(req, res, next) {
  const blog = await Blog.create(req.body);
  res.json(blog);
}

async function listBlog(req, res) {
  const blogs = await Blog.list();

  res.json(blogs);
}

async function getBlog(req, res) {
  const blog = await Blog.get(req.params.id);

  res.json(blog);
}

async function editBlog(req, res) {
  const change = req.body;

  const blog = await Blog.edit(req.params.id, change);

  res.json(blog);
}

async function deleteBlog(req, res) {
  await Blog.remove(req.params.id);
  res.json({ success: true });
}

async function createAuthor(req, res) {
  const author = await Author.create(req.body);

  res.json(author);
}

async function getAuthor(req, res) {
  const author = await Author.find(req.params.id);
  res.json(author);
}

async function createComment(req, res) {
  const comment = await Comment.create(req.body);

  res.json(comment);
}

async function followAuthor(req, res) {
  const author = await Author.follow(req.body.id, req.params.id);

  res.json(author);
}

async function unfollowAuthor(req, res) {
  const author = await Author.unfollow(req.body.id, req.params.id);
  res.json(author);
}

function forbidden(next) {
  const err = new Error("Forbidden");
  err.statusCode = 403;
  return next(err);
}
