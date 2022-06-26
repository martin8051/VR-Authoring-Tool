var express = require('express');
var router = express.Router();
const User = require("../models/users.js");
var CryptoJS = require("crypto-js"); //Library for encryption
var urlSafeEncrypt = require("../utils_modules/lib/urlSafeEncrypt");
require("../db/connect");

/* GET home page. */
router.get('/', function(req, res, next) {
    const emailAddress = req.query.email ? req.query.email : "";
    res.render("signUp", {title: "VR Lab - Sign Up", email: emailAddress});
});

//create a new user in our database
router.post("/", async(req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // const cpassword = req.body.confirmpassword;
        
        // verify user doesn't already have an existing account
        await User.findOne({email: email}, async function(error, user){
            if(error) return res.status(200).send({signedUp: false, message: "An error occurred while creating your account."});
            
            if(user) return res.status(200).send({signedUp: false, message: `You already have an account using ${email}.`});
            else
            {
                // user account does not exist, create account
                const registerUser = new User({
                    email: email,
                    password: password,
                    accountType: req.body.accountType,
                    fullName: req.body.fullName
                });
                const registered = await registerUser.save();
                // if user was saved successfully and registered, return 200 and a message
                if(registered)
                {
                    var ciphertext = urlSafeEncrypt.enc(JSON.stringify({'_id': registered._id}));
                    return res.status(200).send({signedUp: true, user, redirect: `/dashboard/${ciphertext}`, message: "Your account was successfully created."});
                }
                else
                    return res.status(200).send({signedUp: false, message: "Unable to create your account."});
            }
        });
    }
    catch (err) {
        // console.log(err);
        res.status(400).send({signedUp: false, message: "Oh no! An error occurred on the server. Please contact support."});
    }
});


module.exports = router;
