const db = require("../db");

const Author = require("./author");
const { isLength } = require("validator");

const cuid = require("cuid");

module.exports = {
  create,
  edit,
  list,
  get,
  getImage,
  remove,
  find,
  handleLike,
};

const blogSchema = new db.Schema({
  _id: { type: String, default: cuid },
  title: { type: String, required: true, minLength: 3, maxLength: 80 },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  img: { type: String, required: true },
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
  brief: { type: String, required: true, minLength: 3, maxLength: 150 },
  likes: { type: Number, default: 0 },
  content: [{ type: String }],
  date: { type: Date, default: Date() },
});

const Blog = db.model("Blog", blogSchema);

async function create(fields) {
  const blog = new Blog(fields);

  await blog.populate({
    path: "author",
  });

  const author = await Author.find(fields.author);

  author.blogs.push(blog._id);

  await author.save();

  await blog.save();

  return blog;
}

async function list(opts) {
  const { tag, author, search, sort } = opts;

  let sortQuery = { date: -1 };

  if (sort) {
    sortQuery = { likes: -1 };
  }

  if (tag) {
    const blog = await Blog.find({
      tags: { $all: [tag] },
    })
      .sort(sortQuery)
      .populate({
        path: "author",
      })
      .select("-img")
      .exec();

    return blog;
  }

  if (author) {
    const blog = await Blog.find({
      author: author,
    })
      .sort(sortQuery)
      .populate({
        path: "author",
      })
      .select("-img")
      .exec();

    return blog;
  }

  if (search) {
    const blog = await Blog.find({
      title: { $regex: search, $options: "i" },
    })
      .sort(sortQuery)
      .populate({
        path: "author",
      })
      .select("-img")
      .exec();

    return blog;
  }

  return await Blog.find({})
    .populate({
      path: "author",
    })
    .sort(sortQuery)
    .select("-img")
    .exec();
}

async function handleLike(userId, blogId, change) {
  const session = await db.startSession();
  let updatedAuthor = null;
  try {
    await session.withTransaction(async () => {
      const blog = await Blog.findById(blogId, null, { session });
      const author = await Author.findWithoutPopulate(userId, null, {
        session,
      });
      console.log(author);
      const likesBefore = blog.likes;
      if (change === 1 && author.liked.indexOf(blogId) === -1) {
        blog.likes = blog.likes + 1;

        author.liked.push(blogId);
      } else if (change === -1 && author.liked.indexOf(blogId) !== -1) {
        blog.likes = blog.likes - 1;
        author.liked.remove(blogId);
      }

      await blog.save();
      await author.save();
      const likesAfter = blog.likes;
      updatedAuthor = author;
    });
  } finally {
    await session.endSession();
  }

  if (updatedAuthor) return updatedAuthor;
}

async function get(id) {
  return await Blog.findById(id);
}

async function getImage(id) {
  return await Blog.findById(id).select("img");
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
