const Redis = require("ioredis");
const redisClient = new Redis({ port: 6379, host: "localhost", password:"Tsolm!571080" });
redisClient.on("connect", () => {console.log("redis connected")})
module.exports = redisClient;
