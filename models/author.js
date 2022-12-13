const db = require("../db");
const cuid = require("cuid");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = {
  create,
  find,
  follow,
  unfollow,
  get,
};
const authorSchema = new db.Schema({
  _id: { type: String, default: cuid },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  profession: { type: String },
  category: [
    {
      type: String,
    },
  ],
  password: { type: String, required: true },
  rating: { type: Number },
  imgThumb: { type: String },
  img: { type: String },
  description: { type: String },
  blogs: [
    {
      type: String,
      ref: "Blog",
      index: true,
    },
  ],
  lists: [{ type: String, ref: "Blog", index: true }],
  following: [{ type: String, ref: "Author", index: true }],
  followers: [{ type: String, ref: "Author", index: true }],
});

const Author = db.model("Author", authorSchema);

async function get(username) {
  const author = await Author.findOne({ username });
  return author;
}
async function create(fields) {
  const author = new Author(fields);

  await hashPassword(author);

  await author.save();

  return author;
}

async function find(id) {
  return await Author.findById(id)
    .populate("followers")
    .populate("following")
    .populate("blogs")
    .exec();
}

async function edit(id, change) {
  const author = Author.findById(id);

  Object.keys(change).forEach(function (key) {
    author[key] = change[key];
  });

  await author.save();

  res.json(author);
}

async function remove(id) {
  await Author.findOneAndRemove({ _id: id });
  res.json({ success: true });
}

async function hashPassword(author) {
  author.password = await bcrypt.hash(author.password, SALT_ROUNDS);
}

async function follow(id1, id2) {
  const author = await Author.findById(id1);

  author.following.push(id2);
  const author2 = await Author.findById(id2);
  author2.followers.push(id1);

  await author.populate("following");
  await author2.populate("followers");

  await author2.save();
  await author.save();
  return author;
}

async function unfollow(id1, id2) {
  const author = await Author.findById(id1);

  author.following.remove(id2);

  await author.save();

  return author;
}
