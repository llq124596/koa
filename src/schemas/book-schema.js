const mongoose = require('mongoose')
// 创建一个schema，将数据表的数据结构写入，
const schema = new mongoose.Schema({
    name: String,
    author: String,
    createAt: Date,
    createBy: String,
    updateAt: Date,
    updateBy: String
})
// 创建model，第一个参数是model名称，第二个是上面创建的schema，第三个是数据表名称
module.exports = mongoose.model('book', schema, 'book')