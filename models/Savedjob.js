const mongoose = require("mongoose");
const Job = require("./Job");
const User = require("./User");

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: User,
    },
    job: {
      type: mongoose.Types.ObjectId,
      ref: Job,
    },
  },
  { timestamps: true }
);

const savedJob = mongoose.model("savedJob", savedJobSchema);
module.exports = savedJob;
