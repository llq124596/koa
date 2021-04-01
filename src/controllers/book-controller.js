const { BookService } = require('../services/book-service')

class BookController {
    // controller 层我们使用static函数，静态函数是纯函数，没有状态，也使得在使用的时候不需要new可以直接使用
    // ctx 是koa框架用户传输相关参数和返回一个变量，这次我们获取的是全部书本的内容，没有入参，所以不需要组织
    static async get (ctx) {

        const searchText = ctx.request.query.text
        const bookService = new BookService()
        const res = await bookService.get(searchText)
        ctx.body = res
    }
    static async create (ctx) {
        const { name, author } = ctx.request.body
        console.log(name, author)
        const bookService = new BookService()
        await bookService.create(name, author)
        ctx.body = {
            message: 'create success'
        }
    }
    
}
module.exports = { BookController }