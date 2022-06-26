const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labSchema = new Schema({

    labUrl: {
        type: String,
        required: true,
        unique: true
    },
    labTitle: {
        type: String,
        required: true
    },
    labTime: {
        type: String,
        required: true
    },
    labDate: {
        type: Date,
        required: true
    },
    labVRScene: {
        type: String,
        required: true
    },
    labFileContent: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
})


//creating a collection

const Lab = new mongoose.model("Lab", labSchema);
module.exports = Lab;
