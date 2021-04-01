const Redis = require('ioredis')

const cfg = {
    port: 6379,
    host: '127.0.0.1',
    db: 0
}

const newRedis = new Redis(cfg)
newRedis.on('connect', () => {
    console.log(new Date().toLocaleString(), 'Redis连接成功')
})
module.exports = newRedis