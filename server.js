const express = require("express");

const api = require("./api");
const app = express();

app.use(express.json());

app.get("/blogs", api.listBlog);
app.post("/blogs", api.createBlog);
app.put("/blogs/:id", api.editBlog);
app.delete("/blogs/:id", api.deleteBlog);
app.post("/author", api.createAuthor);
app.post("/comments", api.createComment);
const port = process.env.PORT || 1337;

app.listen(port);
