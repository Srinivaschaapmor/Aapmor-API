const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
  },
  branch: {
    type: String,
  },
  yearOfPass: {
    type: String,
  },
  cgpa: {
    type: Number,
  },
});

const experienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  previousRole: {
    type: String,
  },
  experience: {
    type: String,
  },
});

const interviewRoundsSchema = new mongoose.Schema({
  interviewType: {
    type: String,
  },
  interviewRound: {
    type: String,
  },
  interviewer: {
    type: String,
  },
  interviewMode: {
    type: String,
  },
  techRating: {
    type: String,
  },
  commRating: {
    type: String,
  },
  criticalThinkingRating: {
    type: String,
  },
  softSkills: {
    type: String,
  },
  feedback: {
    type: String,
  },
  status: {
    type: String,
  },
});

const recruitmentDetailsSchema = new mongoose.Schema(
  {
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      // required: true,
    },
    jobApplicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplicant",
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
    source: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      // required: true,
    },
    education: {
      type: educationSchema,
      // required: true,
    },
    experience: {
      type: experienceSchema,
      // required: true,
    },
    technicalSkills: {
      type: [String],
      // required: true,
    },
    interviewRounds: {
      type: [interviewRoundsSchema],
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RecruitmentDetails =
  mongoose.models.RecruitmentDetails ||
  mongoose.model("RecruitmentDetails", recruitmentDetailsSchema);

module.exports = RecruitmentDetails;
