module.exports = function writeByPromise () {
    return async function (ctx, next) {
        if (ctx.writeByPromise) return await next()

        ctx.writeByPromise = async function (promise) {
            try {
                let result = await promise
                let msg = result.msg
                delete result.msg
                if (result.code) {
                    ctx.resMessage(result.code, result, msg || null)
                } else if (Array.isArray(result)) {
                    ctx.resMessage(200, { list: result }, msg || null)
                } else {
                    ctx.resMessage(200, result, msg || null)
                }
            } catch (err) {
                if (err && err.code) {
                    let code = err.code.code || err.code
                    let msg = err.msg
                    delete err.code
                    delete err.msg
                    ctx.resMessage(code, err, msg || null)
                } else {
                    ctx.app.emit('error', err, ctx)
                    ctx.resMessage(-20001, err, msg || null)
                }
            }
        }
        await next()
    }
}