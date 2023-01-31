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
    required: true,
  },
  reply: [
    {
      type: String,
      ref: "Comment",
      index: true,
    },
  ],
  replyIs: {
    type: Boolean,
    required: true,
  },
  date: { type: Date, default: Date() },
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

  if (change.reply) {
    comment.reply.push(change.reply);

    await comment.save();
    return comment;
  }

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
    .populate({ path: "reply", populate: "author" })
    .exec();
}

async function remove(id) {
  await Comment.findOneAndDelete({ _id: id });
}
