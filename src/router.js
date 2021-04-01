const Router = require('koa-router')
const router = new Router()
const Joi = require('joi')
const multer = require('@koa/multer')
const path = require('path')
const redis = require('./util/redis')
const { validatorInterceptor } = require('./lib')
const { query, save, update, updateOne, deleteOne } = require('./util/dataUtil')

const { BookController } = require('./controllers/book-controller')
const { UserController } = require('./controllers/user-controller')
// 数据验证
const bookSearchSchema  = {
    query: Joi.object().keys({
        // 此处要求入参可以有search_text的参数，且必须是字符串
        text: Joi.string()
    })
}
const bookCreateSchema = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        author: Joi.string().required()
    })
}
router.get('/', ctx => ctx.body = 'web api running successfully')
router.get('/api/books', BookController.get)
router.get('/api/book/search', validatorInterceptor(bookSearchSchema), BookController.get)
router.post('/api/book/create', validatorInterceptor(bookCreateSchema), BookController.create)

const registrySchema = {
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
}
router.post('/api/login', _login)
router.post('/api/registry', validatorInterceptor(registrySchema), UserController.registry)
router.post('/api/queryUser', UserController.queryUser)
router.post('/api/loginOut', _loginOut)

async function _login (ctx) {
    let { username, password } = ctx.request.body
    if (!username || !password) {
        return ctx.resMessage(-10000)
    }
    const option = { username, password }
    let promise = UserController.login(option)
    await ctx.writeByPromise(promise)
}

async function _loginOut (ctx) {
    console.log(ctx.curUserInfo)
    const { userid } = ctx.curUserInfo

    const delToken = await redis.del(userid)
    if (delToken === '1') {
        return ctx.resMessage(200)
    }
    await ctx.writeByPromise({
        msg: '退出成功！'
    })
}
// 上传文件存放路径。及文件命名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/public'))
    },
    filename: function (req, file, cb) {
        let type = file.originalname.split('.')[1]
        cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`)
    }
})
const limits = {
    fields: 10,
    fileSize: 500 * 1024,
    files: 1
}
const upload = multer({ storage, limits })
router.post('/api/upload', upload.single('file'), async (ctx, next) => {
    ctx.body = {
        code: '200',
        data: ctx.file,
        msg: '成功'
    }
})


module.exports = router