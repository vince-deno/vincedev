// const firebase = require("firebase");
// const google = require('../keys')
// const credentials={
//     apiKey: google.apiKey,
//     authDomain: google.authDomain,
//     projectId: google.projectId,
//     storageBucket: google.storageBucket,
//     messagingSenderId: google.messagingSenderId,
//     appId: google.appId.appId,
//     measurementId: google.measurementId,
// }


// firebase.initializeApp({
//   credential: firebase.credential.cert(credentials),
//   databaseURL: "https://baged-392918.firebaseapp.com",
// });

// module.exports = firebase

const firebase = require("firebase-admin");

const credentials = require("./vlm.json");

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  databaseURL: "https://baged-392918.firebaseapp.com",
});

module.exports = firebase