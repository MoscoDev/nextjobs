const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Job schema.
const JobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    Keywords: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    JobType: {
      type: String,
      enum: ["fullTime", "part - time", "contract"],
      required: true,
      default: "fullTime",
    },
    seniority: {
      type: String,
      enum: ["entry", "mid", "senior"],
      required: true,
      default: "fullTime",
    },
    Requirements: {
      education: {
        type: String,
        default: "B.Sc",
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
        enum: ["entry", "mid", "senior"],
        required: true,
        default: "fullTime",
      },
    },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Industry",
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
  },
  { timestamps: true }
);
function arrayLimit(val) {
  return val.length <= 10;
}

// Create BlogPost model.
const Job = mongoose.model("job", JobSchema);

module.exports = Job;
