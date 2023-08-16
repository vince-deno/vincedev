// deno-lint-ignore-file
// import vlmnewUser from '../controller/admin.js';

const express = require('express');
const vlmrouter =express.Router();
const nodemailer = require('nodemailer')
const vlmuserfire = require('../controller/firebase')
const  newUser = require('../controller/user')
const path=require('path');
const passport= require("passport");
const vlmcont= require('../controller/vlmcont')
const newUserad= require('../controller/admin')
const {v4:vlmuuid} = require('uuid')
const newUsevery = require('../controller/vlmverify');
require("dotenv").config();
let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user:process.env.vlm_mail,
      pass: process.env.vlm_pass
    }
  });
const bcrypt = require("bcrypt");

   

// Replace these values with your actual email credentials
const emailConfig = {
  service: 'Gmail', // Replace with your email service provider (e.g., 'Gmail', 'Outlook', 'Yahoo', etc.)
  auth: {
    user: 'baged.verify@gmail.com', // Replace with your email address
    pass: 'joajurzjlzgvrirm' // Replace with your email password
  }
};

// Function to send an email
async function vlmsendEmail({_id,email}, subject, text,res) {
      // Create a transporter using the emailConfig settings
    const transporter = nodemailer.createTransport(emailConfig);
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
                 const vlmviews= path.join(__dirname,"../vlmapp/login");
                 const vlm={
                  title:"login failed",
                  description:"Buy any thing eg clothes cars electronics other products"
              }
                 res.render(vlmviews,{vlmerr:'verification is sent check your inbox !',vlm,dis:"display:block;background:#00ff00;color:blue;",vlm_client_id:"108264616911711661880" });

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

// Example usage:
// Replace 'recipient_email@example.com' with the recipient's email address
// Replace 'Test Email' with the subject of the email
// Replace 'This is a test email.' with the body/content of the email

// const { body, validationResult } = require('express-validator');

vlmrouter.get('/admin',vlmcont.vlmadmin)
vlmrouter.get('/admin/add',vlmcont.vlmnew)
vlmrouter.get('/admin/users/add',vlmcont.vlmadd)
vlmrouter.get('/admin/view',vlmcont.vlmview)
vlmrouter.get('/admin/supermarkert',vlmcont.vlmadds)
// Validation rules for the supermarket form
// const supermarketValidationRules = [
//   body('name').notEmpty().withMessage('Name is required').escape(),
//   // Add more validation rules as needed
// ];
const { body,matchedData, validationResult } = require('express-validator');

vlmrouter.post('/admin/supermarket',  // Validation middleware using express-validator
[
  body('title').notEmpty().withMessage('title is required'),
  body('content').notEmpty().withMessage('content is required'),
],vlmcont.vlmaddspost)

vlmrouter.get('/admin/users-profile',vlmcont.vlmprofile)
vlmrouter.get('/admin/adminusers',vlmcont.vlmadminuser)
vlmrouter.get('/admin/users',vlmcont.vlmusers)
vlmrouter.get('/admin/agents',vlmcont.vlmagent)
vlmrouter.get('/admin/users/new',vlmcont.vlmusersz)
vlmrouter.get('/admin/retailers',vlmcont.vlmretail)
vlmrouter.get('/admin/agents/new',vlmcont.vlmagentz)
vlmrouter.get('/admin/retail/new',vlmcont.vlmretailz)
vlmrouter.get('/admin/Featuredproducts',vlmcont.vlmfd)
vlmrouter.get('/admin/Agrovetproducts',vlmcont.vlmag)
vlmrouter.get('/admin/Fashionwear',vlmcont.vlmfw)
vlmrouter.get('/admin/spares',vlmcont.vlmmotor)
vlmrouter.get('/admin/electronics',vlmcont.vlmelect)
vlmrouter.get('/admin/HardwareProducts',vlmcont.vlmhard)
vlmrouter.get('/admin/Games',vlmcont.vlmganes)
vlmrouter.get('/admin/Books',vlmcont.vlmbooks)
vlmrouter.get('/admin/BabyProducts',vlmcont.vlmbaby)
vlmrouter.get('/admin/LatestProducts',vlmcont.vlmlp)
vlmrouter.get('/admin/secondhanditems',vlmcont.vlmsd)
vlmrouter.get('/admin/trading',vlmcont.vlmt)
vlmrouter.get('/admin/Health',vlmcont.vlmth)

vlmrouter.get('/',vlmcont.vlmhome)
vlmrouter.get('/login',vlmcont.vlmlog)
vlmrouter.get('/signup',vlmcont.vlmreg)

vlmrouter.post('/signup',vlmcont.vlmpostreg)
vlmrouter.post('/login',vlmcont.vlmpostlog)
vlmrouter.post('/admin/add',vlmcont.vlmpostadd)
vlmrouter.post('/admin/agents/new',vlmcont.vlmagents)
vlmrouter.post('/admin/retail/new',vlmcont.vlmretails)
vlmrouter.get('/verify/:id1/:id2',vlmcont.vlmvery)
vlmrouter.get('/submit/:userId/:vlmstr',vlmcont.vlmverify)

vlmrouter.get('/connectionlost',vlmcont.vlmrouters);
vlmrouter.get('/products',vlmcont.vlmprod)
// Function to generate a random password

function vlmgenpass(length = 30) {
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const allChars = specialChars + lowercaseLetters + uppercaseLetters + numbers;

  if (length < 8) {
    throw new Error('Password length must be at least 8 characters.');
  }

  const password = [
    specialChars[Math.floor(Math.random() * specialChars.length)],
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)],
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)],
    numbers[Math.floor(Math.random() * numbers.length)]
  ];

  for (let i = 4; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle the password characters
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}


