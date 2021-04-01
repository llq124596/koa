module.exports = {
    baseURL: 'http://127.0.0.1',
    port: 3000,
    db: {
        port: '27017', // 数据库端口
        name: 'library', // 数据库名称
        account: null, // 数据库账号
        pass: null // 数据库密码
    },
    loginTimeOut: 60 * 200,
    error: {
        e200 (msg = '请求失败') {
            let err = new Error(msg)
            err.status = 200
            throw err
        },
        e401 (msg = '登陆超时') {
            let err = new Error(msg)
            err.status = 401
            throw err
        },
        e403 (msg = '对不起，您暂未登陆') {
            let err = new Error(msg)
            err.status = 403
            throw err
        },
        e404 (msg = '路径不存在') {
            let err = new Error(msg)
            err.status = 404
            throw err
        },
        e500 (msg = '内部服务器错误') {
            let err = new Error(msg)
            err.status = 500
            throw err
        },
        e502 (msg = '数据库错误') {
            let err = new Error(msg)
            err.status = 502
            throw err
        },
        e504 (msg = '数据库请求超时') {
            let err = new Error(msg)
            err.status = 504
            throw err
        }
    }
}