const mongoose = require("mongoose");
require("dotenv").config();
const dbURI = process.env.modelKey;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Done");
  })
  .catch((e) => console.log(e));

module.exports = mongoose;
