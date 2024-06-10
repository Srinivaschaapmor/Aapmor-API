const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const interviewScheduleSchema = new mongoose.Schema(
  {
    candidateId: {
      type: ObjectId,
    },
    candidateName: {
      type: String,
      required: true,
    },
    candidateDepartment: {
      type: String,
    },
    interviewRound: {
      type: String,
    },
    interviewMode: {
      type: String,
    },
    interviewType: {
      type: String,
    },
    interviewDate: {
      type: String,
    },
    interviewStartTime: {
      type: String,
    },
    interviewEndTime: {
      type: String,
    },
    interviewerEmail: {
      type: String,
    },
    candidateEmail: {
      type: String,
    },
    file: {
      type: String,
    },
    candidateFile: {
      type: String,
    },
    interviewer: {
      type: String,
    },
    employeeId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSchedule =
  mongoose.models.InterviewSchedule ||
  mongoose.model("interviewSchedule", interviewScheduleSchema);
module.exports = InterviewSchedule;
