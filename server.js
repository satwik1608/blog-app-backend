const express = require("express");

const api = require("./api");
const app = express();
const auth = require("./auth");
const middleware = require("./middleware");
const cookieParser = require("cookie-parser");
app.use(express.json());

app.use(middleware.cors);
app.use(cookieParser());
app.post("/login", auth.authenticate, auth.login);

app.get("/blogs", api.listBlog);
app.post("/blogs", auth.ensureUser, api.createBlog);
app.put("/blogs/:id", auth.ensureUser, api.editBlog);
app.delete("/blogs/:id", auth.ensureUser, api.deleteBlog);
app.post("/author", api.createAuthor);
app.post("/comments", auth.ensureUser, api.createComment);
app.post("/follow/:id", auth.ensureUser, api.followAuthor);
app.post("/unfollow/:id", auth.ensureUser, api.unfollowAuthor);

app.use(middleware.handleValidationError);
app.use(middleware.handleError);
app.use(middleware.notFound);

const port = process.env.PORT || 1337;

app.listen(port);
