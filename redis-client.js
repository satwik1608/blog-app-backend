const Redis = require("ioredis");
const redis = new Redis();

redis.on("connect", function () {
  console.log("Connected!");
});
module.exports = redis;
