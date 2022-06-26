var objectID = require("mongodb").ObjectID;
var express = require('express');
const cryptoRandomString = require('crypto-random-string');
var router = express.Router();
var User = require("../models/users");                           //Connect to schema
var CryptoJS = require("crypto-js");                                 //Library for encryption
var urlSafeEncrypt = require("../utils_modules/lib/urlSafeEncrypt"); //Helper function for encrpyt/decrypt
var labSelector = require("../utils_modules/lib/labSelector");
const Labs = require('../models/labs');
var assert = require('assert');
const fs = require('fs');
const libraryRoute = require("./library");

//Schema for labs
require("../db/connect");

let files = [];

//GET Dashboard page
router.get('/', function(req, res, next) {
    return res.redirect('/sign-in');
});


router.get('/:userID/', async function(req, res, next) {
    // return res.send(decryptedData);
    var decryptedData;
    
    // try decrypting string generated after authentication which contain the user's id 
    try {
      decryptedData = await JSON.parse(urlSafeEncrypt.dec(req.params.userID)); 
    }
    // if the string cannot be decrypted, redirect user to login
    // this prevents anyone from just entering any random strings after dashboard
    // Ie. '../dashboard/user-enters-random-string-here' gets redirect to login
    catch(error) {
      console.log('rediecting user');
      return res.redirect('/sign-in')
    }
    
    let data = {};
    
    await User.findById(decryptedData._id, function(error, user) {
        if(error) return error;
        
        if(user) {
          data.title = `VR Lab - Dashboard`;
          data.fullName = user.fullName;
          data.accountType = user.accountType;
          data.userId = req.params.userID;
          data.layout = 'dashboard';
          
          res.cookie("userID", (decryptedData._id).toString(), {maxAge: new Date(86400+Date.now())});
        }
        else {
          res.redirect('/sign-in');
        }
    }).lean();
    
    await Labs.find().populate('teacher').exec(function(error, lab) {
        if(error) {
            console.log(error);
            return error;
        }
        if(lab) {
            data.labs = JSON.parse(JSON.stringify(lab));
            // var data = {fullName: decryptedData.fullName, accountType: decryptedData.accountType, labs: lab, layout: 'dashboard'};
            // res.cookie("userID", (decryptedData._id).toString(), {maxAge: new Date(86400+Date.now())});
            // res.render("dashboard", data);
            res.status(200).render('dashboard', data);
        }
    }); //Get json object 
    
});

// define sub route /library using library route 
router.use('/:userID/library', libraryRoute);

router.get('/:userID/lab', async function(req, res, next) {
  res.send("Hello user " + req.params.userID + ". Loading your lab.");
});


router.get('/lab/:labUrl', async function(req, res, next) {
    try {
        await Labs.findOne({'labUrl': req.params.labUrl}, function(err, lab) {
            if(err) {
                console.log(err);
                return err;
            }
            if(lab) {
                var data = {
                    title: `VR Lab - ${lab.labTitle} Lab`,
                    fileContent: lab.labFileContent,    // append returned fileContent from database to key
                    layout: 'aframe'                    // use aframe_layout.hbs as layout
                };
                res.render('lab', data);   
                // res.send(data);
            }
        });
    }
    catch(err) {
        res.send(err);
    }
});

//Update Settings Page
router.post('/:userID/settings-update', async (req, res, next) =>{
    let updateQuery = {};
    var fullName = req.body.fullName;
    //var cpi = req.body.currentPassInput;
    var npi = req.body.newPassInput;
    var rnpi = req.body.reNewPassInput;
    
    if(fullName|| fullName > 0) {
      try {
        await User.updateOne( {"_id": objectID(req.cookies["userID"])}, {'fullName': fullName}, function(err, result) {
            assert.equal(null, err);
            // console.log('Item Inserted');
            res.status(200).send({message: 'Name updated.'});
        });
      }
      catch(err) {
        console.log('Error Updating Name');
        console.log(err);
      }
    }

    if((npi || npi > 0) && (rnpi || rnpi > 0) && (npi === rnpi)) {
      try {
        // res.status(200).send({message: 'Password Updated.'});
        console.log('Updating password');
        await User.updateOne( {"_id": objectID(req.cookies["userID"])}, {'password': npi}, function(err, result) {
          if(err) return res.status(200).send({message: "Couldn't update password."})
          // assert.equal(null, err);
            // console.log('Item Inserted');
          res.status(200).send({message: 'Password updated.'});
        });
      }
      catch(err) {
        console.log('Error Updating Password');
        console.log(err);
      }
    
   }
    else {
        res.status(200).send({message: 'Check your Input Fields!'});
        res.send("Check your Input Fields!")
    }
});



