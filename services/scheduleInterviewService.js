const mongoose = require("mongoose");
const InterviewSchedule = require("../models/interviewScheduleModel");
// const { ObjectId } = require("mongodb");
const ObjectId = mongoose.Types.ObjectId;
// CREATE a recruitment applicant
const create = async (interviewData) => {
  try {
    const interviewSchedule = await InterviewSchedule.create(interviewData);
    return interviewSchedule;
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Error creating data");
  }
};

const get = async () => {
  try {
    const interviewTest = await InterviewSchedule.find({});
    return interviewTest;
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Error creating data");
  }
};

const getCandidateDetails = async (interviewerEmail, id) => {
  try {
    const matchCondition = {};
    if (interviewerEmail) {
      matchCondition.interviewerEmail = interviewerEmail;
    }

    if (id) {
      matchCondition._id = new mongoose.Types.ObjectId(id);
    }
    console.log({ matchCondition });
    const applicantsDetails = await InterviewSchedule.aggregate([
      {
        $match:
          // _id: new mongoose.Types.ObjectId("664f11b5f83e5101062187a6"),
          matchCondition,
      },
      {
        $lookup: {
          from: "recruitmentdetails",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      {
        $project: {
          interviewer: 1,
          interviewDate: 1,
          interviewStartTime: 1,
          interviewEndTime: 1,
          file: 1,
          interviewType: 1,
          interviewMode: 1,
          interviewRound: 1,
          candidateDetails: 1,
        },
      },
    ]);
    console.log({ applicantsDetails });
    if (!applicantsDetails || applicantsDetails.length === 0) {
      throw new Error("No data found");
    }

    return applicantsDetails;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be caught by the controller
  }
};

module.exports = {
  create,
  get,
  getCandidateDetails,
};
