const path = require('path')
const { error } = require('../config')
const { decodeToken } = require('../util/encryptToken')
const UserModel = require('../schemas/user-schema')
const redis = require('../util/redis')

module.exports = async function auth (ctx, next) {
    let pathObj = path.parse(ctx.request.url)
    const ignorePaths = ['login', 'signup', 'registry']
    let ignore = ignorePaths.some(ignorePath => {
        return ignorePath == pathObj.base
    })
    if (ignore) {
        return await next()
    }
    const token = ctx.headers.token
    if (!token) {
        error.e403()
        return
    }

    const { userid, loginTime } = decodeToken(token)
    if (!userid || userid.length != 24) {
        error.e403()
        ctx.body = {
            code: 403,
            msg: '您的登陆已过期'
        }
        await next()
        return
    }

    const user = await UserModel.findById(userid)
    if (!user) {
        error.e403('token对应的用户不存在')
        return
    }

    const redisToken = await redis.get(userid)
    if (!redisToken || redisToken != token) {
        ctx.body = {
            code: 403,
            msg: '您的登陆已过期'
        }
        // await next()
        // error.e403('您的登陆已过期')
        // await next()
    } else {
        ctx.curUserInfo = {
            userid,
            loginTime
        }
        await next()
    }
}