const db = require("../db");
const cuid = require("cuid");

module.exports = {
  create,
};
const authorSchema = new db.Schema({
  _id: { type: String, default: cuid },
  name: { type: String },
  category: [
    {
      type: String,
    },
  ],
  rating: { type: Number },
  imgThumb: { type: String },
  img: { type: String },
  description: { type: String },
  blogs: [
    {
      type: String,
      ref: "Blog",
      index: true,
      require: true,
    },
  ],
});

const Author = db.model("Author", authorSchema);

async function create() {
  const author = new Author({
    name: "Satwik",
    category: ["Anime", "Action"],
    rating: "5",
    description: " Really good anime blogger ",
    blogs: ["clb9btodg0000louucjmubrhq"],
  });

  const result = await author.save();
  await result.populate("blogs");

  console.log(result);
}
