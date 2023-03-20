const { sendEmail } = require("./mailer");
require("dotenv").config();

const Blog = require("./models/blog");
const Author = require("./models/author");
const Comment = require("./models/comment");
const Image = require("./models/image");

const jwt = require("jsonwebtoken");

module.exports = {
  createBlog,
  listBlog,
  editBlog,
  deleteBlog,
  getBlog,
  getBlogImage,
  createAuthor,
  updateAuthor,
  getAuthor,
  getAuthors,
  getAuthorId,

  getComment,
  createComment,
  updateComment,
  followAuthor,
  unfollowAuthor,
  getFollowers,
  uploadImage,
  confirmEmail,
  sendVerificationEmail,
};
async function createBlog(req, res, next) {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
}

async function listBlog(req, res) {
  const blogs = await Blog.list();

  res.json(blogs);
}

async function getBlog(req, res) {
  const blog = await Blog.get(req.params.id);

  res.json(blog);
}

async function getBlogImage(req, res) {
  const blog = await Blog.getImage(req.params.id);

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

async function sendVerificationEmail(req, res, next) {
  try {
    const { userId, email } = req.body;

    await sendEmail({ user: userId, email: email });
    res.json("Success");
  } catch (ex) {
    console.log(ex);
  }
}

async function createAuthor(req, res, next) {
  try {
    const author = await Author.create(req.body);

    await sendEmail({ user: author._id, email: author.email });

    res.json(author);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
}

async function updateAuthor(req, res) {
  if (req.query.use === "list") {
    const { id: blogId } = req.body;

    const author = await Author.toList(req.params.id, blogId);

    res.json(author);
  } else if (req.query.use === "delist") {
    const { id: blogId } = req.body;

    const author = await Author.removeFromList(req.params.id, blogId);

    res.json(author);
  } else {
    const author = await Author.edit(req.params.id, req.body);

    res.json(author);
  }
}

async function getAuthorId(req, res) {
  const { name } = req.query;

  const author = await Author.get(name);

  res.json(author);
}

async function getAuthor(req, res) {
  const author = await Author.find(req.params.id);
  res.json(author);
}

async function getAuthors(req, res) {
  const { search } = req.query;

  const authors = await Author.list(search);

  res.json(authors);
}

async function getComment(req, res) {
  const comments = await Comment.get();

  res.json(comments);
}
async function createComment(req, res) {
  const comment = await Comment.create(req.body);

  res.json(comment);
}

async function updateComment(req, res) {
  const comment = await Comment.update(req.body, req.params.id);

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

async function getFollowers(req, res) {
  const { id } = req.params;

  const followers = await Author.followers(id);

  res.json(followers);
}
async function uploadImage(req, res, next) {
  const fields = {
    name: req.body.name,
    file: req.file,
  };

  const image = await Image.create(fields);

  res.json(image);
}

async function confirmEmail(req, res, next) {
  try {
    const { user: userId } = jwt.verify(
      req.params.token,
      process.env.EMAIL_SECRET
    );

    const obj = {
      verified: true,
    };
    await Author.edit(userId, obj);
  } catch (ex) {
    console.log(ex);
  }

  // res.redirect("http://localhost:3000/login");
  res.redirect("https://inkwell.com/login");
}

function forbidden(next) {
  const err = new Error("Forbidden");
  err.statusCode = 403;
  return next(err);
}
