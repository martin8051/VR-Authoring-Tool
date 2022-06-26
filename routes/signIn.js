var express = require('express');
var router = express.Router();
var User = require("../models/users"); //Connect to schema
var CryptoJS = require("crypto-js"); //Library for encryption
var urlSafeEncrypt = require("../utils_modules/lib/urlSafeEncrypt");
require("../db/connect"); //Connect to database

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('signIn', { title: 'VR Lab - Sign In' });
});


router.post("/", async (req, res, next) => {
    try {
         var email = req.body.email;
         var password = req.body.password;
        
        // await User.findOne({email: email, password: password}, function(error, user){ 
        await User.findOne({email: email}, function(error, user){
            if(error){
                console.log(error);
                return error;
            }
           
            //If user is not found
            if(!user) {
                return res.status(200).send({userExist: false, message: `Account does not exist. <a class="create-account-link" href="sign-up?email=${email}">Create one?</a>`});
            }
            else {
                if(user.password == password)
                {
                    // user exists, so get data and send to dashboard
                    // var ciphertext = urlSafeEncrypt.enc(JSON.stringify(user));
                    var ciphertext = urlSafeEncrypt.enc(JSON.stringify({'_id': user._id}));
                    
                    return res.status(200).send({userExist: true, redirect: `/dashboard/${ciphertext}`}); //sending encrypted data   
                }
                else return res.status(200).send({userExist: false, message: "Incorrect email or password."});
            }
        });
        
    }
    catch(error) {
      res.status(400).send({userExist: false, message: "Oh no! An error occurred on the server. Please contact support."});
    }
    
});

module.exports = router;
 