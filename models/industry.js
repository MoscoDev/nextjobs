const mongoose = require("mongoose");
const { Schema } = mongoose;

const IndustrySchema = new Schema({
    name: {
        type: String,
    }
})