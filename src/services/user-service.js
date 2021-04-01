const md5 = require('blueimp-md5')
const Boom = require('boom')
const userModel = require('../schemas/user-schema')
const redis = require('../util/redis')
const DataUtile = require('../util/dataUtil')

class UserService extends DataUtile {
    constructor() {
        super(DataUtile)
    }
    async registry (username, password) {
        const user = await userModel.findOne({ username })
        if (user) {
            throw Boom.badRequest('用户名已存在')
        }
        const data = {
            username,
            password: md5(password),
            createdAt: new Date(),
            createdBy: 'user registry'
        }
        await userModel.create(data)
    }
    async queryUser (username) {
        const res = await userModel.findOne({ username })
        return res
    }
    async login (username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await userModel.findOne({ username })
                resolve(res)
            } catch (err) {
                reject(err)
            }
        })
    }
}
module.exports = { UserService }