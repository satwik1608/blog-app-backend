const mongoose = require("mongoose");
require("dotenv").config();
const dbURI =
  "mongodb+srv://satwik12:satwik12@cluster0.byld6up.mongodb.net/test";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Done");
  })
  .catch((e) => console.log(e));

module.exports = mongoose;
