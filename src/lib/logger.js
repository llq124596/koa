const _ = require('lodash')
const moment = require('moment')

exports.createLogger = async (ctx, next) => {
    let requestLog = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]request details: ${JSON.stringify(ctx.request)}`
    if (!_.isEmpty(ctx.request.body)) {
        requestLog += `, request body: ${JSON.stringify(ctx.request.body)}`
    }
    console.log(requestLog)
    await next()
}