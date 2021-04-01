const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    username: String,
    password: String,
    roleList: Array,
    createdAt: Date,
    createdBy: String,
    updatedAt: Date,
    updatedBy: String
})
module.exports = mongoose.model('user', schema, 'user')