router.post('/lab/:labUrl/save', async function(req, res, next) {
    try 
    {
      const changes = req.body;

      // Prompt to confirm.
      console.log([
          `\nA-Frame Inspector from ${req.hostname} has requested the following changes:\n`,
          `${prettyPrintChanges(changes)}`,
          'Do you allow the A-Frame Inspector Watcher to write these updates directly ' +
          'within this directory?'
      ].join('\n'));
    
      // const prompt = new Confirm('Y/n');
      // prompt.run().then(answer => {
      //   // Denied.
      //   if (!answer) { res.sendStatus(403); }
            
      //   // Accepted.
      //   sync(changes);
      //   res.sendStatus(200);
      // });
      
          // Accepted.
      sync(changes);
      res.sendStatus(200);
        
      await Labs.findOne({'labUrl': req.params.labUrl}, function(err, lab)
      {
          if(err) 
          {
              console.log(err);
              return err;
          }
          
          if(lab)
          {
              res.status(200).send('Successfully updated!');
          }
      });
    }
    catch(err)
    {
        res.send(err);
    }
});

router.post('/:userID/save-lab', async (req, res, next) => {
    // get data sent from client
    let title = req.body.title;
    let time = req.body.startTime;
    let date = req.body.startDate;
    let vrScene = req.body.vrScene;
    let teacherIDString = req.cookies["userID"];
    
    try {
        var labUrlString = cryptoRandomString({length: 25, type: 'url-safe'});
        // console.log('url-string generated: ' + labUrlString);
        
        var lab = new Labs({
            labUrl: labUrlString,
            labTitle: title,
            labTime: time,
            labDate: date,
            labVRScene: vrScene,
            labFileContent: labSelector.getLab(vrScene),
            teacher: teacherIDString
        });
        
        await lab.save();
        // if lab was saved successfully, return 200 and a message
        return res.status(200).send({message: `${title} created.`});
    } catch(err) {
        // error occurred during saving, return 500 and a message
        return res.status(500).send({name: err.name, message: err.message});
    }

});

// update lab
router.post('/:userID/update-lab', async (req, res, next) => {
    // get data sent from client
    let updateQuery = {};
    updateQuery.labTitle = req.body.title;
    updateQuery.labTime = req.body.startTime;
    updateQuery.labDate = req.body.startDate;
    updateQuery.labVRScene = req.body.vrScene;
    updateQuery.labFileContent= labSelector.getLab(req.body.vrScene);
    // console.log(updateQuery)
    
    try {
        await Labs.updateOne({_id: req.body.id}, updateQuery, {new: true}, function(err, lab) {
            if(err) return res.status(200).send({message: `Unable to update ${req.body.title}.`})
            
            // if lab was saved successfully, return 200 and a message
            return res.status(200).send({message: `${req.body.title} updated.`});
          
        });
    } catch(err) {
        // error occurred during saving, return 500 and a message
        return res.status(500).send({name: err.name, message: err.message});
    }

});

// deleting lab
router.delete('/:userID/delete-lab', (req, res, next) => {
  try {
    Labs.deleteOne({_id: req.body.labId}, (err, lab) => {
      if(err) return res.status(200).send({deleted: 0, message: `Could not delete ${req.body.labTitle}.`});
      if(lab) return res.status(200).send({deleted: 1, message: `${req.body.labTitle} deleted.`})
    });
  }
  catch(err) {
    res.status(500).send({errorName: err.name, message: err.message});
  }
});

router.get('/logout', function(req, res, next) {
   res.redirect('/'); 
});


// A-Frame Watcher
function prettyPrintChanges (changes) {
  let output = '';
  Object.keys(changes).forEach(id => {
    output += `#${id}:\n`;
    Object.keys(changes[id]).forEach(component => {
      if (typeof changes[id][component] === 'object') {
        output += `  ${component}:\n`;
        Object.keys(changes[id][component]).forEach(property => {
          output += `    ${property}: ${changes[id][component][property]}\n`;
        });
      } else {
        output += `  ${component}: ${JSON.stringify(changes[id][component])}\n`;
      }
    });
    output += '\n';
  });
  return output;
}

