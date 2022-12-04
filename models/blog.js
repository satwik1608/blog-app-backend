const db = require("../db");

const cuid = require("cuid");
module.exports = {
  create,
};
const blogSchema = new db.Schema(
  {
    _id: { type: String, default: cuid },
    title: { type: String, required: true },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    img: { type: String },
    likes: { type: Number, default: 0 },
    author: { type: String },
    rating: { type: Number, default: 0.0 },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Blog = db.model("Blog", blogSchema);

async function create() {
  const blog = new Blog({
    title: "Top Anime of 2022",
    tags: ["Anime"],
    author: " Satwik Kashyap ",
    content: " Attack On Titan season 4 part 2",
  });

  const result = await blog.save();

  console.log(result);
}
