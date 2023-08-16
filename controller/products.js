const mongoose = require("mongoose");
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true
      },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        require:true
    },
    rating:{
        type:String,
        require:true
    },
    markdown: {
        type: String,
        required: true
      },
    slug: {
        type: String,
        required: true,
        unique: true
      },
      sanitizedHtml: {
        type: String,
        required: true
      },
      sorted:{
        type:Number
        },
    created:{
        type:Date,
        default: Date.now,
        required:true,
    }
})

articleSchema.pre('validate', function(next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
  
    if (this.markdown) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
  
    next()
  })
  

const vlmnewUseradmin = mongoose.model('vlmproducts',articleSchema);
module.exports = vlmnewUseradmin;
