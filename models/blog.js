const db = require("../db");

const Author = require("./author");
const { isLength } = require("validator");

const cuid = require("cuid");

module.exports = {
  create,
  edit,
  list,
  get,
  remove,
  find,
};

const blogSchema = new db.Schema({
  _id: { type: String, default: cuid },
  title: { type: String, required: true, minLength: 3, maxLength: 25 },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  img: { type: String, ref: "Image", index: true },
  likes: { type: Number, default: 0 },
  author: {
    type: String,
    ref: "Author",
    index: true,
    require: true,
  },

  comments: [
    {
      type: String,
      ref: "Comment",
      index: true,
    },
  ],
  brief: { type: String, required: true },
  likes: { type: Number, default: 0 },
  content: [{ type: String }],
  date: { type: Date, default: Date() },
});

const Blog = db.model("Blog", blogSchema);

async function create(fields) {
  const blog = new Blog(fields);

  await blog
    .populate({
      path: "author",
      populate: {
        path: "imgThumb",
        model: "Image",
      },
    })
    .populate("img");

  const author = await Author.find(fields.author);

  author.blogs.push(blog._id);

  await author.save();

  await blog.save();

  return blog;
}

async function list() {
  return await Blog.find()
    .populate({
      path: "author",
      populate: {
        path: "imgThumb",
        model: "Image",
      },
    })
    .populate("img")
    .exec();
}

async function get(id) {
  return await Blog.findById(id).populate("img");
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
  const blog = await get(id);

  const author = await Author.find(blog.author);

  author.blogs.remove(blog._id); // remove that blog under the authors list

  await author.save();

  await Blog.deleteOne({ _id: id });
}

async function find(id) {
  const blog = await Blog.findById(id);

  return blog;
}
