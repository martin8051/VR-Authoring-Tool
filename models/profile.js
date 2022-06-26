const mongoose = require("mongoose");
const schema = mongoose.Schema;

const profileSchema = new schema({
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
    },
    labs: [{ type: schema.Types.ObjectId, ref: 'lab' }]
});

//creating a collection
const Profile = new mongoose.model("Register", profileSchema);
module.exports = Profile;


// const userSchema = new Schema({  
//     nick_name:{type:String},  
//     email: {  
//         type: String,  
//         trim: true,  
//         required: '{PATH} is required!',
//         index: true,
//     },
//     comments: [{ type: Schema.Types.ObjectId, ref:'Comment' }],
//     posts: [{ type: Schema.Types.ObjectId, ref:'Post' }]
// }, {timestamps: true});

// mongoose.model('User', userSchema);
