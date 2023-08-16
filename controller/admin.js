const mongoose = require("mongoose");

const vlmschemas = new mongoose.Schema({
    vlmid:String,
    vlmname:String,
    vlmprofile:String,
    vlmphone:String,
    vlmemail:String,
    vlmpassword:String,
    vlmverify:Boolean,
    created_at:Date
})

const newUserad = mongoose.model('vlmadmin',vlmschemas);
module.exports = newUserad;