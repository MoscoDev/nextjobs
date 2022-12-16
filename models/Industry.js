const mongoose = require("mongoose");
const { Schema } = mongoose;

const IndustrySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    id:{
        type:String,
        unique: true,
        require:true
    }
    
},{timestamps:true})
const Industry = mongoose.model("industry", IndustrySchema)
module.exports = {Industry}
