const Koa = require('koa')
const app = new Koa()
const serve = require('koa-static')
const router = require('./router')
// 跨域
const cors = require('koa-cors')
const mongoose = require('mongoose')
// 无法解析Post请求，需要引入 koa-bodyparser
const bodyParser = require('koa-bodyparser')
// 生成日志
const { createLogger } = require('./lib/logger')
// 记录报错
const { errorHandler } = require('./lib/error') 
const auth = require('./lib/koa-auth')
const writeByPromise = require('./lib/koa-write-by-promise')()
const resMessage = require('./lib/koa-message')()
mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true })
app
    .use(serve('.'))
    .use(bodyParser())
    .use(cors())
    .use(createLogger)
    .use(errorHandler)
    .use(auth)
    .use(resMessage)
    .use(writeByPromise)
    .use(router.routes())
    .use(router.allowedMethods())
    .on('error', (err, ctx) => {
        console.error(new Date().toLocaleString(), err)
    })
    
app.listen(3000)
console.log('web server run on port 3000, 3000端口已开启')