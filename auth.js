const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;

const Author = require("./models/author");
const autoCatch = require("./lib/auto-catch");

const jwtSecret = process.env.JWT_SECRET || "mark it zero";
const adminPassword = process.env.ADMIN_PASSWORD || "iamthewalrus";
const jwtOpts = { algorithm: "HS256", expiresIn: "1d" };

passport.use(adminStrategy());
const authenticate = passport.authenticate("local", { session: false });

module.exports = {
  authenticate,
  login: autoCatch(login),
  ensureUser: autoCatch(ensureUser),
};

async function login(req, res, next) {
  console.log("wowo");
  const token = await sign({ username: req.user.username });

  res.cookie("jwt", token, { httpOnly: false });

  res.json({ success: true, token: token });
  console.log(token);
  console.log(res);
}

async function ensureUser(req, res, next) {
  // console.log(req.cookies);
  const jwtString = req.headers["x-auth-token"] || req.cookies.jwt;
  // console.log(jwtString);
  const payload = await verify(jwtString);

  if (payload.username) {
    req.user = payload;
    if (req.user.username === "admin") req.isAdmin = true;
    return next();
  }

  const err = new Error("Unauthorized");
  err.statusCode = 401;
  next(err);
}

async function sign(payload) {
  const token = await jwt.sign(payload, jwtSecret, jwtOpts);
  return token;
}

async function verify(jwtString = "") {
  jwtString = jwtString.replace(/^Bearer /i, "");

  try {
    const payload = await jwt.verify(jwtString, jwtSecret);
    return payload;
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
}

function adminStrategy() {
  return new Strategy(async function (username, password, cb) {
    const isAdmin = username === "admin" && password === adminPassword;
    if (isAdmin) return cb(null, { username: "admin" }); // potential bug to be resolved

    try {
      const user = await Author.get(username);
      if (!user) return cb(null, false);

      const isUser = await bcrypt.compare(password, user.password);
      if (isUser) return cb(null, { username: user.username });
    } catch (err) {}

    cb(null, false);
  });
}
