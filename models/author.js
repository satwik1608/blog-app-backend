const db = require("../db");
const cuid = require("cuid");
const { isAlphanumeric, isEmail } = require("validator");
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
  username: usernameSchema(),
  email: emailSchema({ required: true }),
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
    ref: "Image",
    index: true,
  },
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

    .populate({
      path: "followers",
      populate: {
        path: "imgThumb",
        model: "Image",
      },
    })
    .populate("following")
    .populate("blogs")
    .populate("imgThumb")
    .exec();
}

async function list(search) {
  const data = await Author.find()
    .populate({
      path: "followers",
      populate: {
        path: "imgThumb",
        model: "Image",
      },
    })
    .populate("following")
    .populate("blogs")
    .populate("imgThumb")
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

async function isUnique(doc, username) {
  const existing = await get(username);
  return !existing || doc._id === existing._id;
}

function emailSchema(opts = {}) {
  const { required } = opts;
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isEmail,
      message: (props) => `${props.value} is not a valid email address`,
    },
  };
}

function usernameSchema() {
  return {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 16,
    validate: [
      {
        validator: isAlphanumeric,
        message: (props) => `${props.value} contains special characters`,
      },
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
