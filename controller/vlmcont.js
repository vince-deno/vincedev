// deno-lint-ignore-file
// const passport= require("passport");
// const admin = require('firebase-admin');
const newUser = require('./user');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
const {v4:vlmuuid} = require('uuid')
const newUsevery = require('./vlmverify');
const newUserad = require('./admin');
const userfire = require('./firebase');
const  vlmnewUseradmin = require('./products');
const path=require('path');
// env

require("dotenv").config();
let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.vlm_mail,
      pass: process.env.vlm_pass
    }
  });

/**
 * admin page
 */
function vlmchecksadmin(){
    // check jwt token prevent any cookie stealing from other browsers set the sesion id 
    // genarate a new password and send it to admn to verify.
    // checks if email is client redirect to products with the selectect product view
    newUserad.findOne({}).then(async (data)=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    })

}
exports.vlmadmin=async(req,res)=>{
    const vlm={
        title:"Baged",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    // console.log(req.session.id)
    // vlmnewUseradmin


    await res.render('admin',{vlm})

}

exports.vlmview=async(req,res)=>{
    const vlm={
        title:"Baged",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    try {
        const id = req.query.vlmid; 
  
        // Use the query parameters in your application logic
        // const searchTerm = query;
        const customer= await newUser.findOne({_id:id})
        console.log(customer)
        await res.render('view',{vlm,customer});
    } catch (error) {
        console.log(error)
    }
    // console.log(req.session.id)

}

/**
 * homepage
 */

exports.vlmhome=async(req,res)=>{
    const vlm={
        title:"Baged",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    // const array=[{
    //     title:"shoe",
    //     slug:"",
    //     marked:"",
    //     country:"",
    //     amount:"",
    //     rating:"",
    //     sorting:"",
    //     createdAt:new Date()
    // }]
    const array=[{
        title:"Upgrade to Iphone 12 plus",
        value:3000,
        sorted:0,
        country_bill_img:"myimage",
        smvalues:"",
        created_at:new Date(),
    }]
    await res.render('home',{vlm,array})
}


/**
 * login get
 */

exports.vlmlog=async(req,res)=>{
    const vlm={
        title:"Login",
        description:"Buy any thing eg clothes cars electronics other products"
    }


   await res.render("login",{vlm,vlmerr:null,dis:"display:none;",vlm_client_id: null,vlm})
}



/**
 * reg get
 */

exports.vlmreg=async(req,res)=>{
    const vlm={
        title:"Signin",
        description:"Buy any thing eg clothes cars electronics other products"
    }
   await res.render("signup",{vlmerr:null,dis:"display:none;",vlm})
}

/**
 * reg post
 */

exports.vlmpostreg=async(req,res)=>{
    const vlm={
        title:"signup",
        description:"Buy any thing eg clothes cars electronics other products"
    }
 
    // routing
    let {email,password}=req.body;
    email=email.trim();
    password=password.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    // const passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[,\.])[A-Za-z\d,\.]{8,}$/;


    if(email==""||password==""){
        res.render("signup",{vlmerr:'All inputs are empty!',vlm,dis:"display:block;"});
    }else if(!emailRegex.test(email)){
        res.render("signup",{vlmerr:`${vlmmaskEmail(email)} is invalid please check your email !`,vlm,dis:"display:block;"});
    }
    else if(password<8){
        res.render("signup",{vlmerr:'Enter a secure password eg [uppercaseletters,specialcharters,lowercase]',vlm,dis:"display:block;"});
    }
    else if(!/[A-Z]/.test(password)){
        res.render("signup",{vlmerr:'Check if password contains at least one digit',vlm,dis:"display:block;"});
    }
    else if(!/[a-z]/.test(password)){
        res.render("signup",{vlmerr:'Check if password contains at least one uppercase letter',vlm,dis:"display:block;"});
    }
    else if(!/[0-9]/.test(password)){
        res.render("signup",{vlmerr:'Check if password contains at least one lowercase letter',vlm,dis:"display:block;"});
    }
    else if(!/[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]/.test(password)){
        res.render("signup",{vlmerr:'Check if password contains at least one special character',vlm,dis:"display:block;"});
    }
    else{
        newUser.find({email}).then(result=>{
            if(result.length){
                res.render("signup",{vlmerr:`${vlmmaskEmail(email)} Email already exists`,vlm,dis:"display:block;"});
                // checking if user already exists        const filter = { email: email ,password:password};

            }else{
                // save user
                const saltRounds =10;
                bcrypt.hash(password,saltRounds).then(result=>{
                    // save credentials
                    const ri=new newUser({
                        name:email,
                        vlmprofile:"no photo",
                        email:email,
                        vlmphone:"no phonenumber",
                        password:result,
                        vlmuserlocation:"string to locate",
                        vlmverify:false
                    });
                    ri.save().then(result=>{
                        // send email
                      vlmsend(result,res);
                    })
                }).catch(err=>{
                    console.log(err)
                    res.json({status:"Failed, pls try again"})
                })
            }
        }).catch(err=>{
            console.log(err)
            res.json({status:"Failed, pls try again"})
        })


    }
}
   
const  vlmsend=({_id,email},res)=>{
    const cururl="http://localhost:443"
    const vlmstr= vlmuuid() +_id;
    
    const mail= {
        from:process.env.vlm_email,
        to:email,
        subject:"verify your email address",
        html:`<p>Verify your email to complete signup click this link<br>
          <a href=${cururl +"/verify"+ "/"+_id + "/"+vlmstr}>
          Click Here...</a></p>`
    }
    const saltRounds =10;
    bcrypt.hash(vlmstr,saltRounds).then((hash)=>{
        const newvery =new newUsevery({
            userId:_id,
            uniquestring:hash,
            created_at:Date.now(),
            expires_at:Date.now() + 21600000
        })
        newvery.save().then(()=>{
            transporter.sendMail(mail).then(()=>{
                console.log("pending... verification sent")
                res.redirect(301,'/login')
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((error)=>{
            console.log(error)
        })
    }).catch((err)=>{
        console.log(err)
    })
}



/**
 * reg post log
 */
async function vlmsendEmail({_id,email}, subject, text,res) {
    // Create a transporter using the emailConfig settings
  const cururl="http://localhost:443"
  const vlmstr= vlmuuid() +_id;
  
  const mail= {
    from:process.env.vlm_email,
    to:email,
      subject:subject,
      html:`
      <p>Verify your email to complete signup click this link
      <br>
      Login Using: ${text}
      <br>
      <br>
      <br>
        <a href=${cururl +"/verify"+ "/"+_id + "/"+vlmstr}>
        Click Here...</a></p>`
  }
  const saltRounds =10;
  bcrypt.hash(vlmstr,saltRounds).then((hash)=>{
      const newvery =new newUsevery({
          userId:_id,
          uniquestring:hash,
          created_at:Date.now(),
          expires_at:Date.now() + 21600000
      })
      newvery.save().then(()=>{
        transporter.sendMail(mail).then(()=>{
               const vlmviews= path.join(__dirname,"../vlmapp/add");
               const vlm={
                title:"failed to add admin",
                description:"Buy any thing eg clothes cars electronics other products"
            }
               res.render(vlmviews,{vlmerr:'verification is sent check your inbox !',vlm,vtitle:vlm.title,dis:"display:block;background:#00ff00;color:blue;",vlm_client_id:"108264616911711661880" });

          }).catch((err)=>{
              console.log(err)
          })

      }).catch((error)=>{
          console.log(error)
      })
  }).catch((err)=>{
      console.log(err)
  })
  // Setup email data

  // Send the email

}






exports.vlmpostlog=async(req,res)=>{
    const vlm={
        title:"login failed",
        description:"Buy any thing eg clothes cars electronics other products"
    }
        // routing login
        let {email,password}=req.body;
        email=email.trim();
        password=password.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const dig=!/[A-Z]/.test(password)
        const upper= !/[a-z]/.test(password)
        const lower=!/[0-9]/.test(password)
        const special=!/[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]/.test(password)
    
        if(email==""||password==""){
            res.render("login",{vlmerr:'All inputs are empty!',vlm,dis:"display:block;",vlm_client_id:"108264616911711661880" });
        }else if(!emailRegex.test(email)){
            res.render("login",{vlmerr:`${vlmmaskEmail(email)} is invalid please check your email again !`,vlm,dis:"display:block;",vlm_client_id:"108264616911711661880" });
        }
        else if(password<8){
            res.render("login",{vlmerr:'Enter a secure password eg [uppercaseletters,specialcharters,lowercase]',vlm,dis:"display:block;",vlm_client_id: "108264616911711661880" });
        }
        else if(dig){
            res.render("login",{vlmerr:'Check if password contains at least one digit',vlm,dis:"display:block;",vlm_client_id: "108264616911711661880" });
        }
        else if(upper){
            res.render("login",{vlmerr:'Check if password contains at least one uppercase letter',vlm,dis:"display:block;",vlm_client_id: "108264616911711661880" });
        }
        else if(lower){
            res.render("login",{vlmerr:'Check if password contains at least one lowercase letter',vlm,dis:"display:block;",vlm_client_id: "108264616911711661880" });
        }
        else if(special){
            res.render("login",{vlmerr:'Check if password contains at least one special character',vlm,dis:"display:block;",vlm_client_id: "108264616911711661880" });
        }else{
            // vlm check if email exist for admin and client
            vlmcheckEmailExistence(email,res,password)

    
        }
    }
    function vlmcheckEmailExistence(email, res,password) {
        newUserad.find({ email }) // Use the correct method name: find()
        .then(data => {
            if (data.length > 0) {
                // console.log('Email exists:', data);
                const foundUser = data.find(user => user.vlmemail === email);
                if (!foundUser) {
                    checkslog(email,password,res)

                } else {
                    if (foundUser) {
                        if (foundUser.vlmverify === false) {
                            const vlm={
                                title:"failed login admin",
                                description:"Buy any thing eg clothes cars electronics other products"
                            }
                            res.render('login',{vlmerr:`verification is sent to ${vlmmaskEmail(email)} check your gmail inbox !`,vlm,vtitle:vlm.title,dis:"display:block;background:#00ff00;color:blue;" });   
        
                            // console.log('Email exists but is verified:', foundUser);
                            // You can perform further actions here, such as sending a response to the client/admin
                        }else{
                            bcrypt.compare(password,foundUser.vlmpassword).then(async (result)=>{
                                if (result === true) {
                                    res.redirect('/admin')
                                    // Proceed with further actions, such as granting access to the user
                                } else {
                          
                                        const vlm={
                                            title:"failed login admin",
                                            description:"Buy any thing eg clothes cars electronics other products"
                                        }
                                        res.render('login',{vlmerr:`your password is incorrect ,try again!`,vlm,vtitle:vlm.title,dis:"display:block;" });   
                                    }
                         
                            })
                        }
                    }
                }
    
                // You can perform further actions here, such as sending a response to the client/admin
            } else {
                console.log('Email does not exist');
                // You can perform further actions here, such as sending a response to the client/admin
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // You can handle errors here, such as sending an error response
        });

    }

    function checkslog(email,password,res){
        newUser.find({ email }).then(data => {
            const foundUser = data.find(user => user.email === email);
            if(!foundUser){
                const vlm={
                    title:"failed login user",
                    description:"Buy any thing eg clothes cars electronics other products"
                }
                res.render("login",{vlmerr: `${vlmmaskEmail(email)} your email dont exist please signup`,vlm,dis:"display:block;",vlm_client_id:"108264616911711661880" });
            }else{
                if (foundUser.vlmverify==false) {
                    const vlm={
                        title:"failed login admin",
                        description:"Buy any thing eg clothes cars electronics other products"
                    }
                    res.render('login',{vlmerr:`verification is sent to ${vlmmaskEmail(email)} check your gmail inbox !`,vlm,vtitle:vlm.title,dis:"display:block;background:#00ff00;color:blue;" });   
                }else{
                    // match pass
                    bcrypt.compare(password,foundUser.password).then((result)=>{
                        if (result === true) {
                            res.redirect('/products')
                            // Proceed with further actions, such as granting access to the user
                        } else {
                  
                                const vlm={
                                    title:"failed login admin",
                                    description:"Buy any thing eg clothes cars electronics other products"
                                }
                                   res.render('login',{vlmerr:'Incorect password please try again !',vlm,vtitle:vlm.title,dis:"display:block;"});
                        }
                    })
                }
            }   

     
        })
    }
    function vlmmaskEmail(email) {
        const parts = email.split('@');
        if (parts[0].length <= 1) {
          return email; // Cannot mask if username has only one character
        }
        
        const maskedUsername = parts[0][0] + '*'.repeat(parts[0].length - 2) + parts[0][parts[0].length - 1];
        return maskedUsername + '@' + parts[1];
      }
    
/**
 * vlm verify email
 */

exports.vlmvery=async(req,res)=>{
    const o= req.params.id1
    const vlm= req.params.id2
    res.redirect(`/submit/${o}/${vlm}`);

}

/**
 * vlm verify email
 */

exports.vlmverify=async(req,res)=>{
    const userId= req.params.userId
    const vlmstr= req.params.vlmstr
    // if true 
    const vlm={
        title:"signup",
        description:"Buy any thing eg clothes cars electronics other products"
    }
 
    newUsevery.find({userId}).then((data)=>{
        if(data.length>0){
            const {expires_at}=data[0];
            const vlmhash= data[0].uniquestring;
            if (expires_at<Date.now()) {
                newUsevery.deleteOne({userId}).then((data)=>{
                    newUser.deleteOne({_id:userId}).then(()=>{
                       newUserad.deleteOne({_id:userId}).then(()=>{
                        const msg= 'Link expired check Inbox.'
                        res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:#f9ff00;font-size:0.9em;",vlm});
                       });
                    }).catch((err)=>{
                        console.log(err)
                        const msg= 'Clearing user unique string failed.'
                        res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:#f9ff00;font-size:0.9em;",vlm});
                    })
                }).catch((err)=>{
                    console.log(err)
                    const msg= 'An error occurred while checking the user.'
                    res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:#f9ff00;font-size:0.9em;",vlm});
                })
            }else{
                bcrypt.compare(vlmstr,vlmhash).then((dt)=>{
                    newUser.updateOne({_id:userId},{vlmverify:true}).then((dt)=>{
                        newUserad.updateOne({_id:userId},{vlmverify:true}).then((dt)=>{
                            newUsevery.deleteOne({userId}).then(()=>{
                                let msg ="verification is done."
                                res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:#fff;font-size:0.9em;",vlm});
                            }).catch((err)=>{
                            console.log(err)
                            let msg ="An error occured when finalizing seccesfull verification."
                            res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:#f9ff00;font-size:0.9em;",vlm});
                        })
                        })
                    }).catch((err)=>{
                        console.log(err)
                        let msg ="An error occured when updating user..."
                        res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:#f9ff00; font-size:0.9em;",vlm});
                    })
                })
            }
        }else{
            const msg= ' you have already verified your account '
            res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:#f9ff00;font-size:0.9em;",vlm});
        }
    }).catch((err)=>{
        console.log(err)
        const msg= 'An error occurred while checking the user.'
        res.render('vlmsuccess', {vlmbtn: true ,msg:msg,color:"color:red;font-size:0.9em;",vlm});
    })

    
}

/**
 * vlm newl
 * 
 */
exports.vlmnew=async(req,res)=>{
    const vlm={
        title:"New Admin",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('add.ejs',{vlm,vlmerr:null,dis:"display:none;",vtitle:'admin'})
}

/**
 * vlm all product view
 * 
 */

exports.vlmprod=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('products',{vlm})
}

/**
 * vlm admin users
 * 
 */

exports.vlmadminuser=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    const itemsPerPage = 1; // Set the number of items per page
    const currentPage = parseInt(req.query.page) || 1;
    const users = await newUserad.find().skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)

    const totalUsers = await newUserad.countDocuments();
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    // const user = await newUser.find().skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)
      

    res.render('adminusers',{vlm,users,totalPages,currentPage})
}

/**
 * vlm users
 * 
 */

exports.vlmusers=async(req,res)=>{
    const itemsPerPage = 7; // Set the number of items per page
    const currentPage = parseInt(req.query.page) || 1;
    const users = await newUser.find().skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)

    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    const totalUsers = await newUser.countDocuments();
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    // const user = await newUser.find().skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage)
      



    res.render('users',{vlm,users,totalPages,currentPage})

   
}

/**
 * vlm agents
 * 
 */

exports.vlmagent=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('agents',{vlm,vtitle:'agent'})
}

// Routes

exports.vlmrouters=async(req,res)=>{
        // Simulate a lost database connection
        mongoose.disconnect();
        // Redirect to the 404 page
        res.redirect('/404');
}
  


exports.vlmagentz=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    // const vlmviews= path.join("../",__dirname,"pages/form");
    res.render("sop",{vlm,vtitle:'agent',vlmerr:null,dis:'display:none;'})
}

exports.vlmretailz=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    // const vlmviews= path.join(__dirname,"pages/form1");
    res.render("form1",{vlm,vtitle:'retailer',vlmerr:null,dis:'display:none;'})
}

exports.vlmusersz=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    // const vlmviews= path.join(__dirname,"pages/form2");
    res.render("form2",{vlm,vtitle:'user',vlmerr:null,dis:'display:none;'})
}

/**
 * vlm agents
 * 
 */

exports.vlmretail=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('retailers',{vlm})
}
/**
 * vlm prof
 * 
 */
