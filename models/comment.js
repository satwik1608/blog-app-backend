const db = require("../db");
const Blog = require("./blog");

module.exports = {
  create,
  remove,
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

async function remove(id) {
  await Comment.findOneAndDelete({ _id: id });
}
