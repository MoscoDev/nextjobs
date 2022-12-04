const mongoose = require("mongoose")
const {Schema} = mongoose

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "there is a"],
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
  about:{
    type: String,
    min: 20,
    max: 600
  },
  location: {
    country: {
      type: String,
      default: "Nigeria",
    },
    state: {
      type: String,
      enum: [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "FCT",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara",
      ],
    },
  },
  size: {
    type: String,
    enum: ["1 - 10", "11 - 100", "above 100"],
    default: ["1 - 10"],
  },
});



const Organization = mongoose.model("organization", OrganizationSchema);
module.exports = Organization;