const Redis = require("ioredis");
const redisClient = new Redis({ port: 6379, host: "redis", password:"3olZuEn4WV5X2Ne9IShEoIez" });
redisClient.on("connect", () => {console.log("redis connected")})
module.exports = redisClient;
