const firebase = require('./fb_auth');

const vlmdb= firebase.firestore()

const vlmuserfire=vlmdb.collection("vlmadmin")

module.exports =vlmuserfire;


