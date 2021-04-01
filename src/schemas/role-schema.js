const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name: String,
    menuList: Array,
    status: {
        type: String,
        default: '1'
    },
    createdTime: new Date
})
module.exports = mongoose.model('role', schema, 'role')