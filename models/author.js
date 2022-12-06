const db = require("../db");
const cuid = require("cuid");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = {
  create,
  find,
};
const authorSchema = new db.Schema({
  _id: { type: String, default: cuid },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
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
});

const Author = db.model("Author", authorSchema);

async function create(fields) {
  const author = new Author(fields);

  await hashPassword(author);

  await author.save();

  return author;
}

async function find(id) {
  const author = await Author.findById(id);

  return author;
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
