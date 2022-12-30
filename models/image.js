const db = require("../db");
const fs = require("fs");

module.exports = {
  create,
};

const imageSchema = new db.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Image = db.model("Image", imageSchema);

async function create(fields) {
  console.log("baad", fields);
  const image = new Image({
    name: fields.name,
    img: {
      data: fs.readFileSync("uploads/" + fields.file.filename),
      contentType: "image/png",
    },
  });

  await image.save();

  return image;
}
