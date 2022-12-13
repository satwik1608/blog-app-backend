const express = require("express");

const api = require("./api");
const app = express();
// const auth = require("./auth");
const middleware = require("./middleware");
const cookieParser = require("cookie-parser");
app.use(express.json());

app.use(middleware.cors);
app.use(cookieParser());
// app.post("/login", auth.login);

app.get("/blogs", api.listBlog);
app.get("/blogs/:id", api.getBlog);
app.post("/blogs", api.createBlog);

app.put("/blogs/:id", api.editBlog);
app.delete("/blogs/:id", api.deleteBlog);
app.post("/author", api.createAuthor);
app.get("/author/:id", api.getAuthor);
app.post("/comments", api.createComment);
app.post("/follow/:id", api.followAuthor);
app.post("/unfollow/:id", api.unfollowAuthor);

app.use(middleware.handleValidationError);
app.use(middleware.handleError);
app.use(middleware.notFound);

const port = process.env.PORT || 1337;

app.listen(port);
