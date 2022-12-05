const db = require("../db");

const cuid = require("cuid");

module.exports = {
  create,
  edit,
  list,
  remove,
};
const blogSchema = new db.Schema({
  _id: { type: String, default: cuid },
  title: { type: String },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  img: { type: String },
  likes: { type: Number, default: 0 },
  author: { type: String },
  rating: { type: Number, default: 0.0 },
  content: { type: String },
  date: { type: Date, default: Date() },
});

const Blog = db.model("Blog", blogSchema);

async function create(fields) {
  const blog = await new Blog(fields).save();
  return blog;
}

async function list() {
  return await Blog.find();
}

async function get(id) {
  const blog = await Blog.findById(id);
  return blog;
}

async function edit(id, change) {
  const blog = await get(id);

  Object.keys(change).forEach(function (key) {
    blog[key] = change[key];
  });

  await blog.save();
  return blog;
}

async function remove(id) {
  await Blog.deleteOne({ id });
}
