var CryptoJS = require("crypto-js");

exports.enc=function (plainText){
    var b64 = CryptoJS.AES.encrypt(plainText, process.env.SECRET_KEY).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
}

exports.dec=function (cipherText){
   var reb64 = CryptoJS.enc.Hex.parse(cipherText);
   var bytes = reb64.toString(CryptoJS.enc.Base64);
   var decrypt = CryptoJS.AES.decrypt(bytes, process.env.SECRET_KEY);
   var plain = decrypt.toString(CryptoJS.enc.Utf8);
   return plain;
}