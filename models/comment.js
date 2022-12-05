const db = require("../db");
const Blog = require("./blog");

module.exports = {
  create,
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

  const blog = await Blog.find(fields.blog);

  blog.comments.push(comment._id);

  await blog.save();

  await comment.save();

  return comment;
}
