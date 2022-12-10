const mongoose = require("mongoose");
const { Employer } = require("./Employer");
const { Industry } = require("./industry");
const Organization = require("./Organization");
const { Schema } = mongoose;

// Define Job schema.
const JobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: false,
    },
    description: {
      type: String,
      required: true,
    },
    keywords: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    duration: {
      type: Number,
      enum: [2, 3, 4],
      default: 2,
    },
    expiresAt: {
      type: Date,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
      default: "fullTime",
    },
    seniority: {
      type: String,
      enum: ["entry", "mid", "senior"],
      required: true,
      default: "entry",
    },
    requirements: {
      education: {
        type: String,
        default: "B.Sc",
        enum: ["B.Sc", "HND", "OND", "SSCE"],
      },
      language: {
        type: String,
        default: "English",
        required: true,
      },
    },
    salary: {
      type: {
        type: String,
        enum: ["annual", "monthly"],
        required: true,
        default: "monthly",
      },
      min: { type: String },
      max: { type: String },
      currency: {
        type: String,
        enum: ["NGN", "USD", "CAD"],
        required: true,
        default: "NGN",
      },
    },
    industry: {
      type: String,
      ref: Industry,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Employer,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Organization,
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
          "Abuja",
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
    hiringFor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
function arrayLimit(val) {
  return val.length <= 10;
}

JobSchema.pre("save", async function (next) {

  this.expiresAt = +new Date() + (this.duration*7* 24 * 60 * 60 * 1000); 
  next();
});



// Create BlogPost model.
const Job = mongoose.model("job", JobSchema);

module.exports = Job;
