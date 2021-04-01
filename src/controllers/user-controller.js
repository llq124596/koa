const { UserService } = require('../services/user-service')
const { createToken, encrypt } = require('../util/encryptToken')
const redis = require('../util/redis')
const md5 = require('blueimp-md5')
const userService = new UserService()

class UserController {
    /**
     * 注册
     * @param {*} ctx 
     */
    static async registry (ctx) {
        const { username, password } = ctx.request.body
        await userService.registry(username, password)
        ctx.body = {
            message: '注册成功'
        }
    }
    /**
     * 查询所有用户
     * @param {*} ctx 
     */
    static async queryUser (ctx) {
        const { username } = ctx.request.body
        const res = await userService.queryUser(username)
        if (res) {
            ctx.body = {
                code: 200,
                data: res,
                msg: '该用户名已被注册'
            }
        } else {
            ctx.body = {
                code: 200,
                data: res,
                msg: '该用户名未被注册'
            }
        }
    }
    /**
     * 登陆
     * @param {*} option 
     */
    static async login (option) {
        return new Promise(async (resolve, reject) => {
            const res = await userService.login(option.username, md5(option.password))
            if (!res) {
                reject({
                    code: 10003,
                    msg: '用户不存在'
                })
                return
            }
            if (res && (res.password == md5(option.password))) {
                const token = createToken(res._id)
                // 将token存到redis(key userid, value token)
                const saveToken = await redis.set(res._id.toString(), token, 'EX', 60 * 300)

                if (saveToken == 'OK') {
                    resolve({
                        userInfo: {
                            id: res._id,
                            username: res.username,
                            roleList: res.roleList
                        },
                        token
                    })
                }
            } else {
                reject({
                    code: 10000,
                    msg: '密码错误'
                })
            }
        })
    }
}
module.exports = { UserController }