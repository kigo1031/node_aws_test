const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memberSchema = new Schema({
    _id: String,
    name: String
})
module.exports = mongoose.model("member",memberSchema);