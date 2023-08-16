const mongoose = require("mongoose");
const vlmschema = new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    vlmprofile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    vlmphone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },


    vlmverify:{
        type:Boolean,
        require:true
    },
    vlmuserlocation:{
        type:String,
        require:true
    },
    created:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

const newUser = mongoose.model('vlmusers',vlmschema);
module.exports = newUser;