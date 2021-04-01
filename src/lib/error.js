exports.errorHandler = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        // 区分不同的情况下不同的记录报错方式，Boom的报错会包含一个err.isBoom，我们首先处理Boom报出来的错误
        // 即便是Boom的报错也区分500以上或以下的，500以下的错误可能是一些正常的报错，
        // 这里区分也是为了记录日志的时候记录一个warn(警告)级别的错误日志就可以了，也方便检查日志的时候筛选
        if (err.isBoom && err.output.statusCode >= 400 && err.output.statusCode < 500) {
            console.warn(err.message)
            ctx.status = err.output.statusCode
            ctx.body = err.message
        } else if (err.isBoom && err.output.statusCode > 500) {
            console.error(err)
            ctx.status = err.output.statusCode
            ctx.body = err.message
        } else if (err.message && err.message.includes('validation failed on')) {
            // 还有一种情况是我们前面有过的api请求的入参错误，
            // 由于我们在这里catch掉了所有的错误，所以这种类型的错误也需要被分类进来
            // 这种错误的格式中有message的固定句式，我们就用这个区分
            console.warn(err)
            ctx.status = 400
            ctx.body = '参数不正确'
        } else {
            console.error(err)
            ctx.status = 500
            ctx.body = 'Internal Server Error'
        } 
        ctx.app.emit('error', err, ctx)
    }
}