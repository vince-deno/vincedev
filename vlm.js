// deno-lint-ignore-file
const express = require('express');
const passport = require('passport');

const path=require('path');
require('dotenv').config();
const vlmpass = require('./controller/vlmpass')
const expressLayout=require('express-ejs-layouts')
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const expressValidator = require("express-validator");

const bodyParser = require("body-parser");
const { validationResult } = require('express-validator');
// const fs =require('fs');
// const https=require('https')
// const http2=require('http2')


const cors = require("cors");
// const csurf = require('csurf');
const vlmapp =express();


const vlmport=process.env.PORT||9080;
// const vlmhost=process.env.HOST;
const vlmhost="localhost";



// Initialize and configure csurf middleware
// const csrfProtection = csurf({
//     cookie: true
//   });
  
  // Enable CSRF protection middleware
vlmapp.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

vlmapp.use(cookieParser())
// Parse URL-encoded and JSON request bodies
vlmapp.use(bodyParser.urlencoded({ extended: true }));
vlmapp.use(bodyParser.json());
// vlmapp.use(csrfProtection);
vlmapp.use(cors())
vlmapp.use(methodOverride('_method'));
vlmapp.use(require('connect-flash')())
vlmapp.use(function(req,res,next){
    res.locals.messages=require('express-messages')(req,res);
    next();
})
// expres val midlware

// render ejs
vlmapp.use(expressLayout)
const vlmview= path.join(__dirname,"vlmapp/main");
const vlmviews= path.join(__dirname,"vlmapp");

vlmapp.set('views',vlmviews)
vlmapp.set('layout',vlmview)
vlmapp.set('view engine', 'ejs')
vlmapp.use(express.urlencoded({ extended: false }))
vlmapp.use(express.json())
// set vlmviews
vlmapp.use('/',require('./models/vlmrouter'))
vlmapp.use(express.static(path.join(__dirname, 'vlmapp')));

// Use the custom error formatter function
// vlmapp.use((req, res, next) => {
//     validationResult.withDefaults({
//       formatter: (error) => {
//         const { param, msg, value } = error;
//         const namespace = param.split(',');
//         const root = namespace.shift();
//         const formparam = root + namespace.map((name) => `[${name}]`).join('');
  
//         return {
//           param: formparam,
//           msg: msg,
//           value: value,
//         };
//       },
//     })(req, res, next);
//   });


  
  
  
  
vlmapp.get('*',(req,res)=>{
    const vlm={
        title:"Baged",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    // res.render('admin',{vlm})
    res.status(404).render('404',{vlm})
})
// vlmapp.use(loggingMiddleware)
// function loggingMiddleware(req, res, next) {
//     console.log(`${new Date().toISOString()}: ${req.originalUrl}`)
//     next()
//   }
vlmapp.use(passport.initialize());
vlmapp.use(passport.session())
mongoose.set('strictQuery', true);
// add mongodb
mongoose.connect(
    process.env.vlm_uri, 
    {useNewUrlParser: true, useUnifiedTopology: true}
)


// const privateKey = fs.readFileSync('./server.key', 'utf8');
// const certificate = fs.readFileSync('./server.cert', 'utf8');

// const options = {
//     "key": fs.readFileSync("localhost-private.pem"),
//     "cert": fs.readFileSync("localhost-cert.pem")
// }

  
//   const server = https.createServer(options, vlmapp);
//   server.listen(process.env.PORT, () => {
//     console.log(    `VLM :) HTTPS server running on port https://${vlmhost}:${vlmport}`)
//  });

vlmapp.listen(vlmport,()=>{
    console.log( `VLM :) HTTPS server running on port https://${vlmhost}:${vlmport}`)
})