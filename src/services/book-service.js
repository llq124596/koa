const Boom = require('boom')
const bookModel = require('../schemas/book-schema')
class BookService {
    async get (searchText) {
        const query = {}
        if (searchText) {
            // 模糊搜索书名，作者
            query.$or = [{ name: new RegExp(searchText) }, { author: new RegExp(searchText)}]
        }
        // bookModel为book表，find方法查找数据
        const res = await bookModel.find(query)
        console.log(res)
        return res
    }
    async create (name, author) {
        const book = await bookModel.find({ name })
        if (book) {
            throw Boom.badRequest('书本名称已存在')
        }
        const data = {
            name,
            author,
            createAt: new Date(),
            createBy: 'default'
        }
        await bookModel.create(data)
    }
}
module.exports = { BookService }