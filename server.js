const express = require("express");

const api = require("./api");
const db = require("./db");
const mul = require("./multer");
const app = express();

const middleware = require("./middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const auth = require("./auth");
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(middleware.cors);
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/login", auth.authenticate, auth.login);

app.get("/blogs", api.listBlog);
app.get("/blogs/:id", api.getBlog);
app.post("/blogs", auth.ensureUser, api.createBlog);
app.put("/blogs/:id", auth.ensureUser, api.editBlog);
app.delete("/blogs/:id", auth.ensureUser, api.deleteBlog);

app.post("/author", api.createAuthor);
app.get("/authors", api.getAuthors);
app.get("/author", api.getAuthorId);
app.put("/author/:id", api.updateAuthor);

app.get("/author/:id", api.getAuthor);

app.get("/comments", api.getComment);
app.post("/comments", auth.ensureUser, api.createComment);
app.put("/comments/:id", auth.ensureUser, api.updateComment);

app.post("/follow/:id", auth.ensureUser, api.followAuthor);
app.post("/unfollow/:id", auth.ensureUser, api.unfollowAuthor);
app.post(
  "/image",

  mul.upload.single("testImage"),
  api.uploadImage
);
app.use(middleware.handleValidationError);
app.use(middleware.handleError);
app.use(middleware.notFound);

const port = process.env.PORT || 1337;

app.listen(port);
