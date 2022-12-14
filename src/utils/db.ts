const Redis = require('ioredis');
const dotenv = require('dotenv')

dotenv.config();


const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_URL,
    password: process.env.REDIS_PASS
});


module.exports = { redis }