function sync (changes) {
  files.forEach(file => {
    const contents = updateFile(file, fs.readFileSync(file, 'utf-8'), changes);
    fs.writeFileSync(file, contents);
  });
  console.log('Sync complete.');
}

/**
 * Given changes, scan for IDs, and write to HTML file.
 */
function updateFile (file, content, changes) {
  // Matches any character including line breaks.
  const element = '(<a-[\\w]+)';
  const filler = '([^]*?)';
  const whitespace = '[\\s\\n]';
  const propertyDelimit = '["\\s;\]';

  Object.keys(changes).forEach(id => {
    // Scan for ID in file.
    const regex = new RegExp(`${element}${filler}(${whitespace})id="${id}"${filler}>`);
    const match = regex.exec(content);
    if (!match) { return; }

    // Might match unwanted parent entities, filter out.
    const entitySplit = match[0].split('<a-');
    let entityString = '<a-' + entitySplit[entitySplit.length - 1];
    const originalEntityString = entityString;

    // Post-process regex to get only last occurence.
    const idWhitespaceMatch = match[3];

    // Scan for components within entity.
    Object.keys(changes[id]).forEach(attribute => {
      // Check if component is defined already.
      const attributeRegex = new RegExp(`(${whitespace})${attribute}="(.*?)(;?)"`);
      const attributeMatch = attributeRegex.exec(entityString);
      const value = changes[id][attribute];

      if (typeof value === 'string') {
        // Single-property attribute match (e.g., position, rotation, scale).
        if (attributeMatch) {
          const whitespaceMatch = attributeMatch[1];
          // Modify.
          entityString = entityString.replace(
            new RegExp(`${whitespaceMatch}${attribute}=".*?"`),
            `${whitespaceMatch}${attribute}="${value}"`
          );
        } else {
          // Add.
          entityString = entityString.replace(
            new RegExp(`${idWhitespaceMatch}id="${id}"`),
            `${idWhitespaceMatch}id="${id}" ${attribute}="${value}"`
          );
        }
      } else {
        // Multi-property attribute match (e.g., material).
        Object.keys(value).forEach(property => {
          const attributeMatch = attributeRegex.exec(entityString);
          const propertyValue = value[property];

          if (attributeMatch) {
            // Modify attribute.
            let attributeString = attributeMatch[0];
            const whitespaceMatch = attributeMatch[1];
            const propertyRegex = new RegExp(`(${propertyDelimit})${property}:(.*?)([";])`);
            propertyMatch = propertyRegex.exec(attributeMatch);

            if (propertyMatch) {
              // Modify property.
              const propertyDelimitMatch = propertyMatch[1];
              attributeString = attributeString.replace(
                new RegExp(`${propertyDelimitMatch}${property}:(.*?)([";])`),
                `${propertyDelimitMatch}${property}: ${propertyValue}${propertyMatch[3]}`
              );
            } else {
              // Add property to existing.
              attributeString = attributeString.replace(
                new RegExp(`${whitespaceMatch}${attribute}="(.*?)(;?)"`),
                `${whitespaceMatch}${attribute}="${attributeMatch[2]}${attributeMatch[3]}; ${property}: ${propertyValue}"`
              );
            }

            // Update entity string with updated component.
            entityString = entityString.replace(attributeMatch[0], attributeString);
          } else {
            // Add component entirely.
            entityString = entityString.replace(
              new RegExp(`${idWhitespaceMatch}id="${id}"`),
              `${idWhitespaceMatch}id="${id}" ${attribute}="${property}: ${propertyValue}"`
            );
          }
        });
      }

      console.log(`Updated ${attribute} of #${id} in ${file}.`);
    });

    // Splice in updated entity string into file content.
    content = content.replace(originalEntityString, entityString);
  });

  return content;
}
module.exports.updateFile = updateFile;

/**
 * What files to edit, can be passed in as glob string.
 */
function getWorkingFiles () {
  let files = [];

  if (process.argv.length <= 2) {
    return glob.sync('**/*.html');
  }

  process.argv.forEach(function (val, index, array) {
    if (index < 2) { return; }

    if (fs.lstatSync(val).isDirectory()) {
      if (!val.endsWith('/')) { val += '/'; }
      val += '**/*.html';
    }

    files = files.concat(glob.sync(val));
  });

  return files;
}

module.exports = router;

