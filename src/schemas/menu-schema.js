const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    id: Number,
    name: String,
    path: String,
    pid: Number,
    type: String,
    code: String,
    sort: String,
    status: {
        type: String,
        default: '0'
    },
    createdTime: {
        type: Date,
        default: new Date
    },
    updatedTime: {
        type: Date,
        default: new Date
    }
})
module.exports = mongoose.model('menu', schema, 'menu')