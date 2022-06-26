const express = require('express');
require("../db/connect"); //Connect to database
const router = express.Router({mergeParams: true});
const cryptoRandomString = require('crypto-random-string');
var CryptoJS = require("crypto-js");        
const path = require('path');
const multer = require("multer");
const crypto = require("crypto");
const gridfs_storage = require("multer-gridfs-storage");
const gridfs_stream = require("gridfs-stream");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
var urlSafeEncrypt = require("../utils_modules/lib/urlSafeEncrypt"); //Helper function for encrpyt/decrypt
const bodyParser = require('body-parser');
var User = require("../models/users");   

const conn = mongoose.connection;
gridfs_stream.mongo = mongoose.mongo;

let gfs;

conn.once('open', function () {
  gfs = gridfs_stream(conn.db);
  gfs.collection('fileuploads');
})

// Create storage engine

const storage = new gridfs_storage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        //const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: file.originalname,
          
          bucketName: 'fileuploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route GET /
// @desc Loads form
router.get('/', async (req, res, next) => {
    const userId = req.params.userID;
    let decryptedData;
    
    // try decrypting string generated after authentication which contain the user's id 
    try {
        decryptedData = await JSON.parse(urlSafeEncrypt.dec(userId)); 
    }
    // if the string cannot be decrypted, redirect user to login
    // this prevents anyone from just entering any random strings after dashboard
    // Ie. '../dashboard/user-enters-random-string-here' gets redirect to login
    catch(error) {
        console.log('rediecting user');
        return res.redirect('/sign-in')
    }
    
    let data= {};
    
    await User.findById(decryptedData._id, function(error, user) {
        if(error) return error;
        
        if(user) {
          data.fullName = user.fullName;
          data.accountType = user.accountType;
          data.userId = req.params.userID;
          data.layout = 'dashboard';
          data.title = 'VR Lab - Libraries';
          
          // res.cookie("userID", (decryptedData._id).toString(), {maxAge: new Date(86400+Date.now())});
        }
        else {
          res.redirect('/sign-in');
        }
    }).lean();
    
    // TO-DO get user account type
    
    res.render('library', data); //{ title: 'Libraries', userId: req.params.userID, layout: 'dashboard'});
  //gfs.files.find().toArray((err, files) => {
    // Check if files
    // if (!files || files.length === 0) {
    //   res.render('libraries', { files: false });
    // } else {
    //   files.map(file => {
    //     if (
    //       file.contentType === 'image/jpeg' ||
    //       file.contentType === 'image/png'
    //     ) {
    //       file.isImage = true;
    //     } else {
    //       file.isImage = false;
    //     }
    //   });
    //   res.render('libraries', { files: files });
    //}
 // });
});

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.single('file'), async (req, res, next) => {
  
    const userId = req.params.userID;
    let decryptedData;
    
    // try decrypting string generated after authentication which contain the user's id 
    try {
        decryptedData = await JSON.parse(urlSafeEncrypt.dec(userId)); 
    }
    // if the string cannot be decrypted, redirect user to login
    // this prevents anyone from just entering any random strings after dashboard
    // Ie. '../dashboard/user-enters-random-string-here' gets redirect to login
    catch(error) {
        console.log('rediecting user');
        return res.redirect('/sign-in')
    }
    
    res.redirect(`/dashboard/${userId}/library`);
});

// @route GET /files
// @desc  Display all files in JSON
// router.get('/libraries', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'No files exist'
//       });
//     }

//     // Files exist
//     return res.json(files);
//   });
// });

// @route GET /files/:filename
// @desc  Display single file object
// router.get('/libraries/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     // File exists
//     return res.json(file);
//   });
// });

// @route GET /image/:filename
// @desc Display Image
// router.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }

//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       });
//     }
//   });
// });

// @route DELETE /files/:id
// @desc  Delete file
// router.delete('/libraries/:id', (req, res) => {
//   gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }

//     res.redirect('/');
//   });
// });

module.exports = router;