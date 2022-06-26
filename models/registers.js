const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
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
const Register = new mongoose.model("Registers", registerSchema);
module.exports = Register;
