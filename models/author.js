const db = require("../db");
const cuid = require("cuid");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = {
  create,
  find,
  follow,
  unfollow,
  edit,
  get,
  list,
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
  imgThumb: { type: String, ref: "Image", index: true },
  img: { type: String },
  description: { type: String },
  blogs: [
    {
      type: String,
      ref: "Blog",
      index: true,
    },
  ],
  liked: [
    {
      type: String,
    },
  ],
  lists: [{ type: String, ref: "Blog", index: true }],
  following: [{ type: String, ref: "Author", index: true }],
  followers: [{ type: String, ref: "Author", index: true }],
});

const Author = db.model("Author", authorSchema);

async function get(username) {
  console.log("username", username);
  const author = await Author.findOne({ username: username });
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

async function list(search) {
  const data = await Author.find()
    .populate("followers")
    .populate("following")
    .populate("blogs")
    .exec();

  if (search) {
    const author = data.filter((a) =>
      a.name.toLowerCase().startsWith(search.toLowerCase())
    );
    return author;
  }

  return data;
}
async function edit(id, change) {
  const author = await Author.findById(id);
  console.log(id);
  console.log(change);
  console.log(author);
  if (change.id) {
    if (change.id === 1) author.liked.push(change.liked);
    else if (change.id === -1) author.liked.remove(change.liked);
  } else {
    Object.keys(change).forEach(function (key) {
      author[key] = change[key];
    });
  }

  await author.save();

  return author;
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

  await author2.save();
  await author.save();
  return author;
}

async function unfollow(id1, id2) {
  const author = await Author.findById(id1);
  const author2 = await Author.findById(id2);
  author.following.remove(id2);
  author2.followers.remove(id1);

  await author.save();
  await author2.save();

  return author;
}
