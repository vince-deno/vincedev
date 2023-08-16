// deno-lint-ignore-file
const passport =require('passport')
const GoogleStrategy=require('passport-google-oauth20');
const FacebookStrategy =require('passport-facebook');
const TwitterStrategy=require('passport-twitter');
const google = require('../keys')


passport.use(new GoogleStrategy({
    clientID:google.clientId,
    clientSecret:google.clientSecret,
    callbackURL: "/auth/google/redirect",
    profileFields:['emails','dsplayname','name','picture'],
  },
  function(accessToken, refreshToken, profile, done) {
    return  done(null, profile);
  }
));
passport.use(new FacebookStrategy({
  clientID:google.fbclentId,
  clientSecret: google.fbclientsecrect,
  callbackURL: "/auth/facebook/redirect",
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));





passport.use(
  new TwitterStrategy(
    {
      consumerKey:google.twitter_id,
      consumerSecret: google.twittersecrect,
      callbackURL: 'http://localhost:9040/auth/twitter/redirect',
    },
    (token, tokenSecret, profile, done) => {
      // Your verification callback function

      // ...
      
      return done(null,profile)
      // save user only 
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  // Retrieve user object based on the 'id' (e.g., user ID) from your database or any other data source
  // Example: User.findById(id, (err, user) => { done(err, user); });
});