const Redis = require('ioredis')
const redisClient = new Redis({port: 8080, host:'localhost'})

module.exports = redisClient