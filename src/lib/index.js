const _ = require('lodash')
const Joi = require('joi')
exports.validatorInterceptor = (schemas, options) => {
    return async (ctx, next) => {
        try {
            // 循环schemas 中所有的key
            for (const key of _.keys(schemas)) {
                await Joi.validate(_.get(ctx.request, key), _.get(schemas, key), options || {})
            }
        }
        catch (err) {
            ctx.throw(400, `validation failed on: ${err.message}`)
        }
        await next()
    }
}