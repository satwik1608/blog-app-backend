const express = require("express");

const Author = require("./models/author");
const Blog = require("./models/blog");
const app = express();

const port = process.env.PORT || 1337;

app.listen(port);

// Blog.create();
Author.create();
