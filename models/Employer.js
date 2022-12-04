const mongoose = require("mongoose")
const {Schema} = mongoose

const EmployerSchema = new Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    tel: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "A user must have an password"],
      select: false,
    },
    role: {
      type: String,
      default: "employer",
    },
    organization: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Orgnization"
    },
  },
  { timestamps: true }
);


const Employer = mongoose.model("employer", EmployerSchema)
module.exports = Employer