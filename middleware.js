const { STATUS_CODES } = require("http");

module.exports = {
  cors,
  notFound,
  handleError,
  handleValidationError,
  checker,
};

function cors(req, res, next) {
  // console.log("header", req.headers.origin);
  const origin = req.headers.origin;

  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS, XMODIFY"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );

  next();
}

function checker(req, res, next) {
  // console.group("Request");
  // console.log(req.method, req.url);
  // // console.log(req.body);

  // console.groupEnd();

  next();
}

function handleError(err, req, res, next) {
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || 500;
  const errorMessage =
    err.message || STATUS_CODES[statusCode] || "Internal Error";

  res.status(statusCode).json({ error: errorMessage });
}

function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

function handleValidationError(err, req, res, next) {
  console.log(err.name);
  if (err.name !== "ValidationError") return next(err);

  res.status(400).json({ error: err._message, errorDetails: err.errors });
}
