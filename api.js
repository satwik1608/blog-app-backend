const Blog = require("./models/blog");
const Author = require("./models/author");

module.exports = {
  createBlog,
  listBlog,
  editBlog,
  deleteBlog,
  createAuthor,
};
async function createBlog(req, res) {
  const blog = await Blog.create(req.body);
  res.json(blog);
}

async function listBlog(req, res) {
  const blogs = await Blog.list();

  res.json(blogs);
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
