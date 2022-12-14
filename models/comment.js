const db = require("../db");
const Blog = require("./blog");

module.exports = {
  create,
  remove,
  get,
  update,
};
const commentSchema = new db.Schema({
  data: { type: String },
  blog: {
    type: String,
    ref: "Blog",
    index: true,
    required: true,
  },
  author: {
    type: String,
    ref: "Author",
    index: true,
    rerquired: true,
  },
  reply: {
    type: String,
  },
});

const Comment = db.model("Comment", commentSchema);

async function create(fields) {
  const comment = new Comment(fields);

  await comment.populate("blog author");

  const blogs = await Blog.find(fields.blog);

  blogs.comments.push(comment._id);

  await blogs.save();

  await comment.save();

  return comment;
}

async function update(change, id) {
  const comment = await Comment.findById(id);

  Object.keys(change).forEach(function (key) {
    comment[key] = change[key];
  });

  await comment.save();

  return comment;
}

async function get() {
  return await Comment.find()
    .populate("author")
    .populate("blog")
    .populate("reply")
    .exec();
}

async function remove(id) {
  await Comment.findOneAndDelete({ _id: id });
}