// Function to send an email with the generated password










vlmrouter.post('/admin/users/new',vlmcont.vlmusersf)
vlmrouter.get('/auth/google/redirect',passport.authenticate('google', { failureRedirect: '/login' }),async (req, res) => {
  // Redirect or respond as desired, or simply log the user data and end the response
  const vlmemail =req.user._json.email
  const vlmname =req.user._json.name
  const vlmimg =req.user._json.picture
  const gy=req.user

      try {
        const usersExist = await vlmcheckif();
        if (usersExist) {
          // check if user is admin send mail and redirect to admin
          // check for mongodb first
            newUserad.find({}).then(async (data)=>{
     
              
                if(data.length==0){
               
                  console.log("no admins found...")
                  const snapshot = await vlmuserfire.get();
                  const users = [];
              
                  snapshot.forEach((doc) => {
                    // doc.data() returns the user data as an object
                    users.push(doc.data());
                  });
                  const {email,id,name,photo}=users[1]
                  const ft=users[0]
              
                  // const {}=users[0]
                  // Example usage
              
              const password =  vlmgenpass(24);
              
              const salt =10
              const typass=await bcrypt.hash(password,salt)
                  const fi =await new newUserad(
                    {
                    vlmid:Object.freeze(id),
                    vlmname:Object.freeze(name),
                    vlmprofile:Object.freeze(photo),
                    vlmphone:Object.freeze("no phonenumber"),
                    vlmemail:Object.freeze(email),
                    vlmpassword:Object.freeze(typass),
                    vlmverify:false,
                  }
                  )
                  const f=await new newUserad(
                    {
                    vlmid:Object.freeze(ft.id),
                    vlmname:Object.freeze(ft.name),
                    vlmprofile:Object.freeze(ft.photo),
                    vlmphone:Object.freeze("no phonenumber"),
                    vlmemail:Object.freeze(ft.email),
                    vlmpassword:Object.freeze(typass),
                    vlmverify:false,
                  })
                  const hasd=  password;
                  await f.save().then(async (ft)=>{
                    const ro={
                      _id:ft._id,
                      email:ft.vlmemail
                    }
                    await vlmsendEmail(ro,'Your admin login password and verification link',hasd,res)
                  });
                  await fi.save().then(async (ft)=>{
                    const ro={
                      _id:ft._id,
                      email:ft.vlmemail
                    }
                    await vlmsendEmail(ro,'Your admin login password and verification link',hasd,res)
                  });
                }else{
                  const guap =data.slice(-2);
                  const ad= guap[0]
                  const ad1 =guap[1]
                  // check if vlmemail ==ad or ad1
                  if (ad1.vlmverify ==false) {
                    const vlmviews= path.join(__dirname,"../vlmapp/login");
                    const vlm={
                     title:"login failed",
                     description:"Buy any thing eg clothes cars electronics other products"
                  }
                    res.render(vlmviews,{vlmerr:' verify your email check your inbox  !',vlm,dis:"display:block;background:#00ff00;color:blue;",vlm_client_id:"108264616911711661880" });
                  }else if(ad.vlmverify ==false ){
                    const vlmviews= path.join(__dirname,"../vlmapp/login");
                    const vlm={
                     title:"login failed",
                     description:"Buy any thing eg clothes cars electronics other products"
                  }
                    res.render(vlmviews,{vlmerr:' verify your email check your inbox  !',vlm,dis:"display:block;background:#00ff00;color:blue;",vlm_client_id:"108264616911711661880" });
                  }
                  else if (vlmemail==ad.vlmemail||vlmemail==ad1.vlmemail) {
                    res.redirect('/admin');
                  }else{
                    // check for client
                    newUser.findOne({ vlmemail }, async (err, user) =>{
                      // res.redirect('/products
                      if( user==null){
                          const password = vlmgenpass(32);
                          const salt =10
                          const hasd=  password;
                          const typass= await bcrypt.hash(password,salt)
                          const rt= await new newUser({
                            name:vlmname,
                            vlmprofile:vlmimg,
                            vlmprofile:"add your profile pic",
                            email:vlmemail,
                            vlmphone:"add number",
                            password:typass,
                            vlmuserlocation:"undefined",
                            vlmverify:false,
                            vlmuser:true
                          })
                          await rt.save().then(async (ft)=>{
                            const fd={
                              _id:ft._id,
                              email:ft.email
                            }
                            if(vlmemail!=fd.email){
                              await rt.save().then(async (ft)=>{
                                const fd={
                                  _id:ft._id,
                                  email:ft.email
                                }
                                await vlmsendEmail(fd,'Your login password and verification link',hasd,res);
                              })
                            }
                            await vlmsendEmail(fd,'Your login password and verification link',hasd,res);
                          })

                      }else{
                        if (user.vlmverify ==false) {
                          const vlmviews= path.join(__dirname,"../vlmapp/login");
                          const vlm={
                           title:"login failed",
                           description:"Buy any thing eg clothes cars electronics other products"
                        }
                          res.render(vlmviews,{vlmerr:' verify your email check your inbox  !',vlm,dis:"display:block;background:#00ff00;color:blue;",vlm_client_id:"108264616911711661880" });
                        }else{
                          res.redirect('/products');
                        }
                      }
                    })
                  }
                }
            })

        } else { 
          // only redirect to client
          res.redirect('/login')   // Add a new user document to the "vlmadmin" collection with an automatically generated ID
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
      

});
async function vlmcheckif() {
  try {
    const snapshot = await vlmuserfire.get();
    return !snapshot.empty;
  } catch (error) {
    throw error;
  }
}
vlmrouter.get('/auth/google', passport.authenticate('google',{
    scope:['profile','email']
}));

// facebook
vlmrouter.get('/auth/facebook',passport.authenticate('facebook'))
vlmrouter.get('/auth/facebook/redirect',passport.authenticate('facebook', { failureRedirect: '/login' }),(req, res) => {
  // Redirect or respond as desired, or simply log the user data and end the response
  console.log('User Data:', req.user); // 'req.user' contains the authenticated user data
  res.send('Authenticated successfully!');
});
vlmrouter.get('/auth/facebook', passport.authenticate('facebook',{
  scope:['profile','email']
}));
// for twitter auth
vlmrouter.get('/auth/twitter',passport.authenticate('twitter'))
vlmrouter.get('/auth/twitter/redirect',passport.authenticate('twitter', { failureRedirect: '/login' }),(req, res) => {
  // Redirect or respond as desired, or simply log the user data and end the response
  // console.log('User Data:', req.user); // 'req.user' contains the authenticated user data
  // console.log(vlmuserfire)
  // const top= {
  //   profile:req.user.photos.value,
  //   display:req.user.displayName
  // }
  // vlmuserfire.add(req)
   // Extract relevant user information
   const { phoneNumber, displayName, photos } = req.user;
   const data={
    phone:phoneNumber,
    displayName:displayName,
    photo:photos[0].value
   }
  //  vlmuserfire.add(data)
  console.log(data)
  res.send('Authenticated successfully!');
});
vlmrouter.get('/auth/twitter', passport.authenticate('twitter',{
  scope:['profile']
}));
module.exports=vlmrouter;