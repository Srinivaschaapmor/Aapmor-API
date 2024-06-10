const mongoose = require("mongoose");

// TODO: RESUME
const jobApplicantSchema = new mongoose.Schema(
  {
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      // required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    resume: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      // required: true,
      enum: ["linkedIn", "naukri", "employeeReference", "selfApply"],
      default: "selfApply",
    },
    status: {
      type: String,
      // required: true,
      enum: [
        "yetToInitiate",
        "noResponse",
        "notInterested",
        "waitingForInterview",
        "movedToInterview",
      ],
    },
    initialImpression: {
      type: Number,
      // required: true,
      max: 10,
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const JobApplicant =
  mongoose.models.JobApplicant ||
  mongoose.model("JobApplicant", jobApplicantSchema);

module.exports = JobApplicant;
