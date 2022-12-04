const mongoose = require("mongoose");

const dbURI = "mongodb://localhost/blogApp";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Done");
  })
  .catch((e) => console.log(e));

module.exports = mongoose;