exports.vlmprofile=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('users-profile',{vlm})
}

/**
 * vlm add
 * 
 */

exports.vlmadd=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('add',{vlm})
}

exports.vlmfd=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('fd',{vlm})
}
exports.vlmadds=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    const title =''
    const slug='';
    const content='';
    res.render('supermarkect',{vlm,title,slug,content,dis:null,vlmerr:null,errors:null});
}
const { body,matchedData, validationResult } = require('express-validator');

exports.vlmaddspost=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    // const fg =req.checkBody('title','title must have a value')
    const title =req.body.title;
    const slug=req.body.slug.replace('/\s+/g','=').toLowerCase();
    if(slug=="") slug==title.replace('/\s+/g','=').toLowerCase();
    const content= req.body.content;
    console.log(slug)
    // if(slug=="")slug=title.replace('/\s+/g','=').toLowerCase();
    // const content=req.body.content;
    // const { name } = req.body;
  
    // If validation passes, process the submitted data, e.g., save it to a database
  
    // res.send('Supermarket added successfully.');
  
    // If validation passes, process the submitted data, e.g., save it to a database
    if (title=="") {
        // console.log("undefined title")
        res.render('supermarkect',{vlm,vlmerr:"title is udefined",dis:"display:block;"})
    }  
    // const errors = validationResult(req);
    // if (title==null||content==null) {
    //     if (!errors.isEmpty()) {
    //         // Handle validation errors here
    //       //   return res.status(400).json({ errors: errors.array() });
    //       console.log(errors)
    //         res.render('supermarkect',{vlm,errors:errors.array()});
    //       }
    // }
    // res.send('Supermarket added successfully.');
    // console.log(title,slug,content);
}

