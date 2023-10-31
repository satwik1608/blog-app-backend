const db = require("../db");
const cuid = require("cuid");
const { isAlphanumeric, isEmail } = require("validator");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = {
  create,
  find,
  findWithoutPopulate,
  follow,
  unfollow,
  followers,
  edit,
  get,
  list,
  getList,
  toList,
  removeFromList,
};

const authorSchema = new db.Schema({
  _id: { type: String, default: cuid },
  name: { type: String, required: true },
  username: usernameSchema(),
  email: emailSchema(),
  profession: { type: String },
  category: [
    {
      type: String,
    },
  ],
  password: { type: String, required: true },
  rating: { type: Number },
  imgThumb: {
    type: String,
  },
  verified: { type: Boolean, default: false },
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

async function get(username, email) {
  let author;
  if (username) author = await Author.findOne({ username: username });
  if (email) author = await Author.findOne({ email: email });
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

    .populate({
      path: "followers",
    })

    .populate("following")
    .populate("blogs")

    .exec();
}

async function findWithoutPopulate(id) {
  return await Author.findById(id);
}

async function getList(id) {
  return await Author.find({ _id: id }, { lists: 1 }).populate("lists").exec();
}

async function list(search) {
  const data = await Author.find()
    .populate({
      path: "followers",
    })

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
  const author = await Author.findOne({ username: id });
  Object.keys(change).forEach(function (key) {
    author[key] = change[key];
  });

  await author.save();

  return author;
}

async function remove(id) {
  await Author.findOneAndRemove({ _id: id });
  res.json({ success: true });
}

async function hashPassword(author) {
  if (author.password)
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

async function followers(id) {
  const author = await Author.findById(id);

  await author.populate("followers");

  await author.populate({
    path: "followers",
  });

  return author.followers;
}

async function toList(authorId, blogId) {
  const author = await Author.findOne({ username: authorId });

  author.lists.push(blogId);

  await author.save();

  return author;
}

async function removeFromList(authorId, blogId) {
  const author = await Author.findOne({ username: authorId });
  author.lists.remove(blogId);

  await author.save();

  return author;
}

async function isUnique(doc, username) {
  const existing = await get(username);
  return !existing || doc._id === existing._id;
}

async function isUniqueEmail(doc, email) {
  const existing = await get(null, email);
  return !existing || doc._id === existing._id;
}

function emailSchema(opts = {}) {
  return {
    type: String,
    required: true,
    validate: [
      {
        validator: isEmail,
        message: (props) => `${props.value} is not a valid email address`,
      },
      {
        validator: function (email) {
          return isUniqueEmail(this, email);
        },
        message: (props) => "Email is taken",
      },
    ],
  };
}

function usernameSchema() {
  return {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
    validate: [
      {
        validator: (str) => !str.match(/^admin$/i),
        message: (props) => "Invalid username",
      },
      {
        validator: function (username) {
          return isUnique(this, username);
        },
        message: (props) => "Username is taken",
      },
    ],
  };
}
