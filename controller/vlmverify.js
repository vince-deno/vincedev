const mongoose = require("mongoose");
const vlmschema = new  mongoose.Schema({
    userId:String,
    uniquestring:String,
    created_at:Date,
    expires_at:Date
})

const newUser = mongoose.model('vlmverify',vlmschema);
module.exports = newUser;

