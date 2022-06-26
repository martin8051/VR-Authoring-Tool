const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    }
});

//creating a collection
const User = new mongoose.model("Users", userSchema);
module.exports = User;
