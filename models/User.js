const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define User schema.
const UserSchema = new Schema(
  {
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
    resume: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    role: {
      type: String,
      default: "applicant",
      immutable: true
    },
  },
  { timestamps: true }
);

// Create User model.
const User = mongoose.model('User', UserSchema);


module.exports = User;
