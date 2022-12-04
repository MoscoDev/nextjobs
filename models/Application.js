const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Job schema.
const ApplicationSchema = new Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
    },
    resume: {
      type: String,
      required: "false",
    },
    coverLetter: {
      type: String,
      required: "false",
    },
  },
  { timestamps: true }
);


// Create BlogPost model.
const Job = mongoose.model("application", ApplicationSchema);

module.exports = Job;