exports.vlmag=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('agrovet',{vlm})
}


exports.vlmfw=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('fash',{vlm})
}


exports.vlmmotor=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('spares',{vlm})
}


exports.vlmelect=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('phone',{vlm})
}


exports.vlmhard=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('hardware',{vlm})
}

exports.vlmganes=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('games',{vlm})
}

exports.vlmbooks=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('books',{vlm})
}

exports.vlmbaby=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('baby',{vlm})
}

exports.vlmlp=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('latest',{vlm})
}
exports.vlmsd=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('second',{vlm})
}
exports.vlmt=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('trade',{vlm})
}

exports.vlmth=async(req,res)=>{
    const vlm={
        title:"All products",
        description:"Buy any thing eg clothes cars electronics other products"
    }
    res.render('health',{vlm})
}

exports.vlmpostadd=async(req,res)=>{
    const vlm={
      title:"new admin",
      description:'adding new admin'
    }
    const {email,phonenumber}= req.body;
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(email==""){
        res.render("add",{vlmerr:'email input is empty!',vlm,dis:"display:block;",vtitle:'admin' });
    }else if(!emailRegex.test(email)){
        res.render("add",{vlmerr:'Invalid email address !',vlm,dis:"display:block;",vtitle:'admin'});
    }
    else if(phonenumber==""){
        res.render("add",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;", vtitle:'admin'});
    }else if(phonenumber.length>11){
        res.render("add",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;",vtitle:'admin' });
    }else{
        // add admin send verification link to lucy
        // console.log(email,phonenumber)
        
        // newUserad.find({}).then((dt)=>{
        //     console.log(dt[0],dt[1])
        // })
    }
  }

  exports.vlmagents=async(req,res)=>{
    const vlm={
      title:"new client",
      description:'adding newclient'
    }
    const {email,phonenumber}= req.body;
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(email==""){
        res.render("form1",{vlmerr:'email input is empty!',vlm,dis:"display:block;",vtitle:'client' });
    }else if(!emailRegex.test(email)){
        res.render("form1",{vlmerr:'Invalid email address !',vlm,dis:"display:block;",vtitle:'client'});
    }
    else if(phonenumber==""){
        res.render("form1",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;", vtitle:'client'});
    }else if(phonenumber.length>11){
        res.render("form1",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;",vtitle:'client' });
    }else{
        console.log(email,phonenumber)
    }
  }
  exports.vlmretails=async(req,res)=>{
    const vlm={
      title:"new reatailor",
      description:'adding new retail'
    }
    const {email,phonenumber}= req.body;
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(email==""){
        res.render("form2",{vlmerr:'email input is empty!',vlm,dis:"display:block;",vtitle:'retail' });
    }else if(!emailRegex.test(email)){
        res.render("form2",{vlmerr:'Invalid email address !',vlm,dis:"display:block;",vtitle:'retail'});
    }
    else if(phonenumber==""){
        res.render("form2",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;", vtitle:'retail'});
    }else if(phonenumber.length>11){
        res.render("form2",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;",vtitle:'retail' });
    }else{
        console.log(email,phonenumber)
    }
  }

  exports.vlmusersf=async(req,res)=>{
    const vlm={
      title:"new user",
      description:'adding new retail'
    }
    const {email,phonenumber}= req.body;
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(email==""){
        res.render("sop",{vlmerr:'email input is empty!',vlm,dis:"display:block;",vtitle:'retail' });
    }else if(!emailRegex.test(email)){
        res.render("sop",{vlmerr:'Invalid email address !',vlm,dis:"display:block;",vtitle:'retail'});
    }
    else if(phonenumber==""){
        res.render("sop",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;", vtitle:'retail'});
    }else if(phonenumber.length>11){
        res.render("sop",{vlmerr:'your phonenumber should be exactly 10 numbers !',vlm,dis:"display:block;",vtitle:'retail' });
    }else{
        // add user to database and send a verification link to verify user
        console.log(email,phonenumber)
    }
  }