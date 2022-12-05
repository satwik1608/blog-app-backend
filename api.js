const Blog = require("./models/blog");

module.exports = {
  createBlog,
  listBlog,
  editBlog,
  deleteBlog,
